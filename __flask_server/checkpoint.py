from time import time as now

from area import *
from roles import Role, Transaction


class Checkpoint:
    def __init__(self, cid, area: Area, max_points=10):
        self.cid = cid
        self.area = area
        self.max_points = max_points

    def role_tx(self, role: Role):
        TIME_PER_PT, MAX_TX_PTS = 10, 3
        max_time_hold = max(th["hold"] for th in role.player.area_time_hold(self.area))
        pt_awarded = max(max_time_hold // TIME_PER_PT, MAX_TX_PTS)
        return Transaction(role.team, self, pt_awarded, round(now(), 2))

    def __eq__(self, other):
        return self.cid == other.cid
