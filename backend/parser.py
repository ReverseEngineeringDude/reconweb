import json
import xml.etree.ElementTree as ET

def parse_subfinder(output):
    subdomains = []
    for line in output.strip().split('\n'):
        if not line: continue
        try:
            data = json.loads(line)
            if 'host' in data:
                subdomains.append(data['host'])
        except:
            pass
    return list(set(subdomains))

def parse_httpx(output):
    hosts = []
    for line in output.strip().split('\n'):
        if not line: continue
        try:
            data = json.loads(line)
            hosts.append({
                'url': data.get('url'),
                'status_code': data.get('status_code'),
                'title': data.get('title'),
                'technologies': data.get('tech', [])
            })
        except:
            pass
    return hosts

def parse_nmap(output):
    ports = []
    try:
        root = ET.fromstring(output)
        for host in root.findall('host'):
            address = host.find('address').get('addr') if host.find('address') is not None else 'unknown'
            ports_elem = host.find('ports')
            if ports_elem is not None:
                for port in ports_elem.findall('port'):
                    port_id = port.get('portid')
                    protocol = port.get('protocol')
                    service = port.find('service')
                    service_name = service.get('name') if service is not None else 'unknown'
                    version = service.get('version') if service is not None else ''
                    
                    ports.append({
                        'host': address,
                        'port': int(port_id),
                        'protocol': protocol,
                        'service': service_name,
                        'version': version
                    })
    except:
        pass
    return ports

def parse_nuclei(output):
    vulns = []
    for line in output.strip().split('\n'):
        if not line: continue
        try:
            data = json.loads(line)
            vulns.append({
                'template_id': data.get('template-id'),
                'name': data.get('info', {}).get('name'),
                'severity': data.get('info', {}).get('severity'),
                'host': data.get('host'),
                'matched_at': data.get('matched-at')
            })
        except:
            pass
    return vulns

def parse_wayback(output):
    urls = [line.strip() for line in output.strip().split('\n') if line.strip()]
    return list(set(urls))
