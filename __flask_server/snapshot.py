from time import time as now

from checkpoint import CheckpointMovement
from game import Game


class RoleSnapshot:
    def __init__(self, rid, team,
                 cid=None, is_in=False,
                 contributed=0, time_effective=0):
        self.rid, self.team = rid, team
        self.cid, self.is_in = cid, is_in
        self.contributed, self.time_effective = contributed, time_effective

    def to_dict(self):
        return {"rid": self.rid, "team": self.team,
                "cid": self.cid, "is_in": self.is_in,
                "contributed": self.contributed, "time_effective": self.time_effective}

    @staticmethod
    def from_dict(_dict):
        rid, team = _dict["rid"], _dict["team"]
        cid, is_in = _dict["cid"], _dict["is_in"]
        contributed, time_effective = _dict["contributed"], _dict["time_effective"]
        return RoleSnapshot(rid, team, cid, is_in, contributed, time_effective)

    def apply_movement(self, movement: CheckpointMovement):
        if movement.rid != self.rid:
            return None
        if movement.is_in:
            if movement.cid != self.cid:
                self.contributed = 0
            self.cid = movement.cid
            self.is_in = True
        else:
            self.time_effective = 0
            self.is_in = False
        return True


class CheckpointSnapshot:
    MAX_ENERGY_PER_STAY = 3
    TIME_PER_ENERGY = 10

    def __init__(self, time, cid, name,
                 team=None, energy=0,
                 capturing_team=None, capturing_players=0,
                 role_snapshots: [RoleSnapshot] = None):
        self.time = time or round(now(), 2)
        self.cid, self.name = cid, name
        self.team, self.energy = team, energy
        self.capturing_team, self.capturing_players = capturing_team, capturing_players
        self.role_snapshots = role_snapshots or []

    def to_dict(self):
        return {"time": self.time,
                "cid": self.cid, "name": self.name,
                "team": self.team, "energy": self.energy,
                "capturing_team": self.capturing_team,
                "capturing_players": self.capturing_players,
                "role_snapshots": [snapshot.to_dict() for snapshot in self.role_snapshots]
                }

    @staticmethod
    def from_dict(_dict):
        time = _dict["time"]
        cid, name = _dict["cid"], _dict["name"]
        team, energy = _dict["team"], _dict["energy"]
        capturing_team, capturing_players = _dict["capturing_team"], _dict["capturing_players"]
        role_snapshots = [RoleSnapshot.from_dict(snapshot) for snapshot in _dict["role_snapshots"]]
        return CheckpointSnapshot(time, cid, name,
                                  team, energy, capturing_team, capturing_players,
                                  role_snapshots)

    def update_capture(self):
        role_teams = [snapshot.team for snapshot in self.role_snapshots]
        teams = tuple(set(role_teams))
        self.capturing_team, self.capturing_players = None, 0
        for team in teams:
            if role_teams.count(team) > self.capturing_players:
                self.capturing_team, self.capturing_players = team, role_teams.count(team)
            elif role_teams.count(team) == self.capturing_players:
                self.capturing_team = None
            else:
                pass

        for snapshot in self.role_snapshots:
            if (snapshot.team == self.capturing_team) \
                    and (snapshot.contributed < self.MAX_ENERGY_PER_STAY):
                if snapshot.time_effective >= self.TIME_PER_ENERGY:
                    if self.energy > 0:
                        if snapshot.team == self.team:
                            self.energy += 1
                        else:
                            self.energy -= 1
                    else:
                        self.team, self.energy = snapshot.team, 1
                    if self.energy == 0:
                        self.team = None
                    snapshot.time_effective -= self.TIME_PER_ENERGY
                    snapshot.contributed += 1

    def update_role_snapshots(self, time, movements: [CheckpointMovement] = None):
        movements = movements or []
        movements = [movement for movement in movements if movement.time <= time and movement.cid == self.cid]
        for movement in movements:
            for role in self.role_snapshots:
                role.apply_movement(movement)
        self.role_snapshots = [snapshot for snapshot in self.role_snapshots if snapshot.is_in]
        for snapshot in self.role_snapshots:
            if (snapshot.contributed < self.MAX_ENERGY_PER_STAY) and (snapshot.team == self.capturing_team):
                snapshot.time_effective += time - self.time
        return True

    def update(self, time=None, movements: [CheckpointMovement] = None):
        time = time or round(now(), 2)
        self.update_role_snapshots(time, movements)
        self.update_capture()
        self.time = time


class GameSnapshot:
    def __init__(self, gid, time,
                 checkpoint_snapshots: [CheckpointSnapshot] = None,
                 role_snapshots: [RoleSnapshot] = None,
                 team_scores: dict = None):
        self.gid, self.time = gid, time
        self.checkpoint_snapshots = checkpoint_snapshots
        self.role_snapshots = role_snapshots
        self.team_scores = team_scores or {}
        self.winning_team = None

    def to_dict(self):
        return {"gid": self.gid, "time": self.time,
                "checkpoint_snapshots": [snapshot.to_dict() for snapshot in self.checkpoint_snapshots],
                "role_snapshots": [snapshot.to_dict() for snapshot in self.role_snapshots],
                "team_scores": self.team_scores}

    @staticmethod
    def from_dict(_dict):
        gid, time = _dict["gid"], _dict["time"]
        checkpoint_snapshots = [CheckpointSnapshot.from_dict(_d) for _d in _dict["checkpoint_snapshots"]]
        role_snapshots = [RoleSnapshot.from_dict(_d) for _d in _dict["role_snapshots"]]
        team_scores = _dict["team_scores"]
        return GameSnapshot(gid, time, checkpoint_snapshots, role_snapshots, team_scores)

    @staticmethod
    def from_game(game: Game):
        gid, time = game.gid, game.start_time
        checkpoint_snapshots = [CheckpointSnapshot(time, checkpoint.cid, checkpoint.name) \
                                for checkpoint in game.parameters.checkpoints]
        role_snapshots = [RoleSnapshot(role.rid, role.team) for role in game.roles]
        team_scores = {team: 0 for team in game.parameters.teams}
        return GameSnapshot(gid, time, checkpoint_snapshots, role_snapshots, team_scores)

    def rid_get_role(self, rid):
        for role in self.role_snapshots:
            if role.rid == rid:
                return role
        return None

    def cid_get_checkpoint(self, cid):
        for checkpoint in self.checkpoint_snapshots:
            if checkpoint.cid == cid:
                return checkpoint
        return None

    def fast_forward(self, time, movements):
        if self.winning_team:
            return False

        movements.sort(key=lambda movement: movement.time)

        time = int(time)

        for clock in range(self.time, time + 1):
            for checkpoint in self.checkpoint_snapshots:
                if checkpoint.team is not None:
                    self.team_scores[checkpoint.team] += checkpoint.energy

            pending_movements = []
            while movements:
                if movements[0].time <= clock:
                    pending_movements.append(movements.pop(0))
                else:
                    break

            for movement in pending_movements:
                if movement.is_in:
                    checkpoint = self.cid_get_checkpoint(movement.cid)
                    role = self.rid_get_role(movement.rid)
                    checkpoint.role_snapshots.append(role)

            for checkpoint in self.checkpoint_snapshots:
                checkpoint.update(clock, pending_movements)

        self.time = time

        WINNING_SCORE = 500
        for team, score in self.team_scores.items():
            if score >= WINNING_SCORE:
                self.winning_team = team
                break
        return True
