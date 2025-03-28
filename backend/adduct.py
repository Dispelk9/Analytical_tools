# backend/app.py
from flask import Flask, request, jsonify , session
import logging
import sys
import psycopg2
import csv
import os
from dotenv import load_dotenv
from flask_session import Session
from datetime import timedelta
from utils.adduct_utils import *
from compound import compound_bp
from flask_session import Session

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Retrieve database connection details from .env
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

app.secret_key = os.getenv("SESSION_SECRET")

# Configure Flask-Session to use filesystem storage
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = "/tmp/flask_session"  # Directory to store sessions
app.config["SESSION_PERMANENT"] = False
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)

Session(app)

app.register_blueprint(compound_bp)

# Configure logging to output to STDOUT with INFO level messages
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,  # Logs will appear in STDOUT
    format='%(asctime)s - %(levelname)s - %(message)s'
)

@app.route('/api/number', methods=['POST'])
def process_number():
    data = request.get_json()
    logging.info(data)
    if not data or not all(key in data for key in ['NM', 'OB', 'ME']):
        return jsonify({'error': 'Missing one or more numbers'}), 400

    value_list = {
        #Neutral mass (Da)
        "neutralmass":      convert_float(data['NM']),
        #Observed m/z
        "unifi_number":     convert_float(data['OB']),
        "hexact":           1.007825,
        "hrepeat":          3,
        "repeat":           3,
        "mass_error":       convert_float(data['ME'])*1e-6,
        "mode":             data["operation"]
        }
    
    logging.info("== Initiate Calculation ==")
    without_h   = without_hydro(value_list)
    result      = m_calculation(value_list)
    value_list["mass_error"] = data['ME']
    keys_to_remove = ["hexact", "repeat", "hrepeat"]
    for key in keys_to_remove:
        value_list.pop(key, None)

    # rename_keys = {
    #     "neutralmass": "Neutral mass (Da)",
    #     "unifi_number": "Observed m/z",
    #     "mass_error":  "Mass Error (ppm)",
    #     }
    # for old_key, new_key in rename_keys.items():
    #     if old_key in value_list:
    #         value_list[new_key] = value_list.pop(old_key)

    # all_info = {"Requested Parameters":value_list,"Results without Hydro": without_h,"Results with Hydro":result}
    all_info = {"Results without Hydro": without_h,"Results with Hydro":result}



    return jsonify({'result': all_info})


def without_hydro(value_list):
    # Set table based on mode
    mode = value_list["mode"]
    if mode == "negative":
        table_name = "negative"
    elif mode == "positive":
        table_name = "positive"
    else:
        raise ValueError("Invalid mode provided")
    
    # Create PostgreSQL connection string
    conn_string = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Connect to PostgreSQL and fetch data
    with psycopg2.connect(conn_string) as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {table_name};")
            rawdata = [list(item) for item in cursor.fetchall()]
    logging.info("Get rawdata Successfully: %s" % rawdata)



    logging.info("++++++++Without H++++++++")
    high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01
    low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01
    
    #low_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"])
    #high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] + (value_list["mass_error"]*value_list["neutralmass"])
    
    list_exact_mass_of_each_element = []
    #for j in range(int(value_list["repeat"])):
    for i in rawdata:
        list_exact_mass_of_each_element.append(float(i[1]))

    #logging.info(list_exact_mass_of_each_element)

    list_add = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit)

    #change each mass into element
    # i combine of mass numbers and total number
    # j combine of name and mass number
    for i in list_add:
        for k in range(len(i[0])):
            for j in rawdata:
                if i[0][k] == float(j[1]):
                    i[0][k] = j[0]
    element_list = []
    
    #i[0] now contain element codes
    for i in list_add:
        element_set_dict = {
            "H_number": 0,
            "element_set": "",
            "sum_of_element_set":""
        }
        plus = 0
        minus = 0
        for k in i[0]:
            if "+" in k:
                plus +=1
            if "-" in k:
                minus +=1

        if value_list["mode"] == "negative":
            if plus - minus == -1:
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        elif value_list["mode"] == "positive":
            if plus - minus == 1:
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
    #reduct the duplicate answers

    logging.info("++++++++All Combinations in element_list++++++++\n %s", element_list)

    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]

    return element_list

def m_calculation(value_list):
    #print("<--Begin Calculations-->")
    all_results = []
    for i in range(int(value_list["hrepeat"])):

        list_of_all_adduct = []

        each_hydro =  {
            "Adduct combinations":  "",
        }

        logging.info("\n++++++++ Number of Hydro: %s ++++++++\n", (i + 1))
        list_of_all_adduct.append(adduct_using_mass(value_list,(i + 1)))

        each_hydro["Adduct combinations"] = list_of_all_adduct
        all_results.append(each_hydro)

    #print("<--Calculation completed-->")
    return all_results


def adduct_using_mass(value_list,number_of_hydro):
    # Set table based on mode
    mode = value_list["mode"]
    if mode == "negative":
        table_name = "negative"
    elif mode == "positive":
        table_name = "positive"
    else:
        raise ValueError("Invalid mode provided")
    
    # Create PostgreSQL connection string
    conn_string = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Connect to PostgreSQL and fetch data
    with psycopg2.connect(conn_string) as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {table_name};")
            rawdata = [list(item) for item in cursor.fetchall()]
    logging.info("Get rawdata Successfully: %s" % rawdata)




    Hydro_mode = ""
    list_exact_mass_of_each_element = []
    #for j in range(int(value_list["repeat"])):
    for i in rawdata:
        list_exact_mass_of_each_element.append(float(i[1]))

    list_add = []
    if value_list["mode"] == "positive":
        # In each mode, we can have negative H or positive H therefore we need to have two ranges
        logging.info("++++++++Mode H is Positive++++++++")
        Hydro_mode = float(-abs(int(number_of_hydro)))
    
        high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01 + value_list["hexact"]*Hydro_mode
        low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01 + value_list["hexact"]*Hydro_mode
        
    
        #high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01 - value_list["hexact"]*float(Hydro_mode)
        #low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01 - value_list["hexact"]*float(Hydro_mode)
       
    
        logging.info("++++++++ High Limit: %s, Low limit: %s ++++++++" , high_limit,low_limit)
    
        list_add_positive = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit)
        
        #print("Before list_add_positive: %s" % list_add_positive)
        #change each mass into element
        # i combine of mass numbers and total number
        # j combine of name and mass number
        for i in list_add_positive:
            for k in range(len(i[0])):
                for j in rawdata:
                    if i[0][k] == float(j[1]):
                        i[0][k] = j[0]
        
        logging.info("++++++++After list_add_positive++++++++\n %s" , list_add_positive)
        list_add = list_add_positive
    elif value_list["mode"] == "negative":
        logging.info("++++++++Mode H is Negative++++++++\n")
        Hydro_mode = float(number_of_hydro)
    
    
        high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01 + value_list["hexact"]*Hydro_mode
        low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01 + value_list["hexact"]*Hydro_mode
    
        #high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01 - value_list["hexact"]*float(Hydro_mode)
        #low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01 - value_list["hexact"]*float(Hydro_mode)
    
        logging.info("++++++++ High Limit: %s, Low Limit: %s ++++++++" , high_limit,low_limit)
    
        list_add_negative = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit)
        
        #print("Before list_add_negative: %s" % list_add_negative)
        #change each mass into element
        # i combine of mass numbers and total number
        # j combine of name and mass number
        for i in list_add_negative:
            for k in range(len(i[0])):
                for j in rawdata:
                    if i[0][k] == float(j[1]):
                        i[0][k] = j[0]
        
        logging.info("++++++++After list_add_negative++++++++\n %s" , list_add_negative)

        list_add = list_add_negative

    element_list = []
    #i[0] now contain element codes
    for i in list_add:
        element_set_dict = {
            "H_number": "",
            "element_set": "",
            "sum_of_element_set":""
        }
        plus = 0
        minus = 0
        for k in i[0]:
            if "+" in k:
                plus +=1
            if "-" in k:
                minus +=1

        if value_list["mode"] == "positive":
            #if plus - minus - number_of_hydro == 1:
            #    Hm = "H-"
            #    combi = {element:i[0].count(element) for element in i[0]}
            #    combi = dict(sorted(combi.items()))
            #    combi = dict_to_formula(combi)
            #    element_set_dict["H_number"]      = str(number_of_hydro) + Hm
            #    element_set_dict["element_set"]         = [combi]
            #    element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
            #    element_list.append(element_set_dict)
            if plus - minus + number_of_hydro == 1:
                Hm = "H+"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                element_set_dict["H_number"]      = str(number_of_hydro) + Hm
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        if value_list["mode"] == "negative":
            if plus - minus - number_of_hydro == -1:
                Hm = "H-"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                element_set_dict["H_number"]      = str(number_of_hydro) + Hm
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
            #if plus - minus + number_of_hydro == -1:
            #    Hm = "H+"
            #    combi = {element:i[0].count(element) for element in i[0]}
            #    combi = dict(sorted(combi.items()))
            #    combi = dict_to_formula(combi)
            #    element_set_dict["H_number"]      = str(number_of_hydro) + Hm
            #    element_set_dict["element_set"]         = [combi]
            #    element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
            #    element_list.append(element_set_dict)
    #reduct the duplicate answers
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]
    #for i in element_list:
    #   print("%s\nsum:%s" % (i["element_set"],i["sum_of_element_set"]))
    logging.info("All Combinations in element_list: %s" , element_list)
    return element_list

if __name__ == '__main__':
    app.run(debug=True, port=8080)
