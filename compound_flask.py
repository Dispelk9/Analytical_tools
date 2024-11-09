from flask import Blueprint, render_template
from flask import Flask, render_template
from flask import request
#from flask import jsonify
from OpenSSL import SSL
from flask import Response
import psycopg2
import pubchempy as pcp
import requests
compound_bp = Blueprint('compound', __name__)

@compound_bp.route("/compound", methods=["GET"])
def compound():
    all_info = []
    try:
        if request.method == "GET":
#          all_info.append(pcp.get_compounds('Aspirin', 'name', record_type='3d'))
#          all_info.append(pcp.get_compounds('CC','smiles', searchtype='superstructure', listkey_count=3))
#           all_info.append(pcp.get_cids('2-nonenal', 'name', 'substance', list_return='flat'))
#           query = request.args.to_dict(flat=False)
#
#           adduct = query["adduct"]
#           unifi_number = query["unifi_number"]
#           mass_error = query["mass_error"]
           value_list = {
               #"adduct":           "".join(adduct),
               #NA+
               "adduct":  22.98977,
               #Observed m/z
               #"unifi_number":     float("".join(unifi_number)),
               "unifi_number": float(383.2755),
               #"mass_error":       float("".join(mass_error)),
               "mass_error": 0.0001,
           }
           min_mass = value_list["unifi_number"] - value_list["mass_error"]
           max_mass = value_list["unifi_number"] + value_list["mass_error"]

           #https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastformula/exactmass/382.9755-383.5755/JSON
           #https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/exact_mass/range/400.0/400.05/cids/JSON
           base_url = "https://pubchem.ncbi.nlm.nih.gov/"

           request_url = base_url + "rest/pug/compound/exact_mass/range/%s/%s" % (min_mass,max_mass) + "/cids/JSON"
           print(request_url)
           response_cid = requests.get(request_url)
           pubchem_data = response_cid.json()
           cids = pubchem_data.get("IdentifierList", {}).get("CID", [])


           list_of_compounds = []
           for compound in cids:

             compound_each = {
                "molecular_formula" : "",
                "molecular_weight": "",
                "link": "",
              }

             c = pcp.Compound.from_cid(compound)
             compound_each["molecular_formula"] = c.molecular_formula
             compound_each["molecular_weight"] = c.molecular_weight
             compound_each["link"]= base_url + "compound/" + str(compound)

             list_of_compounds.append(compound_each)

           return render_template("compound_result.html",all_info=list_of_compounds)
    except Exception as e:
        print(f"An error occurred: {e}")
        return render_template("compound.html")
