from flask import Flask
from flask import request
from flask import jsonify

import os
import csv
app = Flask(__name__)


@app.route("/")
def index():
    # celsius = query("celsius", "")
    # if celsius:
    #     fahrenheit = fahrenheit_from(celsius)
    # else:
    #     fahrenheit = ""
    # return (
    #     """<form action="" method="get">
    #             Celsius temperature: <input type="text" name="celsius">
    #             <input type="submit" value="Convert to Fahrenheit">
    #         </form>"""
    #     + "Fahrenheit: "
    #     + fahrenheit
    # )

    # def fahrenheit_from(celsius):
    #     """Convert Celsius to Fahrenheit degrees."""
    #     try:
    #         fahrenheit = float(celsius) * 9 / 5 + 32
    #         fahrenheit = round(fahrenheit, 3)  # Round to three decimal places
    #         return str(fahrenheit)
    #     except ValueError:
    #         return "invalid input"


    #http://192.168.0.31:8080/?file=negative_unifi.csv&neutralmass=300.09&unifi_number=3003.30&hrepeat=3&repeat=3&mass_error=0.00001&mode=minus&hexact=1.007825    
    query = request.args.to_dict(flat=False)

    file            = query["file"]
    neutralmass     = query["neutralmass"]
    unifi_number    = query["unifi_number"]
    hrepeat         = query["hrepeat"]
    repeat          = query["repeat"]
    mass_error      = query["mass_error"]
    mode            = query["mode"]
    hexact          = query["hexact"]

    value_list = {
        "file":file,
        "neutralmass":neutralmass,
        "unifi_number":unifi_number,
        "hexact": hexact,
        "hrepeat": hrepeat,
        "repeat":repeat,
        "mass_error":mass_error,
        "mode":mode}
    result = m_calculation(value_list)
    return( 

        jsonify(value_list)
    )
def m_calculation(value_list):
    print("<--Begin Calculations-->")
    try:
        if os.path.exists("report_m.csv"):
            os.remove("report_m.csv")
    except FileNotFoundError:
        pass

    for i in range(int(" ".join(value_list["hrepeat"]))):
        total_set=[]
        list_of_all_adduct = []    

    for i in range(int(" ".join(value_list["hrepeat"]))):
        total_set=[]
        list_of_all_adduct = []
        print("\nNumber of Hydro: %s" % (i + 1))
        list_of_all_adduct.append(adduct_using_mass(value_list,(i + 1)))
            
        for each_case in list_of_all_adduct:
            if each_case == None:
                pass
            else:
                for each_set in each_case:
                    each_set_csv_str = str(each_set["element_set"]) + ";" + str(each_set["sum_of_element_set"]) + ";" + str(each_set["mass_M"])
                    #print("%s\tsum:%s\tM:%s" % (each_set["element_set"],each_set["sum_of_element_set"],each_set["mass_M"]))
                    total_set.append(each_set_csv_str)
                    #reduct the duplicate answers
                    total_set = [i for n, i in enumerate(total_set) if i not in total_set[n + 1:]]
        print("Found: %s set(s)" % len(total_set))


        print("\n<<--Write to report_m-->>")

        with open("report_m.csv","a") as f:
            write = csv.writer(f)
            for each_line in total_set:
                write.writerow([each_line])
        print("\nNumber of Hydro: %s" % (i + 1))
        list_of_all_adduct.append(adduct_using_mass(value_list,(i + 1)))
            
        for each_case in list_of_all_adduct:
            if each_case == None:
                pass
            else:
                for each_set in each_case:
                    each_set_csv_str = str(each_set["element_set"]) + ";" + str(each_set["sum_of_element_set"]) + ";" + str(each_set["mass_M"])
                    #print("%s\tsum:%s\tM:%s" % (each_set["element_set"],each_set["sum_of_element_set"],each_set["mass_M"]))
                    total_set.append(each_set_csv_str)
                    #reduct the duplicate answers
                    total_set = [i for n, i in enumerate(total_set) if i not in total_set[n + 1:]]
        print("Found: %s set(s)" % len(total_set))


        print("\n<<--Write to report_m-->>")

        with open("report_m.csv","a") as f:
            write = csv.writer(f)
            for each_line in total_set:
                write.writerow([each_line])

    print("<--Calculation completed-->")
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
    delta_m_min = -abs(float(" ".join(value_list["mass_error"])))
    delta_m_max = float(" ".join(value_list["mass_error"]))
    raw_file = open(" ".join(value_list["file"]), "r")
    rawdata = list(csv.reader(raw_file, delimiter=";"))

    Hydro_mode = ""

    if value_list["mode"] == "plus":
        Hydro_mode = -abs(int(number_of_hydro))

    elif value_list["mode"] == "minus":
        Hydro_mode = int(number_of_hydro)


    high_limit = float(" ".join(value_list["unifi_number"])) + float(" ".join(value_list["hexact"]))*float(Hydro_mode) - float(" ".join(value_list["neutralmass"])) - ((delta_m_min*float(" ".join(value_list["neutralmass"]))))
    low_limit = float(" ".join(value_list["unifi_number"])) + float(" ".join(value_list["hexact"]))*float(Hydro_mode) - float(" ".join(value_list["neutralmass"])) - ((delta_m_max*float(" ".join(value_list["neutralmass"])))) 
    
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
            "element_set": "",
            "sum_of_element_set":"",
            "mass_M":""
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
                
                element_set_dict["element_set"]         = [combi,str(number_of_hydro) + Hm]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        elif value_list["mode"] == "plus":
            if plus - minus - number_of_hydro == 1:
                Hm = "H+"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
            
                element_set_dict["element_set"]         = [combi,str(number_of_hydro) + Hm]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)      
    #reduct the duplicate answers
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]    
    for i in element_list:
       print("%s\nsum:%s" % (i["element_set"],i["sum_of_element_set"]))
    return element_list

if __name__ == "__main__":
    app.run(host="192.168.0.31", port=8080, debug=True)

