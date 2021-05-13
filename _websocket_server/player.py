class Player:
    def __init__(self, key, pid, name, avatar, team, points, dist):
        self.key = key
        self.pid, self.name = pid, name
        self.avatar = avatar
        self.team = team
        self.points = points
        self.dist = dist

    def to_dict(self):
        return {"key": self.key,
                "pid": self.pid,
                "name": self.name,
                "avatar": self.avatar,
                "team": self.team,
                "points": self.points,
                "dist": self.dist
                }

    @staticmethod
    def from_dict(_dict):
        print(_dict)
        key = dict.get(_dict, "key", None)
        pid, name = _dict["pid"], _dict["name"]
        avatar = _dict["avatar"]
        team = dict.get(_dict, "team", None)
        points = dict.get(_dict, "points", 0)
        dist = dict.get(_dict, "dist", 0)
        return Player(key, pid, name, avatar, team, points, dist)
