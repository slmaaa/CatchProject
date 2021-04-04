import { eventLog } from "../data_from_server.json";
import timestampToDate from "./timestampToDate";

const timeDiffernece = (timestamp) => {
  let d = new Date(timestamp);
  let minutes = d.getMinutes();
  let currnetMinutes = new Date().getMinutes();
  let diff = minutes - currnetMinutes;
  return diff == 0 ? "Just now" : diff + "m";
};

function printEventLog(i = 0, time = false) {
  let s = "";
  if (time) s += timeDiffernece(eventLog[i].timestamp) + ": ";
  eventLog[i].team == 0 ? (s += "Blue team") : (s += "Red team");
  if (eventLog[i].event == 0) s += " is invading";
  else if (eventLog[i].event == 1) s += " is capturing";
  else s += " has captured";
  s += " CP";
  s += eventLog[i].cp;
  return s;
}

export default printEventLog;
