from flask import Blueprint, request, send_file, jsonify, make_response
import logging
import sys
import numpy as np
import matplotlib.pyplot as plt
import io
from dotenv import load_dotenv
from utils.send_log import send_email

# Load environment variables from .env file
load_dotenv()

# Configure logging to output to STDOUT with INFO level messages
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

gemini_bp = Blueprint('gemini', __name__)

@gemini_bp.route('/api/gemini', methods=['POST'])
def gemini_request():
    data = request.get_json()
    logging.info(data)

    value_list = {
        "Prompt": (data['Prompt']),
        "receiver_email":   (data['Email'])
        }
    
    response = request_gemini(value_list["Prompt"])

    log_entries = [value_list["Prompt"], response]


    if value_list["receiver_email"] != "":
        send_email(log_entries,value_list["receiver_email"])

    return jsonify({'result': log_entries})


def request_gemini(request_prompt):
    report = ""
    return report