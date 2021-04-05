from time import time as now

from player import Player
from roles import Role
from checkpoint import Checkpoint


class GameParameters:
    def __init__(self, checkpoints: [Checkpoint] = None, players: [Player] = None,
                 teams: [str] = None, min_players=8, max_players=20):
        self.checkpoints = checkpoints or []
        self.players = players or []
        self.teams = teams or []
        self.min_players, self.max_players = min_players, max_players

    def to_dict(self):
        return {"checkpoints": [checkpoint.to_dict() for checkpoint in self.checkpoints],
                "players": [player.to_dict() for player in self.players],
                "min_players": self.min_players, "max_players": self.max_players}

    @staticmethod
    def from_dict(_dict):
        checkpoints = [Checkpoint.from_dict(checkpoint) for checkpoint in _dict["checkpoints"]]
        players = [Player.from_dict(player) for player in _dict["players"]]
        min_players, max_players = _dict["min_players"], _dict["max_players"]
        return GameParameters(checkpoints, players, min_players, max_players)


class Game:
    def __init__(self, gid,
                 start_time, end_time,
                 parameters: GameParameters,
                 roles: [Role] = None):
        self.gid = gid
        self.start_time, self.end_time = start_time, end_time
        self.parameters = parameters
        if roles is not None:
            self.roles = roles
        else:
            self.assign_roles()

    def assign_roles(self):
        teaming = []
        players_per_team = round(len(self.parameters.players) / len(self.parameters.teams) + 0.5)
        for team_number in range(len(self.parameters.teams)):
            teaming += players_per_team * [self.parameters.teams[team_number]]
        self.roles = []
        for player, team in zip(self.parameters.players, teaming):
            rid = "G%s-P%s" % (self.gid, player.pid)
            self.roles.append(Role(rid, player, team))