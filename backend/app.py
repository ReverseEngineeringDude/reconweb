from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Scan, Subdomain, LiveHost, Port, Vulnerability, WaybackUrl
from tasks import celery, run_scan_pipeline

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/scan', methods=['POST'])
def start_scan():
    data = request.json
    domain = data.get('domain')
    if not domain:
        return jsonify({'error': 'Domain is required'}), 400
        
    if domain in ['localhost', '127.0.0.1'] or domain.startswith('192.168.') or domain.startswith('10.'):
        return jsonify({'error': 'Invalid domain'}), 400

    scan = Scan(domain=domain, status='running', phase='subdomains', progress=0)
    db.session.add(scan)
    db.session.commit()

    run_scan_pipeline.delay(scan.id, domain)

    return jsonify({'job_id': scan.id}), 201

@app.route('/api/scan/<int:id>', methods=['GET'])
def get_scan(id):
    scan = Scan.query.get_or_404(id)
    
    subdomains = [{'host': s.host, 'status': s.status} for s in Subdomain.query.filter_by(scan_id=id).all()]
    live_hosts = [{'url': h.url, 'status_code': h.status_code, 'title': h.title, 'technologies': h.technologies} for h in LiveHost.query.filter_by(scan_id=id).all()]
    ports = [{'host': p.host, 'port': p.port, 'protocol': p.protocol, 'service': p.service, 'version': p.version} for p in Port.query.filter_by(scan_id=id).all()]
    vulns = [{'template_id': v.template_id, 'name': v.name, 'severity': v.severity, 'host': v.host, 'matched_at': v.matched_at} for v in Vulnerability.query.filter_by(scan_id=id).all()]
    wayback = [{'url': w.url} for w in WaybackUrl.query.filter_by(scan_id=id).all()]

    return jsonify({
        'id': scan.id,
        'domain': scan.domain,
        'status': scan.status,
        'phase': scan.phase,
        'progress': scan.progress,
        'created_at': scan.created_at,
        'completed_at': scan.completed_at,
        'subdomains': subdomains,
        'live_hosts': live_hosts,
        'ports': ports,
        'vulnerabilities': vulns,
        'wayback_urls': wayback
    })

@app.route('/api/scan/<int:id>/status', methods=['GET'])
def get_scan_status(id):
    scan = Scan.query.get_or_404(id)
    return jsonify({
        'status': scan.status,
        'phase': scan.phase,
        'progress': scan.progress
    })

@app.route('/api/scans', methods=['GET'])
def get_scans():
    scans = Scan.query.order_by(Scan.created_at.desc()).all()
    return jsonify([{
        'id': s.id,
        'domain': s.domain,
        'status': s.status,
        'phase': s.phase,
        'progress': s.progress,
        'created_at': s.created_at
    } for s in scans])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
