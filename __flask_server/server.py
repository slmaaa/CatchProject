import flask
from flask import request

import db
from game import *
from snapshot import *

app = flask.Flask(__name__)
app.config["DEBUG"] = True

C_DB = "./store/Checkpoints.json"
R_DB = "./store/Roles.json"
GP_DB = "./store/GameParameters.json"
G_DB = "./store/Games.json"
GS_DB = "./store/GameSnapshots.json"


# Game Parameters

@app.route("/gp", methods=["GET"])
def gp_list():
    gpdb = db.pull(GP_DB)
    return gpdb


@app.route("/gp/<gpid>", methods=["POST"])
def gp_create(gpid):
    try:
        _dict = request.get_json(force=True)
        _dict["gpid"] = gpid
        gp = GameParameters.from_dict(_dict)
    except KeyError:
        return "GPID: Wrong Format", 400
    gpdb = db.pull(GP_DB)
    gpdb[gpid] = gp.to_dict()

    db.push(gpdb, GP_DB)
    return "GameParameter successfully created", 200


@app.route("/gp/<gpid>", methods=["GET"])
def gp_read(gpid):
    try:
        gpdb = db.pull(GP_DB)
        return gpdb[gpid]
    except KeyError:
        return "GameParameter not found", 404


@app.route("/gp/<gpid>/join", methods=["POST"])
def gp_add_player(gpid):
    try:
        _dict = request.get_json(force=True)
        player = Player.from_dict(_dict)
    except KeyError:
        return "Player: Format Error", 400

    try:
        gpdb = db.pull(GP_DB)
        gp = GameParameters.from_dict(gpdb[gpid])
        if len(gp.players) < gp.max_players:
            gp.players.append(player)
            gpdb[gpid] = gp.to_dict()
        else:
            return "Room is full", 409

        db.push(gpdb, GP_DB)
    except KeyError:
        return "GameParameter not found", 404


@app.route("/gp/<gpid>/start", methods=["POST"])
def gp_to_game(gpid):
    try:
        gpdb = db.pull(GP_DB)
        gp = GameParameters.from_dict(gpdb[gpid])
    except KeyError:
        return "GameParameter not found", 404

    if not gp.min_players <= len(gp.players) <= gp.max_players:
        return "Player count not fulfilled", 409

    try:
        _dict = request.get_json(force=True)
        _dict["parameters"] = gp.to_dict()
        game = Game.from_dict(_dict)
    except KeyError:
        return "Game: Format Error", 400

    del gpdb[gpid]
    db.push(gpdb, GP_DB)

    gdb = db.pull(G_DB)
    gdb[gpid] = game.to_dict()
    db.push(gdb, G_DB)

    gsdb = db.pull(GS_DB)
    gs = GameSnapshot.from_game(game)
    gsdb[gpid] = gs.to_dict()
    db.push(gsdb, GS_DB)

    return "Game Successfully Started", 200


@app.route("/gp/<gpid>", methods=["DELETE"])
def gp_delete(gpid):
    gpdb = db.pull(GP_DB)
    try:
        del gpdb[gpid]
    except KeyError:
        return "GameParameter not found", 404
    db.push(gpdb, GP_DB)


# Game Snapshot
@app.route("/gs", methods=["GET"])
def gs_list():
    gsdb = db.pull(GS_DB)
    return gsdb


@app.route("/gs/<gsid>", method=["GET"])
def gs_read(gsid):
    gsdb = db.pull(GS_DB)
    try:
        return gsdb[gsid]
    except KeyError:
        return "GameSnapshot not found", 404


@app.route("/gs/<gsid>/<int:time>", method=["GET"])
def gs_read_time(gsid, time):
    gsdb = db.pull(GS_DB)
    try:
        gs = GameSnapshot.from_dict(gsdb[gsid])
        gs.fast_forward(time)
        gsdb[gsid] = gs.to_dict()
    except KeyError:
        return "GameSnapshot not found", 404
    db.push(gsdb, GS_DB)


@app.route("/gs/<gsid>/m", method=["POST"])
def gs_process_movement(gsid):
    gsdb = db.pull(GS_DB)
    try:
        gs = GameSnapshot.from_dict(gsdb[gsid])
    except KeyError:
        return "GameSnapshot not found", 404

    try:
        _dict = request.get_json(force=True)
        movement = CheckpointMovement.from_dict(_dict)
    except KeyError:
        return "CheckpointMovement: Format Error", 400

    gs.fast_forward(movement.time, (movement,))
    gsdb[gsid] = gs.to_dict()
    db.push(gsdb, GS_DB)


app.run("0.0.0.0", 5000)
