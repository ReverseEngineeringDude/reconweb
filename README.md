# Web-Based Automated Reconnaissance & Vulnerability Scanner

A complete, fully functional reconnaissance and vulnerability scanning tool for Bug Bounty Hunters. 
**This tool is for authorized testing only on domains you own or have written permission to test.**

## 🧱 Technology Stack
- **Frontend:** React + Tailwind CSS (Vite)
- **Backend:** Python + Flask
- **Async Queue:** Celery + Redis
- **Database:** SQLite (via SQLAlchemy)
- **Scanning Tools:** subfinder, httpx, nmap, nuclei, waybackurls

## 📦 Prerequisites
- Python 3.10+
- Node.js 18+
- Redis installed locally (`sudo apt install redis-server`)
- Go (for installing Go-based security tools)
- Nmap installed on the system (`sudo apt install nmap`)

## 🛠️ Tool Installation
Install the necessary Go tools:
```bash
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
go install github.com/tomnomnom/waybackurls@latest
```
*Make sure your `~/go/bin` is in your `$PATH`.*

## 🚀 Setup & Run Instructions

### 1. Install & Start Redis
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable --now redis-server
```

### 2. Start Backend & Celery Worker
Open two new terminals.

Terminal 1 (Flask API):
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Terminal 2 (Celery Worker):
```bash
cd backend
source venv/bin/activate
celery -A tasks worker --loglevel=info
```

### 3. Start Frontend
Terminal 3 (React Dev Server):
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
Open your browser and navigate to: `http://localhost:5173` (or the URL Vite provides).

## ⚠️ Disclaimer
This tool is strictly for authorized security testing only. Use responsibly.
