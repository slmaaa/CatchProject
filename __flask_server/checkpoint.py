from area import *
from time import time as now

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
    def __init__(self, rid, cid, time=None, is_in=True, applied=False):
        self.rid, self.cid = rid, cid
        self.time = time or round(time(), 2)
        self.is_in = is_in
        self.applied = applied

    def to_dict(self):
        return {"rid": self.rid,
                "cid": self.cid,
                "time": self.time,
                "is_in": self.is_in,
                "applied": self.applied}

    @staticmethod
    def from_dict(_dict):
        rid, cid = _dict["rid"], _dict["cid"]
        time = _dict.get("time", round(now(), 2))
        is_in, applied = _dict.get("is_in", True), _dict.get("applied", False)
        return CheckpointMovement(rid, cid, time, is_in, applied)
