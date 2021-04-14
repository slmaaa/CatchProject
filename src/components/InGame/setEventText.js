export default setEventText = () => {
  let s = "";
  if (eventLogPtr >= 4) s += eventLog[eventLogPtr - 4] + "\n";
  if (eventLogPtr >= 3) s += eventLog[eventLogPtr - 3] + "\n";
  if (eventLogPtr >= 2) s += eventLog[eventLogPtr - 2] + "\n";
  if (eventLogPtr >= 1) s += eventLog[eventLogPtr - 1] + "\n";
  s += eventLog[eventLogPtr] + "\n";
  return s;
};
