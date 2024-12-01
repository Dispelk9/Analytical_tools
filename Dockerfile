# Use Python slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY app/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN  apt-get update && apt-get install -y procps

# Copy application code
COPY app/ /app/

# Copy the SSL certs
# in docker-sandbox
COPY fullchain.pem /etc/letsencrypt/live/analytical.dispelk9.de/fullchain.pem
COPY privkey.pem   /etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem


# Expose the Flask app port
EXPOSE 8080
# Https
EXPOSE 443

# Command to run Gunicorn server
# Set the default command to run the Flask app with Gunicorn
CMD ["gunicorn", "--config", "gunicorn_config.py", "--certfile=/etc/letsencrypt/live/analytical.dispelk9.de/fullchain.pem", "--keyfile=/etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem", "adduct_flask:app"]