export default renderCaptureBar = () => {
  const BLUE = () => (
    <Progress.Bar
      color="#A9BCF5"
      trackColor="#2E64FE"
      indeterminate
      style={styles.scoreBar}
    />
  );
  const RED = () => (
    <Progress.Bar
      color="red"
      trackColor="#F6CECE"
      indeterminate
      style={styles.scoreBar}
    />
  );
  if (getData.playerStatus.status == 0) {
    return <Progress.Bar trackColor="grey" style={styles.scoreBar} />;
  } else if (getData.playerStatus.status == -1) {
    return TEAM === "Red" ? BLUE() : RED();
  } else if (getData.playerStatus.status == 1) {
    return TEAM == "Red" ? RED() : BLUE();
  } else if (getData.playerStatus.status == 2)
    return TEAM === "Red" ? (
      <Progress.Bar trackColor="red" style={styles.scoreBar} />
    ) : (
      <Progress.Bar trackColor="#A9BCF5" style={styles.scoreBar} />
    );
};
