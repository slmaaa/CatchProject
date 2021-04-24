from checkpoint import Checkpoint
from player import Player
from time import time as now


class Game:
    def __init__(self, gid, gname, hostID, hostName, checkpoints: [Checkpoint] = None, players: [Player] = None,
                 teams: [str] = None, min_players=6, max_players=20):
        self.gid = gid
        self.gname = gname
        self.hostID = hostID
        self.hostName = hostName
        self.status = "PREPARE"
        self.checkpoints = checkpoints or []

        self.players = players or []
        self.teams = teams or []
        self.min_players, self.max_players = min_players, max_players
        self.startTime = None
        self.endTime = None
        self.capturedCount = {}
        for team in teams:
            self.capturedCount[team] = 0
            for cp in self.checkpoints:
                cp.level[team] = 0
        self.unCapturedCount = len(self.checkpoints)
        self.winTeam = None
        self.keyInfo = {}

    def to_dict(self):
        return {"gid": self.gid, "gname": self.gname, "status": self.status,
                "hostID": self.hostID, "hostName": self.hostName,
                "checkpoints": [checkpoint.to_dict() for checkpoint in self.checkpoints],
                "players": [player.to_dict() for player in self.players], "teams": self.teams,
                "min_players": self.min_players, "max_players": self.max_players,
                "startTime": self.startTime, "endTime": self.endTime, "capturedCount": self.capturedCount,
                "winTeam": self.winTeam}

    def assignTeam(self):
        teaming = []
        players_per_team = round(
            len(self.players) / len(self.teams) + 0.5)
        for team_number in range(len(self.parameters.teams)):
            teaming += players_per_team * [self.teams[team_number]]
        for player, team in zip(self.players, teaming):
            player.team = team

    def start(self):
        self.startTime = now
        self.status = "RUNNING"

    def incrementLevel(self, cid, team):
        self.checkpoints[cid].level[team] += 1
        if(self.checkpoints[cid].level[team] == self.checkpoints[cid].maxLevel):
            self.checkpoints[cid].capturedBy = team
            self.capturedCount[team] += 1
            self.unCapturedCount -= 1
            otherTeams = [x for x in self.teams if x != team]
            win = True
            for x in otherTeams:
                if (self.capturedCount[team] < self.capturedCount[x]+self.unCapturedCount):
                    win = False
            if (win):
                self.status = "OVER"
                self.winTeam = team
                self.endTime = now
        cpsLevel = []
        for cp in self.checkpoints:
            cpsLevel.append(cp.level)
        self.keyInfo = {"status": self.status, "cpsLevel": cpsLevel}

    @ staticmethod
    def from_dict(_dict):
        gid = _dict["gid"]
        gname = _dict["gname"]
        hostID = _dict["hostID"]
        hostName = _dict["hostName"]
        checkpoints = [Checkpoint.from_dict(cp) for cp in _dict["checkpoints"]]
        players = [Player.from_dict(player)
                   for player in _dict.get("players", [])]
        min_players, max_players = _dict.get(
            "min_players", 6), _dict.get("max_players", 20)
        teams = _dict["teams"]
        return Game(gid, gname, hostID, hostName, checkpoints,
                    players, teams, min_players, max_players)
