from checkpoint import Checkpoint
from player import Player
from roles import Role


class GameParameters:
    def __init__(self, gpid, checkpoints: [Checkpoint] = None, players: [Player] = None,
                 teams: [str] = None, min_players=8, max_players=20):
        self.gpid = gpid
        self.checkpoints = checkpoints or []
        self.players = players or []
        self.teams = teams or []
        self.min_players, self.max_players = min_players, max_players

    def to_dict(self):
        return {"gpid": self.gpid,
                "checkpoints": [checkpoint.to_dict() for checkpoint in self.checkpoints],
                "players": [player.to_dict() for player in self.players],
                "min_players": self.min_players, "max_players": self.max_players}

    @staticmethod
    def from_dict(_dict):
        gpid = _dict["gpid"]
        checkpoints = [Checkpoint.from_dict(checkpoint) for checkpoint in _dict["checkpoints"]]
        players = [Player.from_dict(player) for player in _dict["players"]]
        min_players, max_players = _dict["min_players"], _dict["max_players"]
        return GameParameters(gpid, checkpoints, players, min_players, max_players)


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

    def to_dict(self):
        return {"gid": self.gid,
                "start_time": self.start_time, "end_time": self.end_time,
                "parameters": self.parameters.to_dict(),
                "roles": [role.to_dict() for role in self.roles]}

    @staticmethod
    def from_dict(_dict):
        gid = _dict["gid"]
        start_time, end_time = _dict["start_time"], _dict["end_time"]
        parameters = GameParameters.from_dict(_dict["parameters"])
        roles = [Role.from_dict(role) for role in _dict["roles"]]
        return Game(gid, start_time, end_time, parameters, roles)

    def assign_roles(self):
        teaming = []
        players_per_team = round(len(self.parameters.players) / len(self.parameters.teams) + 0.5)
        for team_number in range(len(self.parameters.teams)):
            teaming += players_per_team * [self.parameters.teams[team_number]]
        self.roles = []
        for player, team in zip(self.parameters.players, teaming):
            rid = "G%s-P%s" % (self.gid, player.pid)
            self.roles.append(Role(rid, self.gid, player, team))
