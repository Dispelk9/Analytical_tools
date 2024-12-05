# Ai Viet Hoang Dispelk9@gmail.com
from flask import Flask, render_template, session, request, Response
from OpenSSL import SSL

from compound_flask import compound_bp
from compound_detail_flask import compound_detail_bp
from flask_session import Session
from datetime import timedelta
import os
import psycopg2

from itertools import combinations_with_replacement


app = Flask(__name__)
postgres_string = os.getenv("DB_PASSWORD")

app.secret_key = 'BfdW,adWbh!'

# Configure Flask-Session to use filesystem storage
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = "/tmp/flask_session"  # Directory to store sessions
app.config["SESSION_PERMANENT"] = False
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)

Session(app)

app.register_blueprint(compound_bp)
app.register_blueprint(compound_detail_bp)


@app.route("/index", methods=["GET"])
def index():
    all_info = []
    try:
        if request.method == "GET":
            #http://192.168.0.31:8080/?file=negative_unifi.csv&neutralmass=300.09&unifi_number=3003.30&hrepeat=3&repeat=3&mass_error=0.00001&mode=minus&hexact=1.007825
            query = request.args.to_dict(flat=False)

            neutralmass = query["neutralmass"]
            unifi_number = query["unifi_number"]
            #hrepeat = query["hrepeat"]
            #repeat = query["repeat"]
            mass_error = query["mass_error"]
            mode = query["mode"]

            value_list = {
                #Neutral mass (Da)
                "neutralmass":      float("".join(convert_float(neutralmass))),
                #Observed m/z
                "unifi_number":     float("".join(convert_float(unifi_number))),
                "hexact":           1.007825,
                "hrepeat":          3,
                "repeat":           3,
                "mass_error":       float("".join(convert_float(mass_error)))*1e-6,
                "mode":             "".join(mode)
                }
            without_h   = without_hydro(value_list)
            result      = m_calculation(value_list)
            value_list["mass_error"] = "".join(mass_error)
            keys_to_remove = ["hexact", "repeat", "hrepeat"]
            for key in keys_to_remove:
                value_list.pop(key, None)

            rename_keys = {
                "neutralmass": "Neutral mass (Da)",
                "unifi_number": "Observed m/z",
                "mass_error":  "Mass Error (ppm)",
                }
            for old_key, new_key in rename_keys.items():
                if old_key in value_list:
                    value_list[new_key] = value_list.pop(old_key)

            all_info = {"Requested Parameters":value_list,"Results without Hydro": without_h,"Results with Hydro":result}
            return render_template("result.html",all_info=all_info)
    except:
        return render_template("index.html")



def convert_float (value):
    if "," in value:
        value.replace(',','.')
    return value

def without_hydro(value_list):
    with open("postgres.txt",'r')as file:
     postgres_string = file.read().strip()
    if value_list["mode"] == "negative":
        conn_string = "postgresql://postgres:%s@analytical_tools-db-postgres-1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM negative;")
        negative_postgres = cursor.fetchall()
        rawdata = [list(item) for item in negative_postgres]
        cursor.close()
        conn.close()
    elif value_list["mode"] == "positive":
        conn_string = "postgresql://postgres:%s@analytical_tools-db-postgres-1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM positive;")
        positive_postgres = cursor.fetchall()
        rawdata = [list(item) for item in positive_postgres]
        cursor.close()
        conn.close()

    print("Without H")
    #high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01
    #low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01
    low_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"])
    high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] + (value_list["mass_error"]*value_list["neutralmass"])
    
    list_exact_mass_of_each_element = []
    #for j in range(int(value_list["repeat"])):
    for i in rawdata:
        list_exact_mass_of_each_element.append(i[1])

    print(list_exact_mass_of_each_element)

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

    print("All Combinations in element_list: %s" % element_list)
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]

    return element_list


def m_calculation(value_list):
    #print("<--Begin Calculations-->")
    all_results = []
    for i in range(int(value_list["hrepeat"])):

        list_of_all_adduct = []

        each_hydro =  {
            "Number of Hydro(s)": i + 1,
            "Adduct combinations":  "",
        }

        #print("\nNumber of Hydro: %s" % (i + 1))
        list_of_all_adduct.append(adduct_using_mass(value_list,(i + 1)))

        each_hydro["Adduct combinations"] = list_of_all_adduct
        all_results.append(each_hydro)

    #print("<--Calculation completed-->")
    return all_results

def subset_sum(numbers, low_limit, high_limit):
    """
    Find all subsets of 'numbers' (allowing duplicates) whose sums fall within the range (low_limit, high_limit).

    Args:
        numbers (list): List of numbers to consider (duplicates allowed).
        low_limit (float): Lower bound of the range (exclusive).
        high_limit (float): Upper bound of the range (exclusive).

    Returns:
        list: A list of tuples, where each tuple contains a subset and its sum.
    """
    # Filter numbers to include only those smaller than high_limit
    filtered_numbers = [num for num in numbers if num < high_limit]
    print(f"Filtered Numbers: {filtered_numbers}")

    # Store results
    result = []

    # Generate all subsets with replacements and check their sums
    max_len = len(filtered_numbers)  # Avoid infinite results by limiting the length
    for r in range(1, max_len + 1):  # Generate subsets of all sizes up to max_len
        for subset in combinations_with_replacement(filtered_numbers, r):
            subset_sum = sum(subset)
            if low_limit < subset_sum < high_limit:
                result.append((list(subset), round(subset_sum, 5)))

    return result


def adduct_using_mass(value_list,number_of_hydro):
    with open("postgres.txt",'r')as file:
     postgres_string = file.read().strip()
    if value_list["mode"] == "negative":
        conn_string = "postgresql://postgres:%s@analytical_tools-db-postgres-1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM negative;")
        negative_postgres = cursor.fetchall()
        rawdata = [list(item) for item in negative_postgres]
        cursor.close()
        conn.close()
    elif value_list["mode"] == "positive":
        conn_string = "postgresql://postgres:%s@analytical_tools-db-postgres-1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM positive;")
        positive_postgres = cursor.fetchall()
        rawdata = [list(item) for item in positive_postgres]
        cursor.close()
        conn.close()


    Hydro_mode = ""
    list_exact_mass_of_each_element = []
    #for j in range(int(value_list["repeat"])):
    for i in rawdata:
        list_exact_mass_of_each_element.append(i[1])

    # In each mode, we can have negative H or positive H therefore we need to have two ranges
    print("If H is Positive")
    Hydro_mode = float(-abs(int(number_of_hydro)))
    #high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01 - value_list["hexact"]*float(Hydro_mode)
    #low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01 - value_list["hexact"]*float(Hydro_mode)

    low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - value_list["hexact"]*float(Hydro_mode)
    high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] + (value_list["mass_error"]*value_list["neutralmass"]) - value_list["hexact"]*float(Hydro_mode)

    print("High Limit: %s, Low limit: %s" % (high_limit,low_limit))

    list_add_positive = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit)
    
    print("Before list_add_positive: %s" % list_add_positive)
    #change each mass into element
    # i combine of mass numbers and total number
    # j combine of name and mass number
    for i in list_add_positive:
        for k in range(len(i[0])):
            for j in rawdata:
                if i[0][k] == float(j[1]):
                    i[0][k] = j[0]
    
    print("After list_add_positive %s" % list_add_positive)

    print("If H is Negative")
    Hydro_mode = float(number_of_hydro)

    #high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) + 0.01 - value_list["hexact"]*float(Hydro_mode)
    #low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - 0.01 - value_list["hexact"]*float(Hydro_mode)
    
    low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (value_list["mass_error"]*value_list["neutralmass"]) - value_list["hexact"]*float(Hydro_mode)
    high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] + (value_list["mass_error"]*value_list["neutralmass"]) - value_list["hexact"]*float(Hydro_mode)

    print("High Limit: %s, Low Limit: %s" % (high_limit,low_limit))

    list_add_negative = subset_sum(list_exact_mass_of_each_element,low_limit,high_limit)
    
    print("Before list_add_negative: %s" % list_add_negative)
    #change each mass into element
    # i combine of mass numbers and total number
    # j combine of name and mass number
    for i in list_add_negative:
        for k in range(len(i[0])):
            for j in rawdata:
                if i[0][k] == float(j[1]):
                    i[0][k] = j[0]
    
    print("After list_add_negative %s" % list_add_negative)

    #We have a combined list of each case
    
    list_add = list_add_negative + list_add_positive

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
            if plus - minus - number_of_hydro == 1:
                Hm = "H-"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                element_set_dict["H_number"]      = str(number_of_hydro) + Hm
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
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
            if plus - minus + number_of_hydro == -1:
                Hm = "H+"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                element_set_dict["H_number"]      = str(number_of_hydro) + Hm
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
    #reduct the duplicate answers
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]
    #for i in element_list:
    #   print("%s\nsum:%s" % (i["element_set"],i["sum_of_element_set"]))
    print("All Combinations in element_list: %s" % element_list)
    return element_list

def dict_to_formula(components):
    formula = ""
    for element, count in components.items():
        # Add the count if it’s greater than 1
        if count > 1:
            formula += str(count)
        # Add the element symbol
        formula += element + ","
    return formula


@app.route('/negative_unifi.csv')
def serve_negative_db():
    with open('negative_unifi.csv') as f:
        csv_content = f.read()
    return Response(csv_content, mimetype='text/plain')

@app.route('/positive_unifi.csv')
def serve_positive_db():
    with open('positive_unifi.csv') as f:
        csv_content = f.read()
    return Response(csv_content, mimetype='text/plain')


if __name__ == "__main__":
    context = ('/etc/letsencrypt/live/analytical.dispelk9.de/cert.pem','/etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem')
    app.run(host="0.0.0.0", port=8080, debug=True, ssl_context=context, threaded=True)
