class Player:
    def __init__(self, pid, name, avatar, team):
        self.pid, self.name = pid, name
        self.avatar = avatar
        self.team = team

    def to_dict(self):
        return {"pid": self.pid,
                "name": self.name,
                "avatar": self.avatar,
                "team": self.team
                }

    @staticmethod
    def from_dict(_dict):
        pid, name = _dict["pid"], _dict["name"]
        avatar = _dict["avatar"]
        team = dict.get(_dict, "team", None)
        return Player(pid, name, avatar, team)
