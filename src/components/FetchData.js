import timestampToDate from "./timestampToDate";

const readJSON = (settingData, data, lastGet, currentGet, rid) => {
  let temp = data,
    notFound = true;
  for (let i = 0; i < currentGet.checkpoint_snapshots.length; ++i) {
    temp.cpEnergyLevel[i] = currentGet.checkpoint_snapshots[i].energy;
    if (currentGet.checkpoint_snapshots[i].team == "Red")
      temp.cpEnergyLevel[i] *= -1;
    console.log(
      lastGet.checkpoint_snapshots[i].team === "None" &&
        currentGet.checkpoint_snapshots[i].team != "None"
    );
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
          currentGet.checkpoint_snapshots[i].team +
          " is capturing " +
          currentGet.checkpoint_snapshots[i].name
      );
    }
    if (notFound) {
      pos = currentGet.checkpoint_snapshots[i].role_snapshots
        .map(function (e) {
          return e.rid;
        })
        .indexOf(rid);
      if (pos != -1) {
        notFound = false;
        temp.playerStatus.cp = i;
        if (
          currentGet.checkpoint_snapshots[i].role_snapshots[pos].contributed ==
          3
        ) {
          temp.playerStatus.status = 2;
        } else if (
          currentGet.checkpoint_snapshots[i].capturing_team == "None"
        ) {
          temp.playerStatus.status = 0;
        } else
          currentGet.checkpoint_snapshots[i].capturing_team ==
          currentGet.checkpoint_snapshots[i].role_snapshots[pos].team
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
  fetch("http://localhost:3001/users")
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
