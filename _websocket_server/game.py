from random import Random, random
from checkpoint import Checkpoint
from player import Player
from time import time as now
import random


class Game:
    def __init__(self, gid, gname, status, hostID, hostName, hostAvatar, checkpoints: [Checkpoint] = None, players: [Player] = None,
                 teams: [str] = None, min_players=6, max_players=20, startTime=None, endTime=None, capturedCount=None, unCapturedCount=None, winTeam=None, statsCount=0):
        self.gid = gid
        self.gname = gname
        self.hostID = hostID
        self.hostName = hostName
        self.hostAvatar = hostAvatar
        self.status = status
        self.checkpoints = checkpoints or []
        self.players = players or []
        self.teams = teams or []
        self.min_players, self.max_players = min_players, max_players
        self.startTime = startTime
        self.endTime = endTime
        self.capturedCount = capturedCount
        self.unCapturedCount = unCapturedCount
        self.winTeam = winTeam
        self.keyInfo = None
        self.statsCount = statsCount

    def to_dict(self):
        return {"gid": self.gid, "gname": self.gname, "status": self.status,
                "hostID": self.hostID, "hostName": self.hostName, "hostAvatar": self.hostAvatar,
                "checkpoints": [checkpoint.to_dict() for checkpoint in self.checkpoints],
                "players": [player.to_dict() for player in self.players], "teams": self.teams,
                "min_players": self.min_players, "max_players": self.max_players,
                "startTime": self.startTime, "endTime": self.endTime, "capturedCount": self.capturedCount, "unCapturedCount": self.unCapturedCount,
                "winTeam": self.winTeam,
                "statsCount": self.statsCount}

    def assignTeam(self):
        teaming = []
        random.shuffle(self.players)
        players_per_team = round(
            len(self.players) / (len(self.teams) + 0.5))
        for team_number in range(len(self.teams)):
            teaming += players_per_team * [self.teams[team_number]]
        for player, team in zip(self.players, teaming):
            player.team = team
        for index, player in enumerate(self.players):
            player.key = index
        self.status = "PREPARE"

    def start(self):
        for team in self.teams:
            for cp in self.checkpoints:
                cp.level[team] = 0
        self.unCapturedCount = len(self.checkpoints)
        self.startTime = now()
        self.status = "RUNNING"

    def incrementLevel(self, cid, team):
        self.checkpoints[cid].level[team] += 1
        message = team+" team gets a point in "+self.checkpoints[cid].name
        if(self.checkpoints[cid].level[team] == self.checkpoints[cid].maxLevel):
            self.checkpoints[cid].capturedBy = team
            message = team+" captured " + self.checkpoints[cid].name
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
                self.endTime = now()
        cpsLevel = []
        cpsCaptured = []
        for cp in self.checkpoints:
            cpsLevel.append(cp.level)
            cpsCaptured.append(cp.capturedBy)
        self.keyInfo = {"status": self.status,
                        "cpsLevel": cpsLevel, "cpsCaptured": cpsCaptured, "message": message}

    def setPlayerStats(self, key, points, dist):
        self.players[key].points = int(points)
        self.players[key].dist = int(dist)
        self.statsCount += 1
        if (self.statsCount == len(self.players)):
            return True
        else:
            return False

    def findMVPs(self):
        max_dist = self.players[0].dist
        key_dist = self.players[0].key
        max_points = self.players[0].points
        key_point = self.players[0].key
        for player in self.players:
            if(int(player.dist) > int(max_dist)):
                max_dist = player.dist
                key_dist = player.key
            if(int(player.points) > int(max_points)):
                max_points = player.points
                key_point = player.key
        return [key_dist, key_point]

    @ staticmethod
    def from_dict(_dict):
        gid = _dict["gid"]
        gname = _dict["gname"]
        status = _dict.get(
            "status", None)
        hostID = _dict["hostID"]
        hostName = _dict["hostName"]
        hostAvatar = _dict["hostAvatar"]
        checkpoints = [Checkpoint.from_dict(cp) for cp in _dict["checkpoints"]]
        players = [Player.from_dict(player)
                   for player in _dict.get("players", [])]
        min_players, max_players = _dict.get(
            "min_players", 6), _dict.get("max_players", 20)
        teams = _dict.get(
            "teams", None)
        startTime = _dict.get(
            "startTime", None)
        endTime = _dict.get(
            "endTime", None)
        capturedCount = _dict.get(
            "capturedCount", None)
        unCapturedCount = _dict.get(
            "unCapturedCount", None)
        winTeam = _dict.get(
            "winTeam", None)
        statsCount = dict.get(_dict, "statsCount", 0)
        return Game(gid, gname, status, hostID, hostName, hostAvatar, checkpoints,
                    players, teams, min_players, max_players, startTime, endTime, capturedCount, unCapturedCount, winTeam, statsCount)

    @ staticmethod
    def new_game(_dict):
        gid = _dict["gid"]
        gname = _dict["gname"]
        status = _dict.get(
            "status", None)
        hostID = _dict["hostID"]
        hostName = _dict["hostName"]
        hostAvatar = _dict["hostAvatar"]
        checkpoints = []
        players = [Player.from_dict(player)
                   for player in _dict.get("players", [])]
        min_players, max_players = _dict.get(
            "min_players", 6), _dict.get("max_players", 20)
        teams = _dict["teams"]
        startTime = None
        endTime = None
        capturedCount = dict()
        unCapturedCount = 0
        for team in teams:
            capturedCount[team] = 0
            for cp in checkpoints:
                cp.level[team] = 0
        winTeam = _dict.get(
            "winTeam", None)
        return Game(gid, gname, status, hostID, hostName, hostAvatar, checkpoints,
                    players, teams, min_players, max_players, startTime, endTime, capturedCount, unCapturedCount, winTeam)
