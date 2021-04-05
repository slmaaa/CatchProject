import os

os.mkdir("./store")

dbs = ("./store/Checkpoints.json",
       "./store/Roles.json",
       "./store/GameParameters.json",
       "./store/Games.json",
       "./store/GameSnapshots.json")

for db in dbs:
    with open(db, "w") as file:
        file.write("{}")
