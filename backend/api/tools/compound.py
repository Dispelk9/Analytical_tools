import logging
import sys
import time

import pubchempy as pcp
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from services.utils.adduct_utils import convert_float


load_dotenv()

REQUESTS_PER_SEC = 3
DELAY = 1.0 / REQUESTS_PER_SEC

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

router = APIRouter(tags=["compound"])


class CompoundRequest(BaseModel):
    AD: str | float | int | None = None
    OB: str | float | int | None = None
    ME: str | float | int | None = None


@router.post("/api/compound")
def compound(payload: CompoundRequest, request: Request):
    data = payload.model_dump()
    logging.info("Received data: %s", data)

    required_keys = ["AD", "OB", "ME"]
    if not all(data.get(key) not in (None, "") for key in required_keys):
        raise HTTPException(status_code=400, detail="Missing one or more numbers")

    try:
        value_list = {
            "adduct": convert_float(data["AD"]),
            "unifi_number": convert_float(data["OB"]),
            "mass_error": convert_float(data["ME"]) * 1e-6,
        }

        base_mass = value_list["unifi_number"] - value_list["adduct"]
        high_mass = value_list["mass_error"] * base_mass + base_mass
        range_diff = high_mass - base_mass

        min_mass = base_mass - range_diff
        max_mass = base_mass + range_diff

        base_url = "https://pubchem.ncbi.nlm.nih.gov/"
        request_url = f"{base_url}rest/pug/compound/exact_mass/range/{min_mass}/{max_mass}/cids/JSON"

        response_cid = None
        try:
            response_cid = requests.get(request_url, timeout=10)
            response_cid.raise_for_status()
            pubchem_data = response_cid.json()
        except requests.exceptions.RequestException as req_err:
            response_text = getattr(response_cid, "text", "")
            logging.error("Request Error: %s - Response content: %s", req_err, response_text)
            raise HTTPException(
                status_code=500,
                detail={
                    "error": f"Unable to connect to PubChem API: {req_err}",
                    "response": response_text,
                },
            ) from req_err
        except ValueError as json_err:
            response_text = getattr(response_cid, "text", "")
            logging.error("JSON Error: %s - Response content: %s", json_err, response_text)
            raise HTTPException(
                status_code=500,
                detail={
                    "error": f"Invalid JSON from PubChem API: {json_err}",
                    "response": response_text,
                },
            ) from json_err

        formula_counts = {}

        if "Fault" in pubchem_data and pubchem_data["Fault"]["Code"] == "PUGREST.NotFound":
            raise HTTPException(status_code=404, detail={"error": pubchem_data})

        cids = pubchem_data.get("IdentifierList", {}).get("CID", [])[:10]
        list_of_compounds = []

        for cid in cids:
            logging.info("Getting CID %s", cid)
            current_compound = pcp.Compound.from_cid(cid)
            compound_each = {
                "molecular_formula": current_compound.molecular_formula,
                "cid": cid,
                "exact_mass": current_compound.exact_mass,
                "iupac_name": current_compound.iupac_name,
                "link": f"{base_url}compound/{cid}",
                "foto": f"{base_url}rest/pug/compound/cid/{cid}/PNG",
            }

            formula = compound_each["molecular_formula"]
            formula_counts[formula] = formula_counts.get(formula, 0) + 1
            list_of_compounds.append(compound_each)
            time.sleep(DELAY)

        duplicates = {formula: count for formula, count in formula_counts.items() if count > 1}
        request.session["list_of_compounds"] = list_of_compounds
        response_data = {"compounds": list_of_compounds, "duplicates": duplicates}
        logging.info("Response data: %s", response_data)
        return response_data
    except HTTPException:
        raise
    except Exception as exc:
        logging.error("Unhandled error occurred: %s", exc)
        raise HTTPException(status_code=500, detail={"error": str(exc)}) from exc
