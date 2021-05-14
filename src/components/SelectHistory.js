import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";
import { render } from "react-dom";
const MMKV = new MMKVStorage.Loader().initialize();

export default SelectHistory = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);

  const list = useRef();
  const renderedList = useRef([]);
  useEffect(() => {
    database()
      .ref(`users/${MMKV.getString("userID")}/gameRecord`)
      .once("value")
      .then((snapshot) => {
        list.current=snapshot.val();
      }).then(()=>{
        for (const game in list.current)
        {console.log(list.current[game].gameID);
          renderedList.current.push(
            
            <ListItem
            key={game}
            bottomDivider
            onPress={() => {
              MMKV.setMap("selectedHistory", list.current[game]);
              navigation.navigate("history");
            }}
          >
            <ListItem.Content>
              <ListItem.Title style={{ color: "brown", fontWeight: 'bold', fontSize:14 }}>{list.current[game].game.gid}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          )
        }
        setInitializing(false);})
     
  }, []);
  if (initializing) return null;
  return(<SafeAreaView style = {styles.container}>
    {renderedList.current}
  </SafeAreaView>)
};
const styles = StyleSheet.create(
  {
    container:{
      flex:1,
    }
  }
)
