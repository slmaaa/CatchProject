import { getDistance } from "geolib";
import post from "../DataExchange/post";
export default updateCPFlag = (
  location,
  currentCID,
  CP_LOCATION,
  CP_RANGE,
  NUM_OF_CP,
  RID
) => {
  let flag = false,
    newCID = -1;
  if (location != null) {
    for (let i = 0; i < NUM_OF_CP; i++) {
      if (getDistance(location, CP_LOCATION[i]) <= CP_RANGE) {
        if (currentCID == -1) {
          const postData = {
            rid: RID,
            CID: i,
            time: new Date().getTime,
            is_in: true,
          };
          post(postData);
        }
        newCID = i;
        flag = true;
        break;
      }
    }
    if (!flag) {
      if (currentCID != -1) {
        const postData = {
          rid: RID,
          CID: currentCID,
          time: new Date().getTime,
          is_in: false,
        };
        post(postData);
      }
      newCID = -1;
    }
  }
  return newCID;
};
