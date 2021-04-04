from location import Location
from checkpoint import CheckpointMovement
from player import Player


class Role:
    def __init__(self, player: Player, team,
                 mv_his: [CheckpointMovement] = None,
                 loc_his: [Location] = None):
        self.player, self.team = player, team
        self.mv_his, self.loc_his = mv_his or [], loc_his or []
