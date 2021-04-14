const timestampToDate = (timestamp) => {
  let d = new Date(timestamp);
  let hours = d.getHours(),
    minutes = d.getMinutes(),
    seconds = d.getSeconds();

  function pad(d) {
    return (d < 10 ? "0" : "") + d;
  }

  let formattedDate = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  return formattedDate;
};
export default timestampToDate;
