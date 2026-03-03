#pip install gunicorn
#for http
#gunicorn --config gunicorn_config.py adduct_flask:app
#for https
#run this command after reboot
#or pkill gunicorn
#gunicorn --config gunicorn_config.py adduct_flask:app --certfile=/etc/letsencrypt/live/analytical.dispelk9.de/fullchain.pem --keyfile=/etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem > /tmp/flask_log.txt 2>&1 &
import os

# CX22-safe defaults (override via env vars if needed)
workers = int(os.environ.get("GUNICORN_PROCESSES", "1"))
threads = int(os.environ.get("GUNICORN_THREADS", "2"))

# Give enough time for first request, model calls, etc.
timeout = int(os.environ.get("GUNICORN_TIMEOUT", "180"))

bind = os.environ.get("GUNICORN_BIND", "0.0.0.0:8080")

forwarded_allow_ips = "*"
secure_scheme_headers = {"X-Forwarded-Proto": "https"}