# Use Python slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY requirements.txt ./
RUN apt-get update && apt-get install -y procps vim && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . /app/


# Expose the Flask app port
EXPOSE 8080
# Https
EXPOSE 80

# Command to run Gunicorn server
# Set the default command to run the Flask app with Gunicorn
#CMD ["gunicorn", "--config", "gunicorn_config.py", "--certfile=/etc/letsencrypt/live/analytical.dispelk9.de/fullchain.pem", "--keyfile=/etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem", "adduct_flask:app"]
CMD ["gunicorn", "--config", "gunicorn_config.py", "main:app"]