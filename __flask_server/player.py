from location import Location


class Player:

    def __init__(self, pid, name, avatar, loc_his: [Location] = None):
        self.pid, self.name = pid, name
        self.avatar = avatar
        self.loc_his = loc_his
        if loc_his is None:
            self.loc_his = []

    def to_dict(self):
        return {"pid": self.pid,
                "name": self.name,
                "avatar": self.avatar,
                "loc_his": [loc.to_dict() for loc in self.loc_his]
                }

    @staticmethod
    def from_dict(_dict):
        pid, name = _dict["pid"], _dict["name"]
        avatar = _dict["avatar"]
        loc_his = [Location.from_dict(loc) for loc in _dict["loc_his"]]
        return Player(pid, name, avatar, loc_his)

    def update_location(self, loc: Location):
        self.loc_his.append(loc)

    @property
    def location(self):
        return self.loc_his[-1]

    def get_time_location(self, time, lower=0.0, upper=1.0, first=True) -> Location:
        res, res_diff = None, upper - lower
        for loc in self.loc_his:
            if lower <= loc.time - time <= upper:
                if first:
                    return loc
                if abs(loc.time - time) <= res_diff:
                    res, res_diff = loc, abs(loc.time - time)
        return res