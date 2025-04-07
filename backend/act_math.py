# backend/adduct.py
from flask import Blueprint, request, send_file, jsonify, make_response
import logging
import sys
import numpy as np
import matplotlib.pyplot as plt
import io
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging to output to STDOUT with INFO level messages
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

math_bp = Blueprint('math', __name__)

@math_bp.route('/api/collision', methods=['POST'])
def collision_plot():
    # Retrieve x and y data from the JSON payload
    data = request.get_json()
    x = data.get("x")
    logging.info(x)
    y = data.get("y")
    logging.info(y)

    # Validate input: both lists must be provided and have the same length
    if not isinstance(x, list) or not isinstance(y, list):
        return jsonify({"error": "Both 'x' and 'y' must be lists"}), 400
    if len(x) != len(y):
        return jsonify({"error": "'x' and 'y' lists must have the same length"}), 400

    try:
        # Convert lists to numpy arrays (ensuring numbers)
        x = np.array(x, dtype=float)
        y = np.array(y, dtype=float)
    except ValueError:
        return jsonify({"error": "Lists 'x' and 'y' must contain numbers"}), 400

    # Create the scatter plot
    fig, ax = plt.subplots()
    ax.scatter(x, y, color='blue')
    ax.set_xlabel("Concentration (µg/mL)")
    ax.set_ylabel("Response")
    ax.set_title("Concentration vs Response")

    # Save the plot to an in-memory bytes buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)

    # Set headers to prevent caching
    response = make_response(send_file(buf, mimetype='image/png'))
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response
