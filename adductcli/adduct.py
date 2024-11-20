#!/usr/bin/env python3
import argparse
import sys
import csv
import os

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

def m_calculation(args):
    print("<--Begin Calculations-->")
    if os.path.exists("report_m.csv"):
        os.remove("report_m.csv")

    for i in range(int(args.hrepeat)):
        total_set=[]
        list_of_all_adduct = []
        print("\nNumber of Hydro: %s" % (i + 1))
        list_of_all_adduct.append(adduct_using_mass(args,(i + 1)))
            
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

def adduct_using_mass(args,number_of_hydro):
    delta_m_min = -abs(float(args.mass_error))
    delta_m_max = float(args.mass_error)
    raw_file = open(args.file, "r")
    rawdata = list(csv.reader(raw_file, delimiter=";"))

    if args.mode == "plus":
        Hydro_mode = -abs(int(number_of_hydro))

    elif args.mode == "minus":
        Hydro_mode = int(number_of_hydro)


    high_limit = float(args.unifi_number) + float(args.hexact)*Hydro_mode - float(args.neutralmass) - ((delta_m_min*float(args.neutralmass)))
    low_limit = float(args.unifi_number) + float(args.hexact)*Hydro_mode - float(args.neutralmass) - ((delta_m_max*float(args.neutralmass))) 
    
    print("M adduct min after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(low_limit))))
    print("M adduct max after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(high_limit))))

    list_exact_mass_of_each_element = []
    for j in range(int(args.repeat)):
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

        if args.mode == "minus":
            if plus - minus - number_of_hydro == -1:
                Hm = "H-"
                combi = {element:i[0].count(element) for element in i[0]}
                combi = dict(sorted(combi.items()))
                
                element_set_dict["element_set"]         = [combi,str(number_of_hydro) + Hm]
                element_set_dict["sum_of_element_set"]  = ["Sum: " + str(float(i[1]))]
                element_list.append(element_set_dict)
        elif args.mode == "plus":
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

    main_parser = argparse.ArgumentParser(prog = "Analytical Tools using for calculation in UPLC/HPLC")
    subparsers = main_parser.add_subparsers(help = "command help", dest = "command")

    parser_M_val = subparsers.add_parser("exactmass", help = "know M find adduct")
    parser_M_val.add_argument("--file", help= "find the X")
    parser_M_val.add_argument("--neutralmass", help="neutral mass")
    parser_M_val.add_argument("--mass_error", help="mass error")
    parser_M_val.add_argument("--repeat", help="times of repeat elements")
    parser_M_val.add_argument("--hrepeat", help="number of Hydro repeat")
    parser_M_val.add_argument("--hexact",  help="exact mass number of Hydro")
    parser_M_val.add_argument("--unifi_number", help="M/Z from Unifi")
    parser_M_val.add_argument("--mode",help="plus or minus")
    args = main_parser.parse_args(sys.argv[1:])
    

    if args.command == "exactmass":
        m_calculation(args)
    else:
        main_parser.print_help()