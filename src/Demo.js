import { SafeAreaView, Pressable, Text } from "react-native";
import * as React from "react";
import * as demo1 from "./demo1.json";
import * as demo2 from "./demo2.json";
import * as demo3 from "./demo3.json";
import * as demo4 from "./demo4.json";
import { url } from "./components/constants";
const postData = (data) => {
  fetch(url + "/posts", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Method": "POST",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
const Demo = () => {
  return (
    <SafeAreaView>
      <Pressable onPressIn={() => {}}>
        <Text>Set location</Text>
      </Pressable>
    </SafeAreaView>
  );
};
export default Demo;
