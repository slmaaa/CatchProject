from area import Area
from location import Location


class Player:
    LOC_HISTORY_SIZE = 50
    LOC_HISTORY_DELAY = 3.0

    def __init__(self, pid, name, avatar, loc_his: [Location] = None):
        self.pid, self.name = pid, name
        self.avatar = avatar
        self.loc_his = loc_his[:self.LOC_HISTORY_SIZE] or []

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

    # loc_his related methods

    @property
    def discontinue_pt(self):
        DISCONTINUE_DIFF = 5 * self.LOC_HISTORY_DELAY
        discontinue_index = None
        for i, loc in enumerate(self.loc_his[1::]):
            time_diff = loc.time - self.loc_his[i].time
            if time_diff >= DISCONTINUE_DIFF:
                discontinue_index = i
        return discontinue_index

    def update_location(self, loc: Location, remove_discontinued=False):
        if (loc.time - self.loc_his[-1].time) >= self.LOC_HISTORY_DELAY:
            self.loc_his = self.loc_his[1:self.LOC_HISTORY_SIZE] + [loc]
        else:
            self.loc_his[-1] = loc
        if remove_discontinued:
            if self.discontinue_pt is not None:
                self.loc_his = self.loc_his[self.discontinue_pt::]

    @property
    def location(self):
        return self.loc_his[-1]

    def get_time_locations(self, start_time, end_time):
        res = []
        for loc in self.loc_his:
            if start_time <= loc.time <= end_time:
                res.append(loc)
        return res

    def area_time_hold(self, area: Area):
        time_holds = [{"time": self.loc_his[0].time,
                       "hold": 0.0}, ]
        for i, loc in enumerate(self.loc_his[1::]):
            if area.has_inside(loc):
                time_diff = loc.time - time_holds[i]["time"]
                new_hold = time_holds[i]["hold"] + time_diff
            else:
                new_hold = 0.0
            time_holds.append({"time": loc.time, "hold": new_hold})
        return time_holds
