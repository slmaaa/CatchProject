from time import time as now

from area import *
from roles import Role, Transaction


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

    def from_dict(self, _dict):
        cid, name = _dict["cid"], _dict["name"]
        area = Area.from_dict(_dict["area"])
        return Checkpoint(cid, name, area)