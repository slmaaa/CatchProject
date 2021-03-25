from player import Player
from time import time as now
from area import *


class Role:
    def __init__(self, player: Player):
        self.player = player


class Runner(Role):
    pass


class Catcher(Role):
    def can_catch_at(self, runner: Runner, time):
        self_loc = self.player.get_time_location(time)
        runner_loc = runner.player.get_time_location(time)
        if all((self_loc, runner_loc)):
            return self_loc.distance_to(runner_loc) <= 5.0
