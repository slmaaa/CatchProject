from time import time as now

from geographiclib.geodesic import Geodesic  # Lifesaver


class Location:
    # Geodesic calculations
    geod = Geodesic.WGS84

    def __init__(self, lat, lng):
        self.lat, self.lng = lat, lng

    def to_dict(self):
        return {"lat": self.lat,
                "lng": self.lng}

    @staticmethod
    def from_dict(_dict):
        lat, lng = _dict["lat"], _dict["lng"]
        return Location(lat, lng)

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
    def coords_offset(loc, bearing, distance):
        res = Location.geod.Direct(loc.lat, loc.lng, bearing, distance)
        return Location(res["lat2"], res["lon2"])

    def offset(self, bearing, distance):
        return self.coords_offset(self, bearing, distance)
