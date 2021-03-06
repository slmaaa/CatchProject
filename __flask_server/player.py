class Player:
    def __init__(self, pid, name, avatar):
        self.pid, self.name = pid, name
        self.avatar = avatar

    def to_dict(self):
        return {"pid": self.pid,
                "name": self.name,
                "avatar": self.avatar,
                }

    @staticmethod
    def from_dict(_dict):
        pid, name = _dict["pid"], _dict["name"]
        avatar = _dict["avatar"]
        return Player(pid, name, avatar)
