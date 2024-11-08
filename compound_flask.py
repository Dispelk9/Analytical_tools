from flask import Blueprint, render_template
from flask import Flask, render_template
from flask import request
#from flask import jsonify
from OpenSSL import SSL
from flask import Response
import psycopg2
import pubchempy as pcp

compound_bp = Blueprint('compound', __name__)

@compound_bp.route("/compound", methods=["GET"])
def compound():
    all_info = []
    try:
        if request.method == "GET":
#          all_info.append(pcp.get_compounds('Aspirin', 'name', record_type='3d'))
#          all_info.append(pcp.get_compounds('CC','smiles', searchtype='superstructure', listkey_count=3))
           all_info.append(pcp.get_cids('2-nonenal', 'name', 'substance', list_return='flat'))
           query = request.args.to_dict(flat=False)

           adduct = query["adduct"]
           unifi_number = query["unifi_number"]
           mass_error = query["mass_error"]
           value_list = {
               "adduct":           "".join(adduct),
               #Observed m/z
               "unifi_number":     float("".join(unifi_number)),
               "mass_error":       float("".join(mass_error)),
           }

           return render_template("compound_result.html",all_info=all_info)
    except Exception as e:
        print(f"An error occurred: {e}")
        return render_template("compound.html")
