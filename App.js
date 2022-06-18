import logo from './src/assets/img/logo.png';
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { openDatabase } from "react-native-sqlite-storage";

const db=openDatabase({
  name: "rn_sqlite",

  location: "default",
  createFromLocation: "./www/rn_sqlite.db"

});
const App=() => {

  useEffect(() => {
    createTable();
  }
    , []);

  const createTable=() => {

    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(100), user_avatar TEXT, user_size INTEGER , user_age INTEGER , user_sexe TEXT)",
        [],
        () => console.log("Table created"),
        (error) => console.log(error)
      );

      tx.executeSql(
        "INSERT INTO user (user_name, user_avatar, user_size, user_age, user_sexe) VALUES (?,?,?,?,?)",
        ["John", "https://randomuser.me/api/portraits/", 184, 25, "Homme"],
      )

      tx.executeSql(
        "SELECT * FROM user",
        [],
        (tx, results) => {
          console.log("Query success");
          console.log(results.rows.item(0));
        }
        , (error) => console.log(error)
      );

    });
  }

  return (
    <View>
      <Text>Hello World</Text>
      <Image source={logo} />
      <Icon name="user" size={30} color="red" />
    </View>
  );
}



export default App;
