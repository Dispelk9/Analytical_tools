# Ai Viet Hoang Dispelk9@gmail.com
from flask import Flask, redirect, url_for, render_template
from flask import request
from flask import jsonify
from OpenSSL import SSL

import psycopg2
import csv
import os
app = Flask(__name__)

@app.route("/index", methods=["GET"])
def index():
    all_info = []
    try:
        if request.method == "GET":
            #http://192.168.0.31:8080/?file=negative_unifi.csv&neutralmass=300.09&unifi_number=3003.30&hrepeat=3&repeat=3&mass_error=0.00001&mode=minus&hexact=1.007825
            query = request.args.to_dict(flat=False)
            
            neutralmass = query["neutralmass"]
            unifi_number = query["unifi_number"]
            hrepeat = query["hrepeat"]
            repeat = query["repeat"]
            mass_error = query["mass_error"]
            mode = query["mode"]

            value_list = {
            #Neutral mass (Da)
            "neutralmass":      float("".join(neutralmass)),
            #Observed m/z 
            "unifi_number":     float("".join(unifi_number)),
            "hexact":           1.007825,
            "hrepeat":          int("".join(hrepeat)),
            "repeat":           int("".join(repeat)),
            "mass_error":       float("".join(mass_error)),
            "mode":             "".join(mode)
            }
            without_h   = without_hydro(value_list)
            result      = m_calculation(value_list)

            keys_to_remove = ["hexact", "repeat", "hrepeat"]
            for key in keys_to_remove:
              value_list.pop(key, None)

            rename_keys = {
              "neutralmass": "Neutral mass (Da)",
              "unifi_number": "Observed m/z",
              "mass_error":  "Mass Error",
            }

            for old_key, new_key in rename_keys.items():
              if old_key in value_list:
                value_list[new_key] = value_list.pop(old_key)

            all_info = {"Requested Parameters":value_list,"Results without Hydro": without_h,"Results with Hydro":result}
            #return render_template("result.html",data=all_info)
#            return (
#                #jsonify(all_info)
#                all_info
#            )
            return render_template("result.html",all_info=all_info)
    except:
        return render_template("index.html")
    


def without_hydro(value_list):
    delta_m_min = float(-abs(value_list["mass_error"]))
    delta_m_max = value_list["mass_error"]
    with open("/root/postgres.txt",'r')as file:
     postgres_string = file.read().strip()
#    if value_list["mode"] == "minus":
#        file_mode = "negative_unifi.csv"
#    elif value_list["mode"] == "plus":
#        file_mode = "positive_unifi.csv"
#
#    raw_file = open(file_mode, "r")
#    rawdata = list(csv.reader(raw_file, delimiter=";"))
    if value_list["mode"] == "negative":
        conn_string = "postgresql://postgres:%s@127.0.0.1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM negative;")
        negative_postgres = cursor.fetchall()
        rawdata = [list(item) for item in negative_postgres]
        cursor.close()
        conn.close()
    elif value_list["mode"] == "positive":
        conn_string = "postgresql://postgres:%s@127.0.0.1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM positive;")
        positive_postgres = cursor.fetchall()
        rawdata = [list(item) for item in positive_postgres]
        cursor.close()
        conn.close()


    high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (delta_m_min*value_list["neutralmass"])
    low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (delta_m_max*value_list["neutralmass"])

    list_exact_mass_of_each_element = []
    for j in range(int(value_list["repeat"])):
        for i in rawdata:
            list_exact_mass_of_each_element.append(i[1])
    list_add = []
    subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,list_add,partial=[])

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
            "Number of H(s)": 0,
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
                Hm = "H-"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        elif value_list["mode"] == "positive":
            if plus - minus == 1:
                Hm = "H+"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
    #reduct the duplicate answers
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

def subset_sum(numbers,low_limit,high_limit,list_add,partial=[]):
    s = sum(partial)
    # check if the partial sum is equals to target
    if s > low_limit and s < high_limit:
        list_with_sum = [partial,float("{:.5f}".format(float(s)))]
        list_add.append(list_with_sum)
    if s >= high_limit:
        return  # if we reach the number why bother to continue

    for i in range(len(numbers)):
        n = numbers[i]
        remaining = numbers[i + 1:]
        subset_sum(remaining,low_limit,high_limit,list_add,partial + [n])

def adduct_using_mass(value_list,number_of_hydro):
    delta_m_min = float(-abs(value_list["mass_error"]))
    delta_m_max = value_list["mass_error"]
    with open("/root/postgres.txt",'r')as file:
     postgres_string = file.read().strip()
    if value_list["mode"] == "negative":
        conn_string = "postgresql://postgres:%s@127.0.0.1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM negative;")
        negative_postgres = cursor.fetchall()
        rawdata = [list(item) for item in negative_postgres]
        cursor.close()
        conn.close()
    elif value_list["mode"] == "positve":
        conn_string = "postgresql://postgres:%s@127.0.0.1:5432/postgres" % postgres_string
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM positive;")
        positive_postgres = cursor.fetchall()
        #print(positive_postgres)
        rawdata = [list(item) for item in positive_postgres]
        cursor.close()
        conn.close()


    Hydro_mode = ""

    if value_list["mode"] == "positive":
        Hydro_mode = float(-abs(int(number_of_hydro)))

    elif value_list["mode"] == "negative":
        Hydro_mode = float(number_of_hydro)

    high_limit  = value_list["unifi_number"] + value_list["hexact"]*float(Hydro_mode) - value_list["neutralmass"] - (delta_m_min*value_list["neutralmass"])
    low_limit   = value_list["unifi_number"] + value_list["hexact"]*float(Hydro_mode) - value_list["neutralmass"] - (delta_m_max*value_list["neutralmass"])

    #print("M adduct min after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(low_limit))))
    #print("M adduct max after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(high_limit))))

    list_exact_mass_of_each_element = []
    for j in range(int(value_list["repeat"])):
        for i in rawdata:
            #list_exact_mass_of_each_element.append(float(i[1]))
            list_exact_mass_of_each_element.append(i[1])
    list_add = []
    subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,list_add,partial=[])

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
            "Number of H(s)": "",
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
            if plus - minus - number_of_hydro == -1:
                Hm = "H-"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                element_set_dict["Number of H(s)"]      = str(number_of_hydro) + Hm
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        elif value_list["mode"] == "positive":
            if plus - minus - number_of_hydro == 1:
                Hm = "H+"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                element_set_dict["Number of H(s)"]      = str(number_of_hydro) + Hm
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
    #reduct the duplicate answers
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]
    #for i in element_list:
    #   print("%s\nsum:%s" % (i["element_set"],i["sum_of_element_set"]))
    return element_list

if __name__ == "__main__":
    context = ('/etc/letsencrypt/live/analytical.dispelk9.de/cert.pem','/etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem')
    app.run(host="0.0.0.0", port=8080, debug=True, ssl_context=context, threaded=True)
