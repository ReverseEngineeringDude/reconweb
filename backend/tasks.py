import os
import subprocess
import json
import tempfile
import requests
from datetime import datetime
from celery import Celery
from config import Config
from models import db, Scan, Subdomain, LiveHost, Port, Vulnerability, WaybackUrl
from parser import parse_subfinder, parse_httpx, parse_nmap, parse_nuclei, parse_wayback

import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

celery = Celery(__name__, broker=Config.CELERY_BROKER_URL, backend=Config.CELERY_RESULT_BACKEND)

@celery.task
def run_scan_pipeline(scan_id, domain):
    from flask import Flask
    
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    
    with app.app_context():
        scan = Scan.query.get(scan_id)
        if not scan:
            return
            
        try:
            # Phase 1: Subdomain Discovery
            scan.phase = 'subdomains'
            scan.progress = 10
            db.session.commit()
            
            subdomains = []
            try:
                result = subprocess.run(['subfinder', '-d', domain, '-silent', '-json'], capture_output=True, text=True, timeout=300)
                subdomains = parse_subfinder(result.stdout)
                
                # We will process subdomains synchronously for the DB, but frontend wants 'real-time' feeling animations
                # which we will handle purely on the frontend side by animating the table list.
                for sub in subdomains:
                    db.session.add(Subdomain(scan_id=scan_id, host=sub, status='found'))
                db.session.commit()
            except Exception as e:
                db.session.add(Subdomain(scan_id=scan_id, host=f'Error/Skipped: subfinder failed or not installed', status='error'))
                db.session.commit()
                
            scan.progress = 30
            db.session.commit()
            
            # Phase 2: Live Host Detection
            scan.phase = 'live_hosts'
            db.session.commit()
            
            live_hosts = []
            try:
                sub_str = "\n".join(subdomains) if subdomains else domain
                p1 = subprocess.Popen(['echo', sub_str], stdout=subprocess.PIPE)
                p2 = subprocess.Popen(['httpx-toolkit', '-silent', '-json'], stdin=p1.stdout, stdout=subprocess.PIPE, text=True)
                p1.stdout.close()
                output, _ = p2.communicate(timeout=300)
                live_hosts = parse_httpx(output)
                for h in live_hosts:
                    db.session.add(LiveHost(scan_id=scan_id, url=h['url'], status_code=h.get('status_code'), title=h.get('title'), technologies=json.dumps(h.get('technologies', []))))
                db.session.commit()
            except Exception as e:
                db.session.add(LiveHost(scan_id=scan_id, url='Error/Skipped: httpx failed', status_code=0))
                db.session.commit()
                
            scan.progress = 50
            db.session.commit()
            
            # Phase 3: Port Scanning
            scan.phase = 'ports'
            db.session.commit()
            
            live_urls = [h['url'].replace('https://', '').replace('http://', '').split(':')[0] for h in live_hosts]
            live_urls = list(set(live_urls))
            
            try:
                if live_urls:
                    with tempfile.NamedTemporaryFile(mode='w+', delete=False) as f:
                        f.write("\n".join(live_urls))
                        f_name = f.name
                    
                    result = subprocess.run(['nmap', '-sV', '-T4', '-oX', '-', '-iL', f_name], capture_output=True, text=True, timeout=300)
                    ports = parse_nmap(result.stdout)
                    for p in ports:
                        db.session.add(Port(scan_id=scan_id, host=p['host'], port=p['port'], protocol=p.get('protocol'), service=p.get('service'), version=p.get('version')))
                    db.session.commit()
                    os.unlink(f_name)
            except Exception as e:
                db.session.add(Port(scan_id=scan_id, host='Error', port=0, protocol='skipped', service='nmap failed'))
                db.session.commit()
                
            scan.progress = 70
            db.session.commit()
            
            # Phase 4: Vulnerability Scanning
            scan.phase = 'vulnerabilities'
            db.session.commit()
            
            try:
                if live_urls:
                    with tempfile.NamedTemporaryFile(mode='w+', delete=False) as f:
                        f.write("\n".join(live_urls))
                        f_name = f.name
                        
                    result = subprocess.run(['nuclei', '-l', f_name, '-json', '-severity', 'low,medium,high,critical'], capture_output=True, text=True, timeout=300)
                    vulns = parse_nuclei(result.stdout)
                    for v in vulns:
                        db.session.add(Vulnerability(scan_id=scan_id, template_id=v.get('template_id'), name=v.get('name'), severity=v.get('severity'), host=v.get('host'), matched_at=v.get('matched_at')))
                    db.session.commit()
                    os.unlink(f_name)
            except Exception as e:
                db.session.add(Vulnerability(scan_id=scan_id, template_id='Error', name='nuclei failed or not installed', severity='info'))
                db.session.commit()
                
            scan.progress = 90
            db.session.commit()
            
            # Phase 5: Wayback URLs
            scan.phase = 'wayback'
            db.session.commit()
            
            try:
                p1 = subprocess.Popen(['echo', domain], stdout=subprocess.PIPE)
                p2 = subprocess.Popen(['waybackurls'], stdin=p1.stdout, stdout=subprocess.PIPE, text=True)
                p1.stdout.close()
                output, _ = p2.communicate(timeout=300)
                urls = parse_wayback(output)
                for u in urls:
                    db.session.add(WaybackUrl(scan_id=scan_id, url=u))
                db.session.commit()
            except Exception as e:
                db.session.add(WaybackUrl(scan_id=scan_id, url='Error/Skipped: waybackurls failed'))
                db.session.commit()
                
            scan.phase = 'completed'
            scan.status = 'completed'
            scan.progress = 100
            scan.completed_at = datetime.utcnow()
            db.session.commit()
            
        except Exception as e:
            scan.status = 'error'
            scan.phase = str(e)
            db.session.commit()
