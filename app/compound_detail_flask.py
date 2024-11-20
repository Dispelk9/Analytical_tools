from flask import Blueprint, render_template, session,request


compound_detail_bp = Blueprint('compound_detail', __name__)

@compound_detail_bp.route("/compound_detail", methods=["GET"])
def compound_detail():
# Get the compound ID from the query parameters
    query = request.args.to_dict(flat=False)
    query_molecular_formula = query["MF"][0]
    print(query_molecular_formula)
    # Retrieve list_of_compounds from the session
    list_of_compounds = session.get('list_of_compounds', [])

    list_of_MF = []

    # Find the specific compound by `cid`
    #each_compound = next((comp for comp in list_of_compounds if comp.get("cid") == cid), None)
    #print("Compound founded: %s" % each_compound)

    for compound in list_of_compounds:
      if compound.get("molecular_formula") == query_molecular_formula:
         list_of_MF.append(compound)
         print("Compound founded: %s" % compound)


    # Render compound_detail.html and pass the specific compound data
    return render_template('compound_detail.html', list_of_MF=list_of_MF)
