import db
from player import Player
from roles import Role
from checkpoint import Checkpoint
from time import time as now


class GameParameters:
    def __init__(self, checkpoints: [Checkpoint] = None, min_players=8, max_players=20):
        self.checkpoints = checkpoints or []
        self.min_players, self.max_players = min_players, max_players

    def to_dict(self):
        pass

    @staticmethod
    def from_dict(self, _dict):
        pass


class Game:
    def __init__(self):
        pass