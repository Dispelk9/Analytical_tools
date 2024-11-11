from flask import Blueprint, render_template
from flask import Flask, render_template
from flask import request
#from flask import jsonify
from OpenSSL import SSL
from datetime import datetime
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
            query = request.args.to_dict(flat=False)

            adduct = query["adduct"]
            unifi_number = query["unifi_number"]
            mass_error = query["mass_error"]
            value_list = {
                "adduct":           float("".join(adduct)),
                #NA+
                #"adduct":  22.98977,
                #Observed m/z
                "unifi_number":     float("".join(unifi_number)),
                #"unifi_number": float(383.2755),
                "mass_error":       float("".join(mass_error))*1e-6,
                #"mass_error": 0.0001,
            }
            #with open("/root/postgres.txt",'r')as file:
            #  postgres_string = file.read().strip()
            #conn_string = "postgresql://postgres:%s@127.0.0.1:5432/postgres" % postgres_string
            #conn = psycopg2.connect(conn_string)
            #cursor = conn.cursor()
            #cursor.execute("SELECT * FROM negative;")
            #negative_postgres = cursor.fetchall()
            #rawdata = [list(item) for item in negative_postgres]
            #cursor.close()
            #conn.close()
            #print(value_list["adduct"])
            #for i in rawdata:
            #    if value_list["adduct"] == i[0]:
            #        value_list["adduct"] == i[1]
            #print(value_list["adduct"])
            b = value_list["unifi_number"] - value_list["adduct"]
            a = value_list["mass_error"]*b + b
            range_diff = a - b

            min_mass = b - (a - b)
            max_mass = b + (a - b)

            #https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastformula/exactmass/382.9755-383.5755/JSON
            #https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/exact_mass/range/400.0/400.05/cids/JSON
            base_url = "https://pubchem.ncbi.nlm.nih.gov/"

            request_url = base_url + "rest/pug/compound/exact_mass/range/%s/%s" % (min_mass,max_mass) + "/cids/JSON"
            print(request_url)
            response_cid = requests.get(request_url)
            pubchem_data = response_cid.json()
            if "Fault" in pubchem_data and pubchem_data["Fault"]["Code"] == "PUGREST.NotFound":
               error_message = pubchem_data
               print(error_message)
               return render_template("compound_result.html", all_info=error_message)
            else:
                cids = pubchem_data.get("IdentifierList", {}).get("CID", [])
                print(cids)
                list_of_compounds = []
                for compound in cids:
                    compound_each = {
                        "molecular_formula": "",
                        "cid": "",
                        "foto": "",
                        "link": "",
                        "exact mass" : "",
                        "iupac_name": "",
                    }
                    c = pcp.Compound.from_cid(compound)
                    compound_each["molecular_formula"] = c.molecular_formula
                    compound_each["cid"] = compound
                    compound_each["exact mass"] = c.exact_mass
                    compound_each["iupac_name"] = c.iupac_name
                    compound_each["link"]= base_url + "compound/" + str(compound)
                    compound_each["foto"]= base_url + "rest/pug/compound/cid/" + str(compound)  + "/PNG"
                    print(compound_each)
                    print(datetime.now())
                    list_of_compounds.append(compound_each)
                    #print(list_of_compounds)
                return render_template("compound_result.html",all_info=list_of_compounds)
    except Exception as e:
        print(f"An error occurred: {e}")
        return render_template("compound.html")
