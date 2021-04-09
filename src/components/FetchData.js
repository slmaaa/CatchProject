import timestampToDate from "./timestampToDate";
import { url } from "./constants";

const readJSON = (settingData, data, lastGet, currentGet, rid) => {
  let temp = data,
    pos = -1,
    cid = null,
    notFound = true;

  for (let i = 0; i < currentGet.role_snapshots.length; ++i) {
    if (
      rid === currentGet.role_snapshots[i].rid &&
      currentGet.role_snapshots[i].is_in
    ) {
      pos = i;
      cid = currentGet.role_snapshots[i].cid;
      break;
    }
  }
  for (let i = 0; i < currentGet.checkpoint_snapshots.length; ++i) {
    temp.cpEnergyLevel[i] = currentGet.checkpoint_snapshots[i].energy;
    if (currentGet.checkpoint_snapshots[i].team == "Red")
      temp.cpEnergyLevel[i] *= -1;
    if (
      lastGet.checkpoint_snapshots[i].team === "None" &&
      currentGet.checkpoint_snapshots[i].team != "None"
    ) {
      temp.eventLog.push(
        timestampToDate(currentGet.time) +
          " Team " +
          currentGet.checkpoint_snapshots[i].team +
          " has captured " +
          currentGet.checkpoint_snapshots[i].name
      );
    }
    if (
      lastGet.checkpoint_snapshots[i].capturing_team !=
        currentGet.checkpoint_snapshots[i].capturing_team &&
      currentGet.checkpoint_snapshots[i].capturing_team != "None"
    ) {
      temp.eventLog.push(
        timestampToDate(currentGet.time) +
          " Team " +
          currentGet.checkpoint_snapshots[i].capturing_team +
          " is capturing " +
          currentGet.checkpoint_snapshots[i].name
      );
    }
    if (notFound && pos != -1) {
      if (currentGet.checkpoint_snapshots[i].cid === cid) {
        notFound = false;
        temp.playerStatus.cp = i;
        if (currentGet.role_snapshots[pos].contributed == 3) {
          temp.playerStatus.status = 2;
        } else if (
          currentGet.checkpoint_snapshots[i].capturing_team == "None"
        ) {
          temp.playerStatus.status = 0;
        } else
          currentGet.checkpoint_snapshots[i].capturing_team ==
          currentGet.role_snapshots[pos].team
            ? (temp.playerStatus.status = 1)
            : (temp.playerStatus.status = -1);
      }
    }
  }
  if (notFound) {
    temp.playerStatus.cp = -1;
    temp.playerStatus.status = 0;
  }
  temp.score[1] = currentGet.team_scores.Blue;
  temp.score[0] = currentGet.team_scores.Red;
  settingData(temp);
};

const FetchData = (settingData, getData, lastJSON, setLastJSON, RID) => {
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((json) => {
      if (lastJSON != null) readJSON(settingData, getData, lastJSON, json, RID);
      setLastJSON(json);
    })
    .catch((error) => {
      console.error(error);
    });
};
export default FetchData;
