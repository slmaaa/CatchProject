import asyncio
import websockets
import json
import logging
import random
import db
from game import *
logger = logging.getLogger('websockets')
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

connected = dict()
G_DB = "./store/Games.json"


async def create_game_handler(websocket, _dict):
    game = None
    try:
        gid = 0
        gdb = db.pull(G_DB)
        assigned = False
        while (not assigned):
            gid = random.randint(100000, 999999)
            if gid not in gdb:
                _dict["gid"] = gid
                assigned = True
        game = Game.new_game(_dict)
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Create game - Wrong Format"}')
        return
    gdb[gid] = game.to_dict()
    db.push(gdb, G_DB)
    await websocket.send('{"header": "CREATED", "content":'+json.dumps(gdb[gid])+'}')
    await register(websocket, str(gid))


async def join_game_handler(websocket, _dict):
    try:
        gid = _dict["gid"]
        player = Player.from_dict(_dict["player"])
    except KeyError:
        await websocket.send('{"header":"ERROR", "content":"Join Game - Wrong Format"}')
        return
    try:
        gdb = db.pull(G_DB)
        if (gdb[gid]["status"] == "DELETED"):
            await websocket.send('{"header":"ERROR", "content":"Room has been deleted"}')
            return
        game = Game.from_dict(gdb[gid])
        if len(game.players) < game.max_players:
            game.players.append(player)
            gdb[gid] = game.to_dict()
        else:
            await websocket.send('{"header":"ERROR", "content":"Room is fulled"}')
            return
        db.push(gdb, G_DB)
        await websocket.send('{"header": "JOINED", "content":'+json.dumps(gdb[gid])+'}')
        await register(websocket, gid)
        game = gdb[gid]
        room_info = {"status": game["status"],
                     "players": game["players"]}
        await broadcast(gid, "ROOM_INFO", room_info)

    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Game not found"}')


async def confirm_game_handler(websocket, gid):
    try:
        gdb = db.pull(G_DB)
        if (gdb[gid]["status"] == "DELETED"):
            await websocket.send('{"header":"ERROR", "content":"Room has been deleted"}')
            return

        game = Game.from_dict(gdb[gid])

        # Disable for testing
        # if len(game.players) < game.min_players:
        #     await websocket.send('{"header":"ERROR", "content":"Not enough players"}')
        #     return

        game.assignTeam()
        game.status = "PREPARE"
        gdb[gid] = game.to_dict()
        db.push(gdb, G_DB)
        game = gdb[gid]
        room_info = {"status": game["status"],
                     "players": game["players"]}
        await broadcast(gid, "ROOM_INFO", room_info)
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Confirmation fail"}')


async def save_checkpoints_handler(websocket, _dict):
    try:
        gid = _dict["gid"]
        cps = list()
        for cp in _dict["checkpoints"]:
            cps.append(Checkpoint.from_dict(cp))

    except:
        await websocket.send('{"header":"ERROR", "content":"Save checkpoints- Wrong Format"}')
        return
    try:
        gdb = db.pull(G_DB)
        if (gdb[gid]["status"] == "DELETED"):
            await websocket.send('{"header":"ERROR", "content":"Room has been deleted"}')
            return
        game = Game.from_dict(gdb[gid])
        game.checkpoints = cps
        gdb[gid] = game.to_dict()
        db.push(gdb, G_DB)
        await websocket.send('{"header": "CPS_SAVED", "content":true}')
        game = gdb[gid]
        room_info = {"status": game["status"],
                     "checkpoints": game["checkpoints"]}
        await broadcast(gid, "ROOM_INFO", room_info)

    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Game not found"}')


async def start_game_handler(websocket, gid):
    try:
        gdb = db.pull(G_DB)
        if (gdb[gid]["status"] == "DELETED"):
            await websocket.send('{"header":"ERROR", "content":"Room has been deleted"}')
            return

        game = Game.from_dict(gdb[gid])

        # Disable for testing
        # if len(game.players) < game.min_players:
        #     await websocket.send('{"header":"ERROR", "content":"Not enough players"}')
        #     return
        game.start()
        gdb[gid] = game.to_dict()
        db.push(gdb, G_DB)
        game = gdb[gid]
        room_info = {"status": game["status"],
                     "players": game["players"],
                     "checkpoints": game["checkpoints"]}
        await broadcast(gid, "ROOM_INFO", room_info)
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Start fail"}')


async def add_handler(websocket, _dict):
    try:
        gdb = db.pull(G_DB)
        game = Game.from_dict(gdb[_dict["gid"]])
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Cannot find game"}')
        return
    try:
        game.incrementLevel(int(_dict["cid"]), _dict["team"])
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Incremnet fail"}')
        return
    try:
        await broadcast(_dict["gid"], "GAME_INFO", game.keyInfo)
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Broadcast fail"}')
        return
    try:
        gdb[_dict["gid"]] = game.to_dict()
        db.push(gdb, G_DB)
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Save game fail"}')


async def player_stats_handler(websocket, _dict):
    try:
        gdb = db.pull(G_DB)
        game = Game.from_dict(gdb[_dict["gid"]])
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Cannot find game"}')
        return
    try:
        flag = game.setPlayerStats(
            int(_dict["key"]), _dict["points"], _dict["dist"])
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Updatae stats fail"}')
        return
    try:
        gdb[_dict["gid"]] = game.to_dict()
        db.push(gdb, G_DB)
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Save game fail"}')
    try:
        if flag:
            [distMVP, pointMVP] = game.findMVPs()
            game = gdb[_dict["gid"]]
            await broadcast(_dict["gid"], "ACCOUNT_FINISHED", {"players": game["players"], "winTeam": game["winTeam"], "distMVP": distMVP, "pointMVP": pointMVP})
    except Exception as e:
        print(e)
        await websocket.send('{"header": "ERROR", "content": "Broadcast fail"}')
        return


async def broadcast(room, header, content):
    message = {"header": header, "content": content}
    await asyncio.wait([user.send(json.dumps(message)) for user in connected[room]])


async def register(websocket, gameID):
    if gameID in connected.keys():
        connected[gameID].add(websocket)
    else:
        connected[gameID] = {websocket}
    print(websocket, " added")


async def handler(websocket, path):
    try:
        async for message in websocket:
            print(message)
            _dict = json.loads(message)
            if (_dict["header"] == "CREATE"):
                print("Received CREATE request")
                await create_game_handler(
                    websocket, _dict["content"])
            elif (_dict["header"] == "JOIN"):
                print("Received JOIN request")
                await join_game_handler(
                    websocket, _dict["content"])
            elif (_dict["header"] == "CONFIRM"):
                print("Received CONFIRM request")
                await confirm_game_handler(websocket, _dict["content"])
            elif (_dict["header"] == "SAVE_CPS"):
                print("Received SAVE_CPS request")
                await save_checkpoints_handler(websocket, _dict["content"])
            elif (_dict["header"] == "START"):
                print("Received START request")
                await start_game_handler(websocket, _dict["content"])
            elif (_dict["header"] == "ADD"):
                print("Received ADD request")
                await add_handler(websocket, _dict["content"])
            elif (_dict["header"] == "PLAYER_STATS"):
                print("Received PLAYER_STATS request")
                await player_stats_handler(websocket, _dict["content"])
                # else:
                #     gameID = path[1:]
                #
    finally:
        pass
        # connected[gameID].remove(websocket)


async def hello(websocket, path):
    name = await websocket.recv()
    print(f"< {name}")

    greeting = f"Hello {name}!"

    await websocket.send('{"header": "ERROR", "content": "Game not found"}'
                         )
    print(f"> {greeting}")


start_server = websockets.serve(handler, "", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
