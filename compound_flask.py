from flask import Blueprint, render_template,session, request
#from flask import jsonify
from OpenSSL import SSL
from datetime import datetime
import psycopg2
import pubchempy as pcp
import requests

compound_bp = Blueprint('compound', __name__)


@compound_bp.route("/compound", methods=["GET"])
def compound():
    try:
        if request.method == "GET":
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
            #postgres key saved in /root/
            with open("/root/postgres.txt",'r')as file:
              postgres_string = file.read().strip()
            conn_string = "postgresql://postgres:%s@127.0.0.1:5432/postgres" % postgres_string
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

            min_mass = b - range_diff
            max_mass = b + range_diff


            #https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/exact_mass/range/400.0/400.05/cids/JSON
            base_url = "https://pubchem.ncbi.nlm.nih.gov/"

            request_url = base_url + "rest/pug/compound/exact_mass/range/%s/%s" % (min_mass,max_mass) + "/cids/JSON"
            print(request_url)
            response_cid = requests.get(request_url)
            pubchem_data = response_cid.json()
            formula_counts = {}
            if "Fault" in pubchem_data and pubchem_data["Fault"]["Code"] == "PUGREST.NotFound":
               error_message = pubchem_data
               print(error_message)
               return render_template("compound_result.html", all_info=error_message)
            else:
                cids = pubchem_data.get("IdentifierList", {}).get("CID", [])
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
                    try:
                        # Connect to the PostgreSQL database
                        conn = psycopg2.connect(conn_string)
                        cursor = conn.cursor()

                        # SQL query to check if the `cid` exists and retrieve information if it does
                        query = """
                            SELECT molecular_formula, cid, foto, link, exact_mass, iupac_name
                            FROM compounds
                            WHERE cid = %s;
                        """

                        # Execute the query with the target `cid`
                        cursor.execute(query, (compound,))
                        result = cursor.fetchone()

                        # Check if the `cid` was found
                        if result:
                          # Populate the compound_each dictionary with the retrieved data
                          compound_each["molecular_formula"] = result[0]
                          compound_each["cid"] = result[1]
                          compound_each["foto"] = result[2]
                          compound_each["link"] = result[3]
                          compound_each["exact mass"] = result[4]
                          compound_each["iupac_name"] = result[5]
                          print("Compound found:", compound_each)
                          list_of_compounds.append(compound_each)
                        else:
                          c = pcp.Compound.from_cid(compound)
                          compound_each["molecular_formula"] = c.molecular_formula
                          compound_each["cid"] = compound
                          compound_each["exact mass"] = c.exact_mass
                          compound_each["iupac_name"] = c.iupac_name
                          compound_each["link"]= base_url + "compound/" + str(compound)
                          compound_each["foto"]= base_url + "rest/pug/compound/cid/" + str(compound)  + "/PNG"
                          print(datetime.now())
                          list_of_compounds.append(compound_each)

                          # SQL query to insert data
                          query = """
                              INSERT INTO compounds (molecular_formula, cid, foto, link, exact_mass, iupac_name)
                              VALUES (%s, %s, %s, %s, %s, %s)
                          """

                          # Values to insert
                          values = (
                              compound_each["molecular_formula"],
                              compound_each["cid"],
                              compound_each["foto"],
                              compound_each["link"],
                              compound_each["exact mass"],
                              compound_each["iupac_name"],
                          )

                          # Execute the query and commit
                          cursor.execute(query, values)
                          conn.commit()
                          print("Data inserted successfully.")

                    except psycopg2.Error as e:
                        print("An error occurred:", e)

                    finally:
                        # Close cursor and connection
                        if cursor:
                            cursor.close()
                        if conn:
                            conn.close()
                    if compound_each["molecular_formula"]:
                      if compound_each["molecular_formula"] in formula_counts:
                        formula_counts[compound_each["molecular_formula"]] +=1
                      else:
                        formula_counts[compound_each["molecular_formula"]] = 1
                    duplicates = {formula: count for formula, count in formula_counts.items() if count > 1}

                # Store list_of_compounds in session for later use
                session['list_of_compounds'] = list_of_compounds
            print("The Compound Search is completed")
            return render_template("compound_result.html",all_info=list_of_compounds,duplicates=duplicates)

    except Exception as e:
        print(f"An error occurred: {e}")
        return render_template("compound.html")
