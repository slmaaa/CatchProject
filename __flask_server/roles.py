from checkpoint import CheckpointMovement
from player import Player


class Role:
    def __init__(self, rid,
                 player: Player, team,
                 mv_his: [CheckpointMovement] = None):
        self.rid = rid
        self.player, self.team = player, team
        self.mv_his = mv_his or []

    @staticmethod
    def from_dict(_dict):
        rid = _dict["rid"]
        player = Player.from_dict(_dict["player"])
        team = _dict["team"]
        mv_his = [CheckpointMovement.from_dict(mv) for mv in _dict["mv_his"]]
        return Role(rid, player, team, mv_his)

    def to_dict(self):
        return {"rid": self.rid,
                "player": self.player.to_dict(),
                "team": self.team,
                "mv_his": [mv.to_dict() for mv in self.mv_his]}
