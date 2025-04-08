import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import sys
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging to output to STDOUT with INFO level messages
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def send_email(log_entries,receiver_email ):
    # Set up your email parameters
    sender_email    = os.getenv("SENDER") 
    password        = os.getenv("MAIL_PW")
    mailrelay       = os.getenv("SMTP_RELAY")

    # Create a multipart message
    message = MIMEMultipart("alternative")
    message["Subject"] = "Logging from ACT Adduct"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the body of the email in HTML format including all log entries.
    # We join the list into a single string and use <pre> so formatting (like newlines) is preserved.
    joined_logs = "\n".join(log_entries)
    html = """
    <html>
        <body>
            <p>Hello,<br>
               This is a <b>Adduct Result</b>!</p>
            <pre>%s</pre>
        </body>
    </html>
    """ % joined_logs

    # Convert both parts to MIMEText objects
    part = MIMEText(html, "html")

    # Attach both parts to the message.
    # Email clients that support HTML will display the HTML version.
    message.attach(part)

    try:
        # Connect to the SMTP server securely using SSL.
        # For example, Gmail's SMTP server uses 'smtp.gmail.com' and port 465.
        with smtplib.SMTP_SSL(mailrelay, 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
            logging.info("Email sent successfully!")
    except Exception as e:
        logging.info("Error: Unable to send email.")
        logging.info("Details:", e)

if __name__ == "__main__":
    send_email()
