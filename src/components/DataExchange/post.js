import { url } from "../../constants";
const post = (postData) => {
  fetch(url, {
    method: "POST", // or 'PUT'
    body: JSON.stringify(postData), // data can be `string` or {object}!
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
};
export default post;
