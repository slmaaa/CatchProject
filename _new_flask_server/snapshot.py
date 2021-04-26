from time import time as now

from checkpoint import CheckpointMovement
from game import Game


class RoleSnapshot:
    def __init__(self, time, rid, team,
                 cid=None, is_in=False,
                 contributed=0, time_effective=0):
        self.time = time or round(now(), 2)
        self.rid, self.team = rid, team
        self.cid, self.is_in = cid, is_in
        self.contributed, self.time_effective = contributed, time_effective

    def to_dict(self):
        return {"time": self.time,
                "rid": self.rid, "team": self.team,
                "cid": self.cid, "is_in": self.is_in,
                "contributed": self.contributed, "time_effective": self.time_effective}

    @staticmethod
    def from_dict(_dict):
        time = _dict["time"]
        rid, team = _dict["rid"], _dict["team"]
        cid, is_in = _dict.get("cid", None), _dict.get("is_in", False)
        contributed, time_effective = _dict.get("contributed", 0), _dict.get("time_effective", 0)
        return RoleSnapshot(time, rid, team, cid, is_in, contributed, time_effective)

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
        movement.applied = True
        self.time = movement.time
        return True


class CheckpointSnapshot:
    def __init__(self, time, cid, name,
                 team=None, energy=0,
                 capturing_team=None, capturing_players=0):
        self.time = time or round(now(), 2)
        self.cid, self.name = cid, name
        self.team, self.energy = team, energy
        self.capturing_team, self.capturing_players = capturing_team, capturing_players

    def to_dict(self):
        return {"time": self.time,
                "cid": self.cid, "name": self.name,
                "team": self.team, "energy": self.energy,
                "capturing_team": self.capturing_team,
                "capturing_players": self.capturing_players
                }

    @staticmethod
    def from_dict(_dict):
        time = _dict["time"]
        cid, name = _dict["cid"], _dict["name"]
        team, energy = _dict.get("team", None), _dict.get("energy", 0)
        capturing_team, capturing_players = _dict.get("capturing_team", None), _dict.get("capturing_players", 0)
        return CheckpointSnapshot(time, cid, name,
                                  team, energy, capturing_team, capturing_players)


class GameSnapshot:
    def __init__(self, time, gid,
                 checkpoint_snapshots: [CheckpointSnapshot] = None,
                 role_snapshots: [RoleSnapshot] = None,
                 pending_movements: [CheckpointMovement] = None,
                 team_scores: dict = None,
                 winning_team=None):
        self.time, self.gid = time, gid
        self.checkpoint_snapshots = checkpoint_snapshots or []
        self.role_snapshots = role_snapshots or []
        self.pending_movements = pending_movements or []
        self.team_scores = team_scores or {}
        self.winning_team = winning_team or None

    def to_dict(self):
        return {"time": self.time, "gid": self.gid,
                "checkpoint_snapshots": [snapshot.to_dict() for snapshot in self.checkpoint_snapshots],
                "role_snapshots": [snapshot.to_dict() for snapshot in self.role_snapshots],
                "pending_movements": [movement.to_dict() for movement in self.pending_movements],
                "team_scores": self.team_scores,
                "winning_team": self.winning_team}

    @staticmethod
    def from_dict(_dict):
        time, gid = _dict["time"], _dict["gid"]
        checkpoint_snapshots = [CheckpointSnapshot.from_dict(_d) for _d in _dict.get("checkpoint_snapshots", [])]
        role_snapshots = [RoleSnapshot.from_dict(_d) for _d in _dict.get("role_snapshots", [])]
        pending_movements = [CheckpointMovement.from_dict(_d) for _d in _dict.get("pending_movements", [])]
        team_scores = _dict.get("team_scores", {})
        winning_team = _dict.get("winning_team", None)
        return GameSnapshot(time, gid,
                            checkpoint_snapshots, role_snapshots, pending_movements,
                            team_scores, winning_team)

    @staticmethod
    def from_game(game: Game):
        gid, time = game.gid, game.start_time
        checkpoint_snapshots = [CheckpointSnapshot(time, checkpoint.cid, checkpoint.name)
                                for checkpoint in game.parameters.checkpoints]
        role_snapshots = [RoleSnapshot(time, role.rid, role.team) for role in game.roles]
        pending_movements = []
        team_scores = {team: 0 for team in game.parameters.teams}
        return GameSnapshot(time, gid, checkpoint_snapshots, role_snapshots, pending_movements, team_scores)

    def rid_get_role(self, rid) -> RoleSnapshot:
        for role in self.role_snapshots:
            if role.rid == rid:
                return role

    def cid_get_checkpoint(self, cid) -> CheckpointSnapshot:
        for checkpoint in self.checkpoint_snapshots:
            if checkpoint.cid == cid:
                return checkpoint

    @staticmethod
    def role_is_in_checkpoint(role: RoleSnapshot, checkpoint: CheckpointSnapshot):
        return role.cid == checkpoint.cid and role.is_in

    @staticmethod
    def checkpoint_team_add_energy(checkpoint: CheckpointSnapshot, team, energy):
        if checkpoint.team == team:
            checkpoint.energy += energy
        else:
            if checkpoint.energy >= energy:
                checkpoint.energy -= energy
            else:
                checkpoint.team, checkpoint.energy = team, energy - checkpoint.energy
        if checkpoint.energy == 0:
            checkpoint.team = None

    def update_checkpoints_capture_team(self, time):
        for checkpoint in self.checkpoint_snapshots:
            capturing_teams = [role.team for role in self.role_snapshots
                               if self.role_is_in_checkpoint(role, checkpoint)]
            if capturing_teams:
                capturing_team_count = {team: capturing_teams.count(team)
                                        for team in tuple(set(capturing_teams))}
                max_capturing_players = max(capturing_team_count.values())
                max_capturing_teams = [team for team in capturing_team_count if
                                       capturing_team_count[team] == max_capturing_players]
                if max_capturing_players == 0:
                    checkpoint.capturing_team, checkpoint.capturing_players = None, 0
                elif len(max_capturing_teams) == 1:
                    checkpoint.capturing_team, checkpoint.capturing_players = \
                        max_capturing_teams[0], max_capturing_players
                elif len(max_capturing_teams) > 1:
                    checkpoint.capturing_team, checkpoint.capturing_players = None, max_capturing_players
                else:
                    pass
            checkpoint.time = time

    MAX_CONTRIBUTION = 3
    TIME_PER_ENERGY = 10

    def checkpoints_consume_time_effective(self, time):
        for checkpoint in self.checkpoint_snapshots:
            for role in self.role_snapshots:
                if self.role_is_in_checkpoint(role, checkpoint) and \
                        checkpoint.capturing_team == role.team and \
                        role.time_effective >= self.TIME_PER_ENERGY and \
                        role.contributed < self.MAX_CONTRIBUTION:
                    role.time_effective -= self.TIME_PER_ENERGY
                    self.checkpoint_team_add_energy(checkpoint, role.team, 1)
            checkpoint.time = time

    def update_roles(self, time, movements: [CheckpointMovement] = None):
        movements = movements or []
        active_movements = [movement for movement in movements if movement.time <= time and not movement.applied]
        for movement in active_movements:
            role = self.rid_get_role(movement.rid)
            role.apply_movement(movement)

        for checkpoint in self.checkpoint_snapshots:
            for role in self.role_snapshots:
                if self.role_is_in_checkpoint(role, checkpoint) and \
                        role.team == checkpoint.capturing_team and \
                        role.contributed < self.MAX_CONTRIBUTION:
                    time_delta = max(0, time - role.time)
                    role.time_effective += time_delta
                    role.time = time

    def fast_forward(self, time, movements: [CheckpointMovement] = None):
        if self.winning_team:
            return False

        movements = movements or []
        movements.sort(key=lambda mv: mv.time)

        for clock in range(int(self.time), int(time + 1)):
            for checkpoint in self.checkpoint_snapshots:
                if clock != self.time:  # Duplicate same second request may add duplicate points
                    if checkpoint.team is not None:
                        self.team_scores[checkpoint.team] += checkpoint.energy

            self.update_roles(clock, movements)
            self.update_checkpoints_capture_team(clock)
            self.checkpoints_consume_time_effective(clock)

        self.time = time

        WINNING_SCORE = 500
        for team, score in self.team_scores.items():
            if score >= WINNING_SCORE:
                self.winning_team = team
                break

        return True
