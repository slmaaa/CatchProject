import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

import { joinGame } from "./Helper/server";

export const join = async (gameID, userID, userName) => {
  const player = {
    pid: userID,
    name: userName,
    avatar: "None",
  };
  const success = await joinGame(gameID, player);
  return success;
};
