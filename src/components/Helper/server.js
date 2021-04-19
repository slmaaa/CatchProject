import { URL } from "../../constants.json";

const postData = async (url, data) => {
  const response = await fetch(url, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const postGame = async (data) => {
  const response = await postData(URL + "creategame", data);
  const gameID = await response.text();
  return gameID;
};

export const deleteGame = async (gameID) => {
  const response = await fetch(URL + "game/" + gameID, {
    method: "DELETE",
  });
  if (!response.ok) {
    console.error("Fail to delete game ", gameID);
  } else {
    console.log("Game ", gameID, " deleted");
  }
};

export const joinGame = async (gameID, player) => {
  const response = await postData(URL + "game/" + gameID + "/join", player);
  if (!response) return null;
  const gameName = await response.text();
  return gameName;
};

export const getGame = async (gameID) => {
  const response = await fetch(URL + "/game/" + gameID);
  if (!response) return null;
  const game = await response.json();
  return game;
};
