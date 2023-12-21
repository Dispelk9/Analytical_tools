#!/usr/bin/env python3
import argparse
import sys
import csv

def adduct_calculation(args):
    raw_file = open(args.file, "r")
    rawdata = list(csv.reader(raw_file, delimiter=";"))
    low_limit   = float(args.exact_mass) - float(args.mass_error)
    high_limit  = float(args.exact_mass) + float(args.mass_error)
    print("your low limit is    : %s" % low_limit)
    print("your high limit is   : %s" % high_limit)

    list_exact_mass_of_each_element = []
    for j in range(int(args.repeat)):
        for i in rawdata:   
            list_exact_mass_of_each_element.append(float(i[1]))

    #print(list_exact_mass_of_each_element)
    list_add = []
    subset_sum(list_exact_mass_of_each_element,low_limit,high_limit,list_add,partial=[])
    
    
    for i in list_add:
        for k in range(len(i[0])):
            for j in rawdata:
                if i[0][k] == float(j[1]):
                    i[0][k] = j[0]
                    
    for i in list_add:
        print(i)              


def subset_sum(numbers,low_limit,high_limit,list_add,partial=[]):
    s = sum(partial)

    # check if the partial sum is equals to target
    if s > low_limit and s < high_limit :
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

    parser_adduct_val = subparsers.add_parser("adduct", help = "")
    parser_adduct_val.add_argument("file"   , help= "find the X")
    parser_adduct_val.add_argument("exact_mass" , help="exact mass")
    parser_adduct_val.add_argument("mass_error" , help="mass error")
    parser_adduct_val.add_argument("repeat" , help="times of repeat elements")
    args = main_parser.parse_args(sys.argv[1:])
    
    if args.command == "adduct":
        adduct_calculation(args)
    #elif args.command == "baws":
    #    bulk_aws_dns(args)
    else:
        main_parser.print_help()