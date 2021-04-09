from pprint import pprint

from checkpoint import *
from game import *
from snapshot import *

checkpoints = [Checkpoint("A1", "Alpha 1", Area()),
               Checkpoint("B1", "Bravo 1", Area()),
               Checkpoint("C1", "Charlie 1", Area())]

players = [Player("P01", "Amy", "S1L1"),
           Player("P02", "Bob", "S1L1"),
           Player("P03", "Charlie", "S1L2")]

teams = ["Red", "Blue"]

game_params = GameParameters("GP01", checkpoints, players, teams, 1, 3)
game = Game("G01", 1, 20, game_params)

movements = [CheckpointMovement(game.roles[0].rid, "A1", 2, True),
             CheckpointMovement(game.roles[0].rid, "A1", 24, False),
             CheckpointMovement(game.roles[2].rid, "A1", 26, True),
             CheckpointMovement(game.roles[1].rid, "A1", 31, True), ]

game_snap = GameSnapshot.from_game(game)
game_snap.fast_forward(60, movements)
pprint(game_snap.to_dict())
