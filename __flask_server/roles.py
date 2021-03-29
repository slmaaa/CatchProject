from time import time as now
from player import Player
from checkpoint import Checkpoint
from area import *


class Transaction:
    def __init__(self, team, checkpoint: Checkpoint, points=0, time=None):
        self.team = team
        self.checkpoint = checkpoint
        self.points = points
        self.time = time or round(now(), 2)


class Role:
    def __init__(self, player: Player, team, transactions: [Transaction]):
        self.player = player
        self.team = team
        self.transactions = transactions or None

    def add_transaction(self, transaction: Transaction):
        if transaction.checkpoint == self.transactions[-1].checkpoint:
            self.transactions[-1].points = max(transaction.points, self.transactions[-1].points)
        else:
            self.transactions.append(transaction)
        return transaction
