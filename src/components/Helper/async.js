import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeData(path, value) {
  try {
    await AsyncStorage.setItem(path, value);
  } catch (e) {
    console.log("error " + e);
  }
}
export async function getData(path, setFunc) {
  try {
    const value = await AsyncStorage.getItem(path);
    if (value !== null) {
      // value previously stored
      console.log(value);
      setFunc(value);
    }
  } catch (e) {
    console.log("error " + e);
  }
}
