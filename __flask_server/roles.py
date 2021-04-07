from player import Player


class Role:
    def __init__(self, rid, gid,
                 player: Player, team):
        self.rid, self.gid = rid, gid
        self.player, self.team = player, team

    @staticmethod
    def from_dict(_dict):
        rid, gid = _dict["rid"], _dict["gid"]
        player = Player.from_dict(_dict["player"])
        team = _dict["team"]
        return Role(rid, gid, player, team)

    def to_dict(self):
        return {"rid": self.rid,
                "gid": self.gid,
                "player": self.player.to_dict(),
                "team": self.team}
