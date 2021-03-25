import flask
from flask import request

app = flask.Flask(__name__)
app.config["DEBUG"] = True


app.run("0.0.0.0", 5000)
