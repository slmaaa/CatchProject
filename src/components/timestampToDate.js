const timestampToDate = (timestamp) => {
  let d = new Date(timestamp);
  let hours = d.getHours(),
    minutes = d.getMinutes(),
    seconds = d.getSeconds(),
    month = d.getMonth() + 1,
    day = d.getDate(),
    year = d.getFullYear() % 100;

  function pad(d) {
    return (d < 10 ? "0" : "") + d;
  }

  let formattedDate =
    pad(hours) +
    ":" +
    pad(minutes) +
    ":" +
    pad(seconds) +
    " " +
    pad(month) +
    "-" +
    pad(day) +
    "-" +
    pad(year);
  return formattedDate;
};
export default timestampToDate;
