from player import Player
from roles import Role
from checkpoint import Checkpoint
from time import time as now


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

    def simulate(self, time=None):
        movement_queue = []
        for role in self.roles:
            movement_queue.extend(role.mv_his)
        movement_queue.sort(key=lambda mv_his: mv_his.time)

        checkpoints = {}
        for checkpoint in self.parameters.checkpoints:
            checkpoints[checkpoint.cid] = {"name": checkpoint.name,
                                           "team": None,
                                           "energy": 0,
                                           "rids": []}
        roles = {}
        MAX_ENERGY_PER_STAY = 3
        TIME_PER_ENERGY = 10
        for role in self.roles:
            roles[role.rid] = {"team": role.team,
                               "cid": None,
                               "contributed": 0,
                               "time_effective": 0,
                               "is_in": False}
        team_scores = {team: 0 for team in self.parameters.teams}

        start_time = self.start_time
        time_now = time or int(now())
        for clock in range(start_time, time_now):
            for checkpoint in checkpoints.values():
                if checkpoint["team"]:
                    team_scores[checkpoint["team"]] += checkpoint["energy"]

            pending_movements = []
            while movement_queue:
                if movement_queue[0].time <= clock:
                    pending_movements.append(movement_queue.pop(0))
                else:
                    break
            for movement in pending_movements:
                if movement.is_in:
                    if movement.rid != roles[movement.rid]["cid"]:
                        roles[movement.rid]["contributed"] = 0
                    roles[movement.rid]["cid"] = movement.cid
                    roles[movement.rid]["is_in"] = True
                    checkpoints[movement.cid]["rids"].append(movement.rid)
                else:
                    roles[movement.rid]["time_effective"] = 0
                    roles[movement.rid]["is_in"] = False
                    checkpoints[movement.cid]["rids"] = [rid for rid in checkpoints[movement.cid]["rids"] if
                                                         rid != movement.rid]

            for checkpoint in checkpoints.values():
                checkpoint_roles = [roles[rid] for rid in checkpoint["rids"]]
                checkpoint_role_teams = [role["team"] for role in checkpoint_roles]
                capturing_team, capturing_players = None, 0
                for team in self.parameters.teams:
                    if checkpoint_role_teams.count(team) > capturing_players:
                        capturing_team, capturing_players = team, checkpoint_role_teams.count(team)
                    elif checkpoint_role_teams.count(team) == capturing_players:
                        capturing_team, capturing_players = None, checkpoint_role_teams.count(team)
                    else:
                        pass

                for role in checkpoint_roles:
                    if (role["team"] == capturing_team) and (role["contributed"] < MAX_ENERGY_PER_STAY):
                        role["time_effective"] += 1
                        if role["time_effective"] >= TIME_PER_ENERGY:
                            if checkpoint["team"] is None:
                                checkpoint["team"] = role["team"]
                                checkpoint["energy"] = 1
                            elif checkpoint["team"] == role["team"]:
                                checkpoint["energy"] += 1
                            elif checkpoint["energy"] == 1:
                                checkpoint["team"] = None
                                checkpoint["energy"] = 0
                            else:
                                checkpoint["energy"] -= 1
                            role["time_effective"] -= TIME_PER_ENERGY
                            role["contributed"] += 1

        return {"checkpoints": checkpoints,
                "roles": roles,
                "team_scores": team_scores}
