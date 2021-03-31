from time import time as now
from player import Player
from checkpoint import Checkpoint
from area import *


class Transaction:
    # Transactions are stored on Role and Processed by Game.
    # This allows checking for Max Cumulative Points.
    def __init__(self, checkpoint: Checkpoint, team, points=0, time=None):
        self.checkpoint = checkpoint
        self.team = team
        self.points = points
        self.time = time or round(now(), 2)


class Role:
    def __init__(self, player: Player, team, transactions: [Transaction]):
        self.player = player
        self.team = team
        self.transactions = transactions or []

    def add_transaction(self, transaction: Transaction):
        if transaction.checkpoint == self.transactions[-1].checkpoint:
            self.transactions[-1] = transaction
        else:
            self.transactions.append(transaction)
        return transaction
