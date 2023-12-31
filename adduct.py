#!/usr/bin/env python3
import argparse
import sys
import csv
import os


def adduct_calculation(args):
    print("<--Begin Calculations-->")
    if os.path.exists("report_adduct.csv"):
        os.remove("report_adduct.csv")

    for i in range(int(args.hrepeat)):
        total_set=[]
        list_of_all_adduct = []
        print("\nNumber of Hydro: %s" % (i + 1))
        list_of_all_adduct.append(adduct_hydro(args,(i + 1)))
            
        for each_case in list_of_all_adduct:
            if each_case == None:
                pass
            else:
                for each_set in each_case:
                    each_set_csv_str = str(each_set["element_set"]) + ";" + str("{:.5f}".format(each_set["sum_of_element_set"])) + ";" + str(each_set["mass_M"])
                    #print("%s\tsum:%s\tM:%s" % (each_set["element_set"],each_set["sum_of_element_set"],each_set["mass_M"]))
                    total_set.append(each_set_csv_str)
                    #reduct the duplicate answers
                    total_set = [i for n, i in enumerate(total_set) if i not in total_set[n + 1:]]
        print("Found: %s set(s)" % len(total_set))


        print("\n<<--Write to csv-->>")

        with open("report_adduct.csv","a") as f:
            write = csv.writer(f)
            write.writerow(["Element_set with Number of Hydro: %s;Sum;Mass_after_subtract" % (i + 1)])
            for each_line in total_set:
                write.writerow([each_line])

    print("<--Calculation completed-->")

def m_calculation(args):
    print("<--Begin Calculations-->")
    if os.path.exists("report_m.csv"):
        os.remove("report_m.csv")

    for i in range(int(args.hrepeat)):
        total_set=[]
        list_of_all_adduct = []
        print("\nNumber of Hydro: %s" % (i + 1))
        list_of_all_adduct.append(adduct_using_m(args,(i + 1)))
            
        for each_case in list_of_all_adduct:
            if each_case == None:
                pass
            else:
                for each_set in each_case:
                    each_set_csv_str = str(each_set["element_set"]) + ";" + str("{:.5f}".format(each_set["sum_of_element_set"])) + ";" + str(each_set["mass_M"])
                    #print("%s\tsum:%s\tM:%s" % (each_set["element_set"],each_set["sum_of_element_set"],each_set["mass_M"]))
                    total_set.append(each_set_csv_str)
                    #reduct the duplicate answers
                    total_set = [i for n, i in enumerate(total_set) if i not in total_set[n + 1:]]
        print("Found: %s set(s)" % len(total_set))


        print("\n<<--Write to csv-->>")

        with open("report_m.csv","a") as f:
            write = csv.writer(f)
            write.writerow(["Element_set with Number of Hydro: %s;Sum" % (i + 1)])
            for each_line in total_set:
                write.writerow([each_line])

    print("<--Calculation completed-->")

def adduct_using_m(args,number_of_hydro):
    raw_file = open(args.file, "r")
    rawdata = list(csv.reader(raw_file, delimiter=";"))
    m_min = float(args.exactmass) - float(args.mass_error)
    m_max = float(args.exactmass) + float(args.mass_error)
    high_limit  = float(args.unifi_number) - m_min + float(number_of_hydro) * float(args.hexact)
    low_limit   = float(args.unifi_number) - m_max + float(number_of_hydro) * float(args.hexact)
    print("Low  limit after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(low_limit))))
    print("High limit after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(high_limit))))

    list_exact_mass_of_each_element = []
    for j in range(int(args.repeat)):
        for i in rawdata:   
            list_exact_mass_of_each_element.append(float(i[1]))

    list_add = []
    subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,list_add,partial=[])
    
    
    for i in list_add:
        for k in range(len(i[0])):
            for j in rawdata:
                if i[0][k] == float(j[1]):
                    i[0][k] = j[0]

    element_list = []
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
        if plus - minus - number_of_hydro == -1:
            #print(plus,minus,plus + minus - number_of_hydro, number_of_hydro)
            element_set_dict["element_set"]         = i[0]
            element_set_dict["sum_of_element_set"]  = float(i[1])
            element_list.append(element_set_dict)          
    
    for i in element_list:
        i["element_set"].sort()
        i["element_set"] = i["element_set"]
    
    #reduct the duplicate answers
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]    
    #for i in element_list:
    #    print("%s\tsum:%s\tM:%s" % (i["element_set"],i["sum_of_element_set"],i["mass_M"]))
    return element_list

def adduct_hydro(args,number_of_hydro):
    raw_file = open(args.file, "r")
    rawdata = list(csv.reader(raw_file, delimiter=";"))
    high_limit  = float(args.adduct) + float(args.mass_error) + float(number_of_hydro) * float(args.hexact)
    low_limit   = float(args.adduct) - float(args.mass_error) + float(number_of_hydro) * float(args.hexact)
    print("Low  limit after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(low_limit))))
    print("High limit after %s Hydro(s): %s" % (number_of_hydro,float("{:.5f}".format(high_limit))))

    list_exact_mass_of_each_element = []
    for j in range(int(args.repeat)):
        for i in rawdata:   
            list_exact_mass_of_each_element.append(float(i[1]))

    list_add = []
    subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,list_add,partial=[])
    
    
    for i in list_add:
        for k in range(len(i[0])):
            for j in rawdata:
                if i[0][k] == float(j[1]):
                    i[0][k] = j[0]

    element_list = []
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
        if plus - minus - number_of_hydro == -1:
            #print(plus,minus,plus + minus - number_of_hydro, number_of_hydro)
            element_set_dict["element_set"]         = i[0]
            element_set_dict["sum_of_element_set"]  = float(i[1])
            element_set_dict["mass_M"]              = float("{:.5f}".format(float(args.unifi_number) - float(i[1]) + float(number_of_hydro) * float(args.hexact)))
            element_list.append(element_set_dict)          
    
    for i in element_list:
        i["element_set"].sort()
        i["element_set"] = i["element_set"]
    
    #reduct the duplicate answers
    element_list = [i for n, i in enumerate(element_list) if i not in element_list[n + 1:]]    
    #for i in element_list:
    #    print("%s\tsum:%s\tM:%s" % (i["element_set"],i["sum_of_element_set"],i["mass_M"]))
    return element_list


def subset_sum(numbers,low_limit,high_limit,list_add,partial=[]):
    s = sum(partial)

    # check if the partial sum is equals to target
    if s > low_limit and s < high_limit:
        #print("%s" % (partial))
        list_with_sum = [partial,s]
        list_add.append(list_with_sum)
    if s >= high_limit:
        return  # if we reach the number why bother to continue

    for i in range(len(numbers)):
        n = numbers[i]
        remaining = numbers[i + 1:]
        subset_sum(remaining,low_limit,high_limit,list_add,partial + [n])
    
    

if __name__ == "__main__":

    main_parser = argparse.ArgumentParser(prog = "Analytical Tools using for calculation in UPLC/HPLC")
    subparsers = main_parser.add_subparsers(help = "command help", dest = "command")

    parser_adduct_val = subparsers.add_parser("adduct", help = "know adduct find M")
    parser_adduct_val.add_argument("--file", help= "find the X")
    parser_adduct_val.add_argument("--adduct", help="adduct choose by someone")
    parser_adduct_val.add_argument("--mass_error", help="mass error")
    parser_adduct_val.add_argument("--repeat", help="times of repeat elements")
    parser_adduct_val.add_argument("--hrepeat", help="number of Hydro repeat")
    parser_adduct_val.add_argument("--hexact",  help="exact mass number of Hydro")
    parser_adduct_val.add_argument("--unifi_number", help="M/Z from Unifi")

    parser_M_val = subparsers.add_parser("exactmass", help = "know M find adduct")
    parser_M_val.add_argument("--file", help= "find the X")
    parser_M_val.add_argument("--exactmass", help="exact mass")
    parser_M_val.add_argument("--mass_error", help="mass error")
    parser_M_val.add_argument("--repeat", help="times of repeat elements")
    parser_M_val.add_argument("--hrepeat", help="number of Hydro repeat")
    parser_M_val.add_argument("--hexact",  help="exact mass number of Hydro")
    parser_M_val.add_argument("--unifi_number", help="M/Z from Unifi")
    args = main_parser.parse_args(sys.argv[1:])
    
    if args.command == "adduct":
        adduct_calculation(args)
    elif args.command == "exactmass":
        m_calculation(args)
    else:
        main_parser.print_help()