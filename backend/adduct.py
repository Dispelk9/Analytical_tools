# backend/adduct.py
from flask import Blueprint, request, jsonify
import logging
import sys
import psycopg2
from utils.adduct_utils import *
from dotenv import load_dotenv
from utils.db_connection import DB_CONNECT
from utils.send_log import send_email
from handler.ListHandler import ListHandler

# Load environment variables from .env file
load_dotenv()

# Global list to capture the log messages.
log_entries = []

# Configure logging to output to STDOUT with INFO level messages
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Create and configure the custom list handler.
list_handler = ListHandler(log_entries)
# It's best to use the same formatter as in basicConfig for consistency.
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
list_handler.setFormatter(formatter)

# Attach the custom handler to the root logger.
logger = logging.getLogger()
logger.addHandler(list_handler)

adduct_bp = Blueprint('adduct', __name__)

@adduct_bp.route('/api/adduct', methods=['POST'])
def process_number():
    data = request.get_json()
    logging.info(data)

    try:
        db_config = DB_CONNECT()
        logging.info("getting the db_config")
    except:
        logging.info("cannot access database")

    if not data or not all(key in data for key in ['NM', 'OB', 'ME']):
        return jsonify({'error': 'Missing one or more numbers'}), 400

    value_list = {
        #Neutral mass (Da)
        "neutralmass":      convert_float(data['NM']),
        #Observed m/z
        "unifi_number":     convert_float(data['OB']),
        "hexact":           1.007825,
        "hrepeat":          3,
        "mass_error":       convert_float(data['ME'])*1e-5,
        "mode":             data["operation"],
        "receiver_email":   (data['Email'])
        }

    logging.info("== Initiate Calculation ==")
    logging.info("== Begin calculation without Hydro ==")
    without_h   = without_hydro(value_list,db_config)
    logging.info("== Begin calculation with Hydro ==")
    result      = m_calculation(value_list,db_config)
    value_list["mass_error"] = data['ME']
    keys_to_remove = ["hexact", "hrepeat"]
    for key in keys_to_remove:
        value_list.pop(key, None)

    all_info = {"Results without Hydro": without_h,"Results with Hydro":result}

    if value_list["receiver_email"] != "":
        send_email(log_entries,value_list["receiver_email"])

    return jsonify({'result': all_info})


def without_hydro(value_list,db_config):
    number_of_hydro = 0
    high_limit= 0
    low_limit = 0
    # Set table based on mode
    mode = value_list["mode"]
    if mode == "negative":
        table_name = "negative"
        high_limit   = value_list["unifi_number"]  - value_list["neutralmass"] + value_list["mass_error"]* (value_list["unifi_number"]  - value_list["neutralmass"])
        low_limit    = value_list["unifi_number"]  - value_list["neutralmass"] - 1e-6                    * (value_list["unifi_number"]  - value_list["neutralmass"])*20
    elif mode == "positive":
        table_name = "positive"
        high_limit   = value_list["unifi_number"]  - value_list["neutralmass"] + value_list["mass_error"]* (value_list["unifi_number"]  - value_list["neutralmass"])
        low_limit    = value_list["unifi_number"]  - value_list["neutralmass"] - value_list["mass_error"]* (value_list["unifi_number"]  - value_list["neutralmass"])
    else:
        raise ValueError("Invalid mode provided")

    try:
        # Create PostgreSQL connection string
        conn_string = f"postgresql://{db_config['username']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
        # Connect to PostgreSQL and fetch data within the same try block
        with psycopg2.connect(conn_string) as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"SELECT * FROM {table_name};")
                rawdata = [list(item) for item in cursor.fetchall()]
        logging.info("Get rawdata Successfully: %s", rawdata)

    except Exception as e:
        logging.info("Cannot connect to the database or fetch data: %s", e)

    list_exact_mass_of_each_element = []
    #for j in range(int(value_list["repeat"])):
    for i in rawdata:
        list_exact_mass_of_each_element.append(float(i[1]))

    #logging.info(list_exact_mass_of_each_element)

    list_add = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,number_of_hydro)

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
            "Element Set": "",
            "Sum":""
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
                if "H+" in combi or "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    element_set_dict["Element Set"]         = [combi]
                    element_set_dict["Sum"]  = [str(float(i[1]))]
                    element_list.append(element_set_dict)
        elif value_list["mode"] == "positive":
            if plus - minus == 1:
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                if "H+" in combi or "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    element_set_dict["Element Set"]         = [combi]
                    element_set_dict["Sum"]  = [str(float(i[1]))]
                    element_list.append(element_set_dict)
    #reduct the duplicate answers

    logging.info("== All Combinations without Hydro == %s", element_list)

    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]

    return element_list

def m_calculation(value_list,db_config):
    all_results = []

    list_of_all_adduct = []

    each_hydro =  {
        "Adduct Combinations":  "",
    }

    list_of_all_adduct.append(adduct_using_mass(value_list,db_config))

    each_hydro["Adduct Combinations"] = list_of_all_adduct
    all_results.append(each_hydro)

    return all_results


def adduct_using_mass(value_list,db_config):
    # Set table based on mode
    high_limit= 0
    low_limit = 0
    mode = value_list["mode"]
    if mode == "negative":
        table_name = "negative"
        high_limit   = value_list["unifi_number"]  - value_list["neutralmass"] + value_list["mass_error"]* (value_list["unifi_number"]  - value_list["neutralmass"])
        low_limit    = value_list["unifi_number"]  - value_list["neutralmass"] - 1e-6                    * (value_list["unifi_number"]  - value_list["neutralmass"])*20
    elif mode == "positive":
        table_name = "positive"
        high_limit   = value_list["unifi_number"]  - value_list["neutralmass"] + value_list["mass_error"]* (value_list["unifi_number"]  - value_list["neutralmass"])
        low_limit    = value_list["unifi_number"]  - value_list["neutralmass"] - 1e-6                    * (value_list["unifi_number"]  - value_list["neutralmass"])
    else:
        raise ValueError("Invalid mode provided")

    try:
        # Create PostgreSQL connection string
        conn_string = f"postgresql://{db_config['username']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
        # Connect to PostgreSQL and fetch data within the same try block
        with psycopg2.connect(conn_string) as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"SELECT * FROM {table_name};")
                rawdata = [list(item) for item in cursor.fetchall()]
        logging.info("Get rawdata Successfully: %s", rawdata)

    except Exception as e:
        logging.info("Cannot connect to the database or fetch data: %s", e)

    list_exact_mass_of_each_element = []
    #for j in range(int(value_list["repeat"])):
    for i in rawdata:
        list_exact_mass_of_each_element.append(float(i[1]))

    list_add = []
    if value_list["mode"] == "positive":
        # In each mode, we can have negative H or positive H therefore we need to have two ranges
        logging.info("== With Hydro Mode Positive ==")
        logging.info("== High Limit: %s, Low limit: %s ==" , high_limit,low_limit)

        list_add_positive = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,value_list["hrepeat"])

        #print("Before list_add_positive: %s" % list_add_positive)
        #change each mass into element
        # i combine of mass numbers and total number
        # j combine of name and mass number
        for i in list_add_positive:
            for k in range(len(i[0])):
                for j in rawdata:
                    if i[0][k] == float(j[1]):
                        i[0][k] = j[0]

        
        list_add = list_add_positive
        logging.info(list_add)
    elif value_list["mode"] == "negative":
        logging.info("== With Hydro Mode Negative ==")
        logging.info("== High Limit: %s, Low Limit: %s ==" , high_limit,low_limit)

        list_add_negative = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,value_list["hrepeat"])

        #print("Before list_add_negative: %s" % list_add_negative)
        #change each mass into element
        # i combine of mass numbers and total number
        # j combine of name and mass number
        for i in list_add_negative:
            for k in range(len(i[0])):
                for j in rawdata:
                    if i[0][k] == float(j[1]):
                        i[0][k] = j[0]


        list_add = list_add_negative
        logging.info(list_add)

    element_list = []
    #i[0] now contain element codes
    for i in list_add:
        element_set_dict = {
            "Element Set": "",
            "Sum":""
        }
        plus = 0
        minus = 0
        for k in i[0]:
            if "+" in k:
                plus +=1
            if "-" in k:
                minus +=1

        if value_list["mode"] == "positive":
            if plus - minus == 1:
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                if "H+" in combi and "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    if "H+" in combi or "H-" in combi:
                        element_set_dict["Element Set"]         = [combi]
                        element_set_dict["Sum"]  = [str(float(i[1]))]
                        element_list.append(element_set_dict)
                    else:
                        logging.info("no H %s removed" % combi)

        if value_list["mode"] == "negative":
            if plus - minus == -1:
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                if "H+" in combi and "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    if "H+" in combi or "H-" in combi:
                        element_set_dict["Element Set"]         = [combi]
                        element_set_dict["Sum"]  = [str(float(i[1]))]
                        element_list.append(element_set_dict)
                    else:
                        logging.info("no H %s removed" % combi)
    #reduct the duplicate answers
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]

    logging.info("== All Combinations with Hydro == %s" , element_list)
    return element_list

