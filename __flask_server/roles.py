from player import Player


class Role:
    def __init__(self, rid,
                 player: Player, team):
        self.rid = rid
        self.player, self.team = player, team

    @staticmethod
    def from_dict(_dict):
        rid = _dict["rid"]
        player = Player.from_dict(_dict["player"])
        team = _dict["team"]
        return Role(rid, player, team)

    def to_dict(self):
        return {"rid": self.rid,
                "player": self.player.to_dict(),
                "team": self.team}
