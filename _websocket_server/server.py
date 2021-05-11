import flask
from flask import request

import random

import db
from game import *

app = flask.Flask(__name__)
app.config["DEBUG"] = True

C_DB = "./store/Checkpoints.json"
GP_DB = "./store/GameParameters.json"
G_DB = "./store/Games.json"
GS_DB = "./store/GameSnapshots.json"


# Game Parameters
@app.route("/", methods=["GET"])
def test():
    return "Hello"


@app.route("/game", methods=["GET"])
def gp_list():
    gdb = db.pull(G_DB)
    return gdb


@app.route("/creategame", methods=["POST"])
def gp_create():
    game = None
    try:
        gid = 0
        _dict = request.get_json(force=True)
        gdb = db.pull(G_DB)

        assigned = False
        while (not assigned):
            gid = random.randint(100000, 999999)
            if gid not in gdb:
                _dict["gid"] = gid
                assigned = True
        game = Game.from_dict(_dict)
    except:
        return "GPID: Wrong Format", 401
    gdb[gid] = game.to_dict()
    db.push(gdb, G_DB)
    return str(gid), 200


@app.route("/game/<gid>", methods=["GET"])
def gp_read(gid):
    try:
        gdb = db.pull(G_DB)
        return gdb[gid]
    except KeyError:
        return "Game not found", 404


@app.route("/room/<gid>", methods=["GET"])
def room_info(gid):
    try:
        gdb = db.pull(G_DB)
        game = gdb[gid]
        room_info = {"status": game["status"], "players": game["players"]}
        return room_info
    except:
        return "Room not found", 404


@app.route("/game/<gid>/join", methods=["POST"])
def gp_add_player(gid):
    try:
        _dict = request.get_json(force=True)
        player = Player.from_dict(_dict)
    except KeyError:
        return "Player: Format Error", 400

    try:
        gdb = db.pull(G_DB)
        if (gdb[gid]["status"] == "DELETED"):
            return "Room is deleted", 410
        game = Game.from_dict(gdb[gid])
        if len(game.players) < game.max_players:
            game.players.append(player)
            gdb[gid] = game.to_dict()
        else:
            return "Room is full", 409

        db.push(gdb, G_DB)
        return gdb[gid]["gname"]
    except KeyError:
        return "GameParameter not found", 404


@app.route("/game/<gid>/leave/<pid>", methods=["DELETE"])
def gp_remove_player(gid, pid):
    try:
        gdb = db.pull(G_DB)
        if (gdb[gid]["status"] == "DELETED"):
            return "Room is deleted"
        game = Game.from_dict(gdb[gid])
        game.players = [player for player in game.players if player.pid != pid]
        gdb[gid] = game.to_dict()
        db.push(gdb, G_DB)
        return "Player removed"
    except KeyError:
        return "GameParameter not found", 404


@app.route("/game/<gid>", methods=["DELETE"])
def gp_delete(gid):
    gdb = db.pull(G_DB)
    try:
        gdb[gid] = {"status": "DELETED"}
    except KeyError:
        return "GameParameter not found", 404
    db.push(gdb, G_DB)


@app.route("/game/<gid>/team/<pid>", methods=["GET"])
def game_get_team_from_pid(gid, pid):
    gdb = db.pull(GS_DB)
    try:
        game = Game.from_dict(gdb[gid])
        for player in game.players:
            if player.pid == pid:
                return player.team
        else:
            return "Player not found", 404
    except KeyError:
        return "Game not found", 404


# Game Snapshot
@app.route("/gs/<gid>", methods=["GET"])
def gs_read(gid):
    gdb = db.pull(G_DB)
    try:
        return gdb[gid].keyInfo
    except KeyError:
        return "GameSnapshot not found", 404


app.run("0.0.0.0", 5000)
