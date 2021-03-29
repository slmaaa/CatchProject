import db
from player import Player
from checkpoint import Checkpoint
from time import time as now


class GameParameters:
    def __init__(self, start_time=None, end_time=None,
                 min_players=8, max_players=20):
        self.start_time, self.end_time = start_time, end_time
        self.min_players, self.max_players = min_players, max_players

    def to_dict(self):
        return {
            "start_time": self.start_time,
            "end_time": self.end_time,
            "min_players": self.min_players,
            "max_players": self.max_players
        }

    @staticmethod
    def from_dict(self, _dict):
        start_time, end_time = _dict["start_time"], _dict["end_time"]
        min_players, max_players = _dict["min_players"], _dict["max_players"]
        return GameParameters(start_time, end_time, min_players, max_players)


class Game:
    def __init__(self, gid, game_params: GameParameters,
                 players: [Player], checkpoints: [Checkpoint]):
        self.gid = gid
        self.parameters = game_params
        self.players = players
        self.checkpoints = checkpoints
