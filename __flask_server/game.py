import db
from player import Player
from area import *
from time import time as now


class Game:
    def __init__(self, gid, area: Area, players: [Player] = None,
                 min_players=6, max_players=12):
        self.gid = gid
        self.area = area
        self.players = players
        if players is None:
            self.players = []
        self.min_players, self.max_players = min_players, max_players

    def to_dict(self):
        return {"gid": self.gid,
                "area": self.area.to_dict(),
                "players": [player.to_dict() for player in self.players],
                "min_players": self.min_players,
                "max_players": self.max_players}

    @staticmethod
    def from_dict(self, _dict):
        gid = _dict["gid"]
        area = Area.from_dict(_dict)
        players = [Player.from_dict(player) for player in _dict["players"]]
        min_players, max_players = _dict["min_players"], _dict["max_players"]
        return Game(gid, area, players, min_players, max_players)


class RunningGame:
    def __init__(self, game, start_time=None, end_time=None):
        pass