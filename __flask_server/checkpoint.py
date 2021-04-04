from area import *


class Checkpoint:
    def __init__(self, cid, name, area: Area):
        self.cid = cid
        self.name = name
        self.area = area

    def __eq__(self, other):
        return self.cid == other.cid

    def to_dict(self):
        return {"cid": self.cid,
                "name": self.name,
                "area": self.area.to_dict()}

    @staticmethod
    def from_dict(_dict):
        cid, name = _dict["cid"], _dict["name"]
        area = Area.from_dict(_dict["area"])
        return Checkpoint(cid, name, area)


class CheckpointMovement:
    def __init__(self, pid, cid, time=None, is_in=True):
        self.pid, self.cid = pid, cid
        self.time = time or round(time(), 2)
        self.is_in = is_in

    def to_dict(self):
        return {"pid": self.pid,
                "cid": self.cid,
                "time": self.time,
                "is_in": self.is_in}

    @staticmethod
    def from_dict(_dict):
        pid, cid, time, is_in = _dict["pid"], _dict["cid"], _dict["time"], _dict["is_in"]
        return CheckpointMovement(pid, cid, time, is_in)
