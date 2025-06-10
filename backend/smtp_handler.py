from flask import Blueprint
import logging
import subprocess
from dotenv import load_dotenv
from flask_socketio import Namespace, emit

# Load environment variables from .env file
load_dotenv()

# Configure logging to output to STDOUT with INFO level messages
# set up logging to stdout
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

smtp_bp = Blueprint('smtp', __name__)

@smtp_bp.route('/api/smtp', methods=['POST'])

class SMTPTestNamespace(Namespace):
    def on_connect(self):
        logger.info("🟢 Client connected to /terminal")

    def on_run_script(self, data):
        """
        Expected payload: { host: "<mail-server>" }
        """
        host = data.get("host")
        logger.info(f"📨 Received host from frontend: {host!r}")
        emit('terminal_output', f"\r\n\x1b[33m[Info] testing {host}\x1b[0m\r\n")

        # spawn your check script
        args = ["python3", "smtpcheck.py", host]
        proc = subprocess.Popen(
            args,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )

        # stream stdout
        for line in proc.stdout:
            emit('terminal_output', line)
        # stream stderr
        for line in proc.stderr:
            emit('terminal_output', line)

        # signal done to frontend
        emit('script_finished')
        logger.info("✅ SMTP checks complete, notified client.")

    def on_disconnect(self):
        logger.info("🔴 Client disconnected from /terminal")
