import { URL } from "../../constants.json";

const postData = async (url, data) => {
  fetch(url, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

export const postGame = async (data) => {
  return await postData(URL + "/creategame", data);
};
