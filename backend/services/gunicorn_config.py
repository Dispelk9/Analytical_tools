#pip install gunicorn
#for http
#gunicorn --config services/gunicorn_config.py main:app
#for https
#run this command after reboot
#or pkill gunicorn
#gunicorn --config services/gunicorn_config.py main:app --certfile=/etc/letsencrypt/live/analytical.dispelk9.de/fullchain.pem --keyfile=/etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem > /tmp/backend_log.txt 2>&1 &
import os



workers = int(os.environ.get('GUNICORN_PROCESSES', '2'))

threads = int(os.environ.get('GUNICORN_THREADS', '4'))

# timeout = int(os.environ.get('GUNICORN_TIMEOUT', '120'))

bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:8080')



forwarded_allow_ips = '*'

secure_scheme_headers = { 'X-Forwarded-Proto': 'https' }

worker_class = "uvicorn.workers.UvicornWorker"
