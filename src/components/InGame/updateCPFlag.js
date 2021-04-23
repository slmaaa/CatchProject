import { getDistance } from "geolib";
import post from "../DataExchange/post";
export default updateCPFlag = (location, CP_LOCATION, CP_RANGE, NUM_OF_CP) => {
  let flag = false,
    newCID = -1;
  if (location != null) {
    for (let i = 0; i < NUM_OF_CP; i++) {
      if (getDistance(location, CP_LOCATION[i]) <= CP_RANGE) {
        newCID = i;
        flag = true;
        break;
      }
    }
    if (!flag) {
      newCID = -1;
    }
  }
  return newCID;
};
