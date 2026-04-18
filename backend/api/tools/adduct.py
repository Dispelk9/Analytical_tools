# backend/adduct.py
import logging
import sys

import psycopg2
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.handler.ListHandler import ListHandler
from services.utils.adduct_utils import convert_float, dict_to_formula, subset_sum
from services.utils.db_connection import DB_CONNECT
from services.utils.send_log import send_email


load_dotenv()

log_entries = []

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

list_handler = ListHandler(log_entries)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
list_handler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(list_handler)

router = APIRouter(tags=["adduct"])


class AdductRequest(BaseModel):
    NM: str | float | int | None = None
    OB: str | float | int | None = None
    ME: str | float | int | None = None
    operation: str | None = None
    Email: str = ""


@router.post("/api/adduct")
def process_number(payload: AdductRequest):
    data = payload.model_dump()
    logging.info(data)

    if not all(data.get(key) not in (None, "") for key in ["NM", "OB", "ME"]):
        raise HTTPException(status_code=400, detail="Missing one or more numbers")

    try:
        db_config = DB_CONNECT()
        logging.info("getting the db_config")
    except Exception as exc:
        logging.info("cannot access database")
        raise HTTPException(status_code=500, detail=f"Database configuration unavailable: {exc}") from exc

    value_list = {
        "neutralmass": convert_float(data["NM"]),
        "unifi_number": convert_float(data["OB"]),
        "hexact": 1.007825,
        "hrepeat": 3,
        "mass_error": convert_float(data["ME"]) * 1e-5,
        "mode": data["operation"],
        "receiver_email": data["Email"],
    }

    logging.info("== Initiate Calculation ==")
    logging.info("== Begin calculation without Hydro ==")
    without_h = without_hydro(value_list, db_config)
    logging.info("== Begin calculation with Hydro ==")
    result = m_calculation(value_list, db_config)

    all_info = {"Results without Hydro": without_h, "Results with Hydro": result}

    if value_list["receiver_email"] != "":
        send_email(log_entries, value_list["receiver_email"])

    return {"result": all_info}


def without_hydro(value_list, db_config):
    number_of_hydro = 0
    high_limit = 0
    low_limit = 0
    rawdata = []

    mode = value_list["mode"]
    if mode == "negative":
        table_name = "negative"
        high_limit = value_list["unifi_number"] - value_list["neutralmass"] + value_list["mass_error"] * (
            value_list["unifi_number"] - value_list["neutralmass"]
        )
        low_limit = value_list["unifi_number"] - value_list["neutralmass"] - 1e-6 * (
            value_list["unifi_number"] - value_list["neutralmass"]
        ) * 20
    elif mode == "positive":
        table_name = "positive"
        high_limit = value_list["unifi_number"] - value_list["neutralmass"] + value_list["mass_error"] * (
            value_list["unifi_number"] - value_list["neutralmass"]
        )
        low_limit = value_list["unifi_number"] - value_list["neutralmass"] - value_list["mass_error"] * (
            value_list["unifi_number"] - value_list["neutralmass"]
        )
    else:
        raise ValueError("Invalid mode provided")

    try:
        conn_string = (
            "postgresql://"
            f"{db_config['username']}:{db_config['password']}"
            f"@{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
        )
        with psycopg2.connect(conn_string) as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"SELECT * FROM {table_name};")
                rawdata = [list(item) for item in cursor.fetchall()]
        logging.info("Get rawdata Successfully: %s", rawdata)
    except Exception as exc:
        logging.info("Cannot connect to the database or fetch data: %s", exc)

    list_exact_mass_of_each_element = []
    for item in rawdata:
        list_exact_mass_of_each_element.append(float(item[1]))

    list_add = subset_sum(list_exact_mass_of_each_element, low_limit, high_limit, number_of_hydro)

    for item in list_add:
        for index in range(len(item[0])):
            for raw_item in rawdata:
                if item[0][index] == float(raw_item[1]):
                    item[0][index] = raw_item[0]

    element_list = []

    for item in list_add:
        element_set_dict = {"Element Set": "", "Sum": ""}
        plus = 0
        minus = 0
        for entry in item[0]:
            if "+" in entry:
                plus += 1
            if "-" in entry:
                minus += 1

        if value_list["mode"] == "negative":
            if plus - minus == -1:
                combi = {element: item[0].count(element) for element in item[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                if "H+" in combi or "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    element_set_dict["Element Set"] = [combi]
                    element_set_dict["Sum"] = [str(float(item[1]))]
                    element_list.append(element_set_dict)
        elif value_list["mode"] == "positive":
            if plus - minus == 1:
                combi = {element: item[0].count(element) for element in item[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                if "H+" in combi or "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    element_set_dict["Element Set"] = [combi]
                    element_set_dict["Sum"] = [str(float(item[1]))]
                    element_list.append(element_set_dict)

    logging.info("== All Combinations without Hydro == %s", element_list)
    element_list = [item for index, item in enumerate(element_list) if item not in element_list[index + 1 :]]

    return element_list


def m_calculation(value_list, db_config):
    all_results = []
    list_of_all_adduct = []
    each_hydro = {"Adduct Combinations": ""}

    list_of_all_adduct.append(adduct_using_mass(value_list, db_config))

    each_hydro["Adduct Combinations"] = list_of_all_adduct
    all_results.append(each_hydro)

    return all_results


def adduct_using_mass(value_list, db_config):
    high_limit = 0
    low_limit = 0
    rawdata = []
    mode = value_list["mode"]

    if mode == "negative":
        table_name = "negative"
        high_limit = value_list["unifi_number"] - value_list["neutralmass"] + value_list["mass_error"] * (
            value_list["unifi_number"] - value_list["neutralmass"]
        )
        low_limit = value_list["unifi_number"] - value_list["neutralmass"] - 1e-6 * (
            value_list["unifi_number"] - value_list["neutralmass"]
        ) * 20
    elif mode == "positive":
        table_name = "positive"
        high_limit = value_list["unifi_number"] - value_list["neutralmass"] + value_list["mass_error"] * (
            value_list["unifi_number"] - value_list["neutralmass"]
        )
        low_limit = value_list["unifi_number"] - value_list["neutralmass"] - 1e-6 * (
            value_list["unifi_number"] - value_list["neutralmass"]
        )
    else:
        raise ValueError("Invalid mode provided")

    try:
        conn_string = (
            "postgresql://"
            f"{db_config['username']}:{db_config['password']}"
            f"@{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
        )
        with psycopg2.connect(conn_string) as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"SELECT * FROM {table_name};")
                rawdata = [list(item) for item in cursor.fetchall()]
        logging.info("Get rawdata Successfully: %s", rawdata)
    except Exception as exc:
        logging.info("Cannot connect to the database or fetch data: %s", exc)

    list_exact_mass_of_each_element = []
    for item in rawdata:
        list_exact_mass_of_each_element.append(float(item[1]))

    list_add = []
    if value_list["mode"] == "positive":
        logging.info("== With Hydro Mode Positive ==")
        logging.info("== High Limit: %s, Low limit: %s ==", high_limit, low_limit)
        list_add_positive = subset_sum(list_exact_mass_of_each_element, low_limit, high_limit, value_list["hrepeat"])
        for item in list_add_positive:
            for index in range(len(item[0])):
                for raw_item in rawdata:
                    if item[0][index] == float(raw_item[1]):
                        item[0][index] = raw_item[0]
        list_add = list_add_positive
        logging.info(list_add)
    elif value_list["mode"] == "negative":
        logging.info("== With Hydro Mode Negative ==")
        logging.info("== High Limit: %s, Low Limit: %s ==", high_limit, low_limit)
        list_add_negative = subset_sum(list_exact_mass_of_each_element, low_limit, high_limit, value_list["hrepeat"])
        for item in list_add_negative:
            for index in range(len(item[0])):
                for raw_item in rawdata:
                    if item[0][index] == float(raw_item[1]):
                        item[0][index] = raw_item[0]
        list_add = list_add_negative
        logging.info(list_add)

    element_list = []
    for item in list_add:
        element_set_dict = {"Element Set": "", "Sum": ""}
        plus = 0
        minus = 0
        for entry in item[0]:
            if "+" in entry:
                plus += 1
            if "-" in entry:
                minus += 1

        if value_list["mode"] == "positive":
            if plus - minus == 1:
                combi = {element: item[0].count(element) for element in item[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                if "H+" in combi and "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    if "H+" in combi or "H-" in combi:
                        element_set_dict["Element Set"] = [combi]
                        element_set_dict["Sum"] = [str(float(item[1]))]
                        element_list.append(element_set_dict)
                    else:
                        logging.info("no H %s removed", combi)

        if value_list["mode"] == "negative":
            if plus - minus == -1:
                combi = {element: item[0].count(element) for element in item[0]}
                combi = dict(sorted(combi.items()))
                combi = dict_to_formula(combi)
                if "H+" in combi and "H-" in combi:
                    logging.info(" remove: %s", combi)
                else:
                    if "H+" in combi or "H-" in combi:
                        element_set_dict["Element Set"] = [combi]
                        element_set_dict["Sum"] = [str(float(item[1]))]
                        element_list.append(element_set_dict)
                    else:
                        logging.info("no H %s removed", combi)

    element_list = [item for index, item in enumerate(element_list) if item not in element_list[index + 1 :]]
    logging.info("== All Combinations with Hydro == %s", element_list)
    return element_list
