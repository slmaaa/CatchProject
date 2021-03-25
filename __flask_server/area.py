from time import time as now
from random import random
from location import Location

class Area:
    def __init__(self, time):
        self.time = time
        if time is None:
            self.time = round(now(), 2)

    def to_dict(self):
        pass

    @staticmethod
    def from_dict(_dict):
        if _dict["area"] is "RECT":
            return RectArea.from_dict(_dict)
        elif _dict["area"] is "CIRCLE":
            return CircleArea.from_dict(_dict)
        else:
            return None

    def has_inside(self, loc):
        pass

    def has_outside(self, loc):
        pass

    def random_location(self):
        pass


class RectArea(Area):
    def __init__(self, loc1, loc2, time=None):
        super().__init__(time)
        self.loc1, self.loc2 = loc1, loc2
        self.lats = sorted([loc1.lat, loc2.lat])
        self.lngs = sorted([loc1.lng, loc2.lng])

    def to_dict(self):
        return {"area": "RECT",
                "loc1": self.loc1.to_dict(),
                "loc2": self.loc2.to_dict(),
                "time": self.time}

    @staticmethod
    def from_dict(_dict):
        if _dict["area"] is "RECT":
            loc1 = Location.from_dict(_dict["loc1"])
            loc2 = Location.from_dict(_dict["loc2"])
            time = _dict["time"]
            return RectArea(loc1, loc2, time)
        return None

    def has_inside(self, loc):
        return \
            (self.lats[0] <= loc.lat <= self.lats[1] and
             self.lngs[0] <= loc.lng <= self.lngs[1])

    def has_outside(self, loc):
        return not (self.has_inside(loc))

    def random_location(self):
        lat = random() * (self.lats[1] - self.lats[0]) + self.lats[0]
        lng = random() * (self.lngs[1] - self.lngs[0]) + self.lngs[0]
        return Location(lat, lng)


class CircleArea(Area):
    def __init__(self, center: Location, radius, time=None):
        super().__init__(time)
        self.center, self.radius = center, radius
        if time is None:
            self.time = round(now(), 2)
        else:
            self.time = time

    def to_dict(self):
        return {"area": "CIRCLE",
                "center": self.center.to_dict(),
                "radius": self.radius,
                "time": self.time}

    @staticmethod
    def from_dict(_dict):
        if _dict["area"] is "CIRCLE":
            center = Location.from_dict(_dict["center"])
            radius = _dict["radius"]
            time = _dict["time"]
            return CircleArea(center, radius, time)
        return None

    def has_inside(self, loc):
        return self.center.distance_to(loc) <= self.radius

    def has_outside(self, loc):
        return not (self.has_inside(loc))

    def random_location(self):
        bearing = random() * 360
        distance = random() * self.radius
        return self.center.offset(bearing, distance)
