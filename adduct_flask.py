from flask import Flask, redirect, url_for, render_template
from flask import request
from flask import jsonify

import os
import csv
app = Flask(__name__)


@app.route("/index", methods=["GET"])
def index():

    # file = request.args.get("file")
    # neutralmass = request.args.get("neutralmass")
    # unifi_number = request.args.get("unifi_number")
    # hrepeat = request.args.get("hrepeat")
    # repeat = request.args.get("repeat")
    # mass_error = request.args.get("mass_error")
    # mode = request.args.get("mode")
    # hexact = request.args.get("hexact")

    # print(file,neutralmass,unifi_number,hrepeat,repeat,mass_error,mode,hexact)

    # if request.method == "GET":
    #     #query = request.args.to_dict(flat=False)
    #     #print(query)
    #     #return redirect("answers",query)

    #     return redirect("/answers")

    #else:
        #if request.method == "GET":
            # link = request.url
            # print(link)
            # prefix = "http://127.0.0.1:8080/index"
            # if link.startswith(prefix):
            #     strip_link = link[len(prefix):]
            # print(strip_link)
            #return redirect(url_for("answers",))
        # return(
        #     """<form action="" method="get">
        #             <p>
        #                 File\t          <input type="text" name="file"><br>
        #                 Neutralmass\t   <input type="text" name="neutralmass"><br>
        #                 Unifi Number\t  <input type="text" name="unifi_number"><br>
        #                 Hydro(s)\t      <input type="text" name="hrepeat"><br>
        #                 Element(s)\t    <input type="text" name="repeat"><br>
        #                 Mass Error\t    <input type="text" name="mass_error"><br>
        #                 Mode\t          <input type="text" name="mode"><br>
        #                 Hydroexact\t    <input type="text" name="hexact"><br>
        #                 <input type="submit" value="Convert">
        #             </p>
        #         </form>"""
        # )
    return render_template("index.html")

#?<string:file>&<string:neutralmass>,<string:unifi_number>,<string:hrepeat>,<string:repeat>,<string:mass_error>,<string:mode>,<string:hexact>
@app.route("/answers")
def answers():
    #http://192.168.0.31:8080/?file=negative_unifi.csv&neutralmass=300.09&unifi_number=3003.30&hrepeat=3&repeat=3&mass_error=0.00001&mode=minus&hexact=1.007825    
    query = request.args.to_dict(flat=False)
    print(query)
    file = query["file"]
    neutralmass = query["neutralmass"]
    unifi_number = query["unifi_number"]
    hrepeat = query["hrepeat"]
    repeat = query["repeat"]
    mass_error = query["mass_error"]
    mode = query["mode"]
    hexact = query["hexact"]

    value_list = {
    "csvfile":          file,
    "neutralmass":      float("".join(neutralmass)),
    "unifi_number":     float("".join(unifi_number)),
    "hexact":           float("".join(hexact)),
    "hrepeat":          int("".join(hrepeat)),
    "repeat":           int("".join(repeat)),
    "mass_error":       float("".join(mass_error)),
    "mode":             "".join(mode)
    }
    without_h   = without_hydro(value_list)
    result      = m_calculation(value_list)
    all_info = {"Requested Parameters":value_list,"Resuls without Hydro": without_h,"Results with Hydro":result}
    return (
        jsonify(all_info)
    )

def without_hydro(value_list):
    delta_m_min = float(-abs(value_list["mass_error"]))
    delta_m_max = value_list["mass_error"]
    raw_file = open("".join(value_list["csvfile"]), "r")
    rawdata = list(csv.reader(raw_file, delimiter=";"))

    high_limit  = value_list["unifi_number"]  - value_list["neutralmass"] - (delta_m_min*value_list["neutralmass"])
    low_limit   = value_list["unifi_number"]  - value_list["neutralmass"] - (delta_m_max*value_list["neutralmass"]) 
    
    list_exact_mass_of_each_element = []
    for j in range(int(value_list["repeat"])):
        for i in rawdata:   
            list_exact_mass_of_each_element.append(float(i[1]))

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

        if value_list["mode"] == "minus":
            if plus - minus == -1:
                Hm = "H-"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        elif value_list["mode"] == "plus":
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
    print("<--Begin Calculations-->")
    all_results = []
    for i in range(int(value_list["hrepeat"])):

        list_of_all_adduct = []

        each_hydro =  {
            "Number of Hydro(s)": i + 1,
            "Adduct combinations":  "",
        }

        print("\nNumber of Hydro: %s" % (i + 1))
        list_of_all_adduct.append(adduct_using_mass(value_list,(i + 1)))

        each_hydro["Adduct combinations"] = list_of_all_adduct
        all_results.append(each_hydro)

    print("<--Calculation completed-->")
    return all_results

def subset_sum(numbers,low_limit,high_limit,list_add,partial=[]):
    s = sum(partial)
    #print(s)
    # check if the partial sum is equals to target
    if s > low_limit and s < high_limit:
        #print("%s" % (partial))
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
    raw_file = open("".join(value_list["csvfile"]), "r")
    rawdata = list(csv.reader(raw_file, delimiter=";"))

    Hydro_mode = ""

    if value_list["mode"] == "plus":
        Hydro_mode = float(-abs(int(number_of_hydro)))

    elif value_list["mode"] == "minus":
        Hydro_mode = float(number_of_hydro)

    high_limit  = value_list["unifi_number"] + value_list["hexact"]*float(Hydro_mode) - value_list["neutralmass"] - (delta_m_min*value_list["neutralmass"])
    low_limit   = value_list["unifi_number"] + value_list["hexact"]*float(Hydro_mode) - value_list["neutralmass"] - (delta_m_max*value_list["neutralmass"]) 
    
    print("M adduct min after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(low_limit))))
    print("M adduct max after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(high_limit))))

    list_exact_mass_of_each_element = []
    for j in range(int(value_list["repeat"])):
        for i in rawdata:   
            list_exact_mass_of_each_element.append(float(i[1]))

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

        if value_list["mode"] == "minus":
            if plus - minus - number_of_hydro == -1:
                Hm = "H-"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                element_set_dict["Number of H(s)"]      = str(number_of_hydro) + Hm
                element_set_dict["element_set"]         = [combi]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        elif value_list["mode"] == "plus":
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
    for i in element_list:
       print("%s\nsum:%s" % (i["element_set"],i["sum_of_element_set"]))
    return element_list

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)

