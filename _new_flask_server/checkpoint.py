from area import *
from time import time as now


class Checkpoint:
    def __init__(self, cid, name, area: Area, maxLevel, level, capturedBy):
        self.cid = cid
        self.name = name
        self.area = area
        self.maxLevel = maxLevel
        self.level = level
        self.capturedBy = capturedBy

    def __eq__(self, other):
        return self.cid == other.cid

    def to_dict(self):
        return {"cid": self.cid,
                "name": self.name,
                "area": self.area.to_dict(),
                "maxLevel": self.maxLevel,
                "level": self.level,
                "capturedBy": self.capturedBy}

    @staticmethod
    def from_dict(_dict):
        cid, name, maxLevel = _dict["cid"], _dict["name"], _dict["maxLevel"]
        area = Area.from_dict(_dict["area"])
        level = _dict.get("level", dict())
        capturedBy = _dict.get("capturedBy", None)
        return Checkpoint(cid, name, area, maxLevel, level, capturedBy)
