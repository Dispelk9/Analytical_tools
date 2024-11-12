from flask import Blueprint, render_template, session,request


compound_detail_bp = Blueprint('compound_detail', __name__)

@compound_detail_bp.route("/compound_detail", methods=["GET"])
def compound_detail():
# Get the compound ID from the query parameters
    query = request.args.to_dict(flat=False)
    cid = query["cid"]
    if not cid:
      print("CID is missing.")
    print(cid)
    cid = int("".join(cid))
    # Retrieve list_of_compounds from the session
    list_of_compounds = session.get('list_of_compounds', [])
    # Find the specific compound by `cid`
    each_compound = next((comp for comp in list_of_compounds if comp.get("cid") == cid), None)
    print("Compound founded: %s" % each_compound)

    if each_compound is None:
        print("\nCompound with the specified CID was not found.")

    # Render compound_detail.html and pass the specific compound data
    return render_template('compound_detail.html', each_compound=each_compound)
