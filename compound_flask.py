from flask import Blueprint, render_template
from flask import Flask, render_template
from flask import request
#from flask import jsonify
from OpenSSL import SSL
from flask import Response
import psycopg2

compound_bp = Blueprint('compound', __name__)

@compound_bp.route("/compound", methods=["GET"])
def compound():
  return render_template("compound.html")
