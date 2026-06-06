import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///recon.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    VT_API_KEY = os.environ.get('VT_API_KEY', '')
