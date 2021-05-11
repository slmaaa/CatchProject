from random import random

from location import Location


class Area:
    def __init__(self):
        pass

    def to_dict(self):
        return {"area": "AREA"}

    @staticmethod
    def from_dict(_dict):
        if _dict["area"] == "RECT":
            return RectArea.from_dict(_dict)
        elif _dict["area"] == "CIRCLE":
            return CircleArea.from_dict(_dict)
        elif _dict["area"] == "AREA":
            return Area()
        else:
            return None

    def has_inside(self, loc: Location):
        return False

    def has_outside(self, loc: Location):
        return True

    def random_location(self):
        pass


class RectArea(Area):
    def __init__(self, loc1: Location, loc2: Location):
        self.loc1, self.loc2 = loc1, loc2
        self.lats = sorted([loc1.lat, loc2.lat])
        self.lngs = sorted([loc1.lng, loc2.lng])

    def to_dict(self):
        return {"area": "RECT",
                "loc1": self.loc1.to_dict(),
                "loc2": self.loc2.to_dict()}

    @staticmethod
    def from_dict(_dict):
        if _dict["area"] == "RECT":
            loc1 = Location.from_dict(_dict["loc1"])
            loc2 = Location.from_dict(_dict["loc2"])
            return RectArea(loc1, loc2)
        return None

    def has_inside(self, loc: Location):
        return \
            (self.lats[0] <= loc.lat <= self.lats[1] and
             self.lngs[0] <= loc.lng <= self.lngs[1])

    def has_outside(self, loc: Location):
        return not (self.has_inside(loc))

    def random_location(self):
        lat = random() * (self.lats[1] - self.lats[0]) + self.lats[0]
        lng = random() * (self.lngs[1] - self.lngs[0]) + self.lngs[0]
        return Location(lat, lng)


class CircleArea(Area):
    def __init__(self, center: Location, radius):
        self.center, self.radius = center, radius

    def to_dict(self):
        return {"area": "CIRCLE",
                "center": self.center.to_dict(),
                "radius": self.radius}

    @staticmethod
    def from_dict(_dict):
        if _dict["area"] == "CIRCLE":
            center = Location.from_dict(_dict["center"])
            radius = _dict["radius"]
            return CircleArea(center, radius)
        return None

    def has_inside(self, loc: Location):
        return self.center.distance_to(loc) <= self.radius

    def has_outside(self, loc: Location):
        return not (self.has_inside(loc))

    def random_location(self):
        bearing = random() * 360
        distance = random() * self.radius
        return self.center.offset(bearing, distance)
