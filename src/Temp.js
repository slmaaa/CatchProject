import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';

var { height, width } = Dimensions.get('window');

export default class Temp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        { id: 1, name: "You", color: "#FF4500", avatar: "https://img.icons8.com/color/70/000000/name.png" },
        { id: 2, name: "Home", color: "#87CEEB", avatar: "https://img.icons8.com/office/70/000000/home-page.png" },
        { id: 3, name: "Love", color: "#4682B4", avatar: "https://img.icons8.com/color/70/000000/two-hearts.png" },
        { id: 4, name: "Family", color: "#6A5ACD", avatar: "https://img.icons8.com/color/70/000000/family.png" },
        { id: 5, name: "Friends", color: "#FF69B4", avatar: "https://img.icons8.com/color/70/000000/groups.png" },
        { id: 6, name: "School", color: "#00BFFF", avatar: "https://img.icons8.com/color/70/000000/classroom.png" },
        { id: 7, name: "Things", color: "#00FFFF", avatar: "https://img.icons8.com/dusk/70/000000/checklist.png" },
        { id: 8, name: "World", color: "#20B2AA", avatar: "https://img.icons8.com/dusk/70/000000/globe-earth.png" },
        { id: 9, name: "Remember", color: "#191970", avatar: "https://img.icons8.com/color/70/000000/to-do.png" },
        { id: 10, name: "Game", color: "#008080", avatar: "https://img.icons8.com/color/70/000000/basketball.png" },
      ]
    };
  }

  clickEventListener(item) {
    Alert.alert(item.name)
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={this.state.data}
          horizontal={false}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={[styles.card, { backgroundColor: item.color }]} onPress={() => { this.clickEventListener(item) }}>
                <Image style={styles.cardavatar} source={{ uri: item.avatar }} />
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )
          }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: "#E6E6E6",
  },

  /******** card **************/
  card: {
    width: width,
    height: 150,
    flexDirection: 'row',
    padding: 20,

    justifyContent: 'center',
    alignItems: 'center'
  },
  cardavatar: {
    height: 70,
    width: 70,
  },
  name: {
    fontSize: 28,
    flex: 1,
    color: "#FFFFFF",
    fontWeight: 'bold',
    marginLeft: 40
  },
  subTitle: {
    fontSize: 12,
    flex: 1,
    color: "#FFFFFF",
  },
  icon: {
    height: 20,
    width: 20,
  }
});
