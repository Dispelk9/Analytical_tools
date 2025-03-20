from flask import Blueprint, jsonify, session, request
import pubchempy as pcp
import requests
import os
from utils.adduct_utils import convert_float
import logging
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging to output to STDOUT with INFO level messages
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

compound_bp = Blueprint('compound', __name__)

@compound_bp.route('/api/compound', methods=['POST'])
def compound():
    try:
        data = request.get_json()
        logging.info(data)

        required_keys = ['AD', 'OB', 'ME']
        if not data or not all(key in data for key in required_keys):
            return jsonify({'error': 'Missing one or more numbers'}), 400

        value_list = {
            "adduct": convert_float(data['AD']),
            "unifi_number": convert_float(data['OB']),
            "mass_error": convert_float(data['ME']) * 1e-6,
        }

        b = value_list["unifi_number"] - value_list["adduct"]
        a = value_list["mass_error"] * b + b
        range_diff = a - b

        min_mass = b - range_diff
        max_mass = b + range_diff

        base_url = "https://pubchem.ncbi.nlm.nih.gov/"
        request_url = f"{base_url}rest/pug/compound/exact_mass/range/{min_mass}/{max_mass}/cids/JSON"

        response_cid = requests.get(request_url, timeout=10)
        pubchem_data = response_cid.json()
        formula_counts = {}

        if "Fault" in pubchem_data and pubchem_data["Fault"]["Code"] == "PUGREST.NotFound":
            error_message = pubchem_data
            return jsonify({"error": error_message}), 404

        cids = pubchem_data.get("IdentifierList", {}).get("CID", [])[:10]  # Limit to first 10 compounds
        list_of_compounds = []

        for compound in cids:
            logging.info("Getting %s" % compound)
            c = pcp.Compound.from_cid(compound)
            compound_each = {
                "molecular_formula": c.molecular_formula,
                "cid": compound,
                "exact_mass": c.exact_mass,
                "iupac_name": c.iupac_name,
                "link": f"{base_url}compound/{compound}",
                "foto": f"{base_url}rest/pug/compound/cid/{compound}/PNG"
            }

            formula = compound_each["molecular_formula"]
            formula_counts[formula] = formula_counts.get(formula, 0) + 1
            list_of_compounds.append(compound_each)

        duplicates = {f: c for f, c in formula_counts.items() if c > 1}
        session['list_of_compounds'] = list_of_compounds
        response_data = {"compounds": list_of_compounds, "duplicates": duplicates}
        logging.info(response_data)
        return jsonify(response_data)

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500
