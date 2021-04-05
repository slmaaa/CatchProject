from time import time as now

from geographiclib.geodesic import Geodesic  # Lifesaver


class Location:
    # Geodesic calculations
    geod = Geodesic.WGS84

    def __init__(self, lat, lng, time=None):
        self.lat, self.lng = lat, lng
        self.time = time or round(now(), 2)

    def to_dict(self):
        return {"lat": self.lat,
                "lng": self.lng,
                "time": self.time}

    @staticmethod
    def from_dict(_dict):
        lat, lng = _dict["lat"], _dict["lng"]
        time = _dict["time"]
        return Location(lat, lng, time)

    @staticmethod
    def distance_between(loc1, loc2):
        return Location.geod.Inverse(loc1.lat, loc1.lng, loc2.lat, loc2.lng)["s12"]

    def distance_to(self, loc2):
        return self.distance_between(self, loc2)

    @staticmethod
    def bearing_between(loc1, loc2):
        return Location.geod.Inverse(loc1.lat, loc1.lng, loc2.lat, loc2.lng)["azi1"]

    def bearing_to(self, loc2):
        return self.bearing_between(self, loc2)

    @staticmethod
    def coords_offset(loc, bearing, distance, time=None):
        res = Location.geod.Direct(loc.lat, loc.lng, bearing, distance)
        return Location(res["lat2"], res["lon2"], time)

    def offset(self, bearing, distance):
        return self.coords_offset(self, bearing, distance, self.time)
