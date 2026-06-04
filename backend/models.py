from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Scan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='pending') # pending, running, completed, error
    phase = db.Column(db.String(50), default='initializing')
    progress = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

class Subdomain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scan_id = db.Column(db.Integer, db.ForeignKey('scan.id'), nullable=False)
    host = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=True)

class LiveHost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scan_id = db.Column(db.Integer, db.ForeignKey('scan.id'), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    status_code = db.Column(db.Integer, nullable=True)
    title = db.Column(db.String(255), nullable=True)
    technologies = db.Column(db.Text, nullable=True)

class Port(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scan_id = db.Column(db.Integer, db.ForeignKey('scan.id'), nullable=False)
    host = db.Column(db.String(255), nullable=False)
    port = db.Column(db.Integer, nullable=False)
    protocol = db.Column(db.String(50), nullable=True)
    service = db.Column(db.String(100), nullable=True)
    version = db.Column(db.String(255), nullable=True)

class Vulnerability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scan_id = db.Column(db.Integer, db.ForeignKey('scan.id'), nullable=False)
    template_id = db.Column(db.String(255), nullable=True)
    name = db.Column(db.String(255), nullable=True)
    severity = db.Column(db.String(50), nullable=True)
    host = db.Column(db.String(255), nullable=True)
    matched_at = db.Column(db.String(255), nullable=True)

class WaybackUrl(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scan_id = db.Column(db.Integer, db.ForeignKey('scan.id'), nullable=False)
    url = db.Column(db.Text, nullable=False)
