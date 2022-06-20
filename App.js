import logo from "./src/assets/img/logo.png";
import { Home, AddProfile, Profile, ImcCalcul, StateInfo } from "./src/page";
import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { dbInit, createTable } from "./src/util/model";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const db=dbInit();
let curentUser=null;
const Tab=createBottomTabNavigator();
const App=() => {
  useEffect(() => {
    createTable(db, "profile", [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "user_name VARCHAR(100)",
      "user_avatar TEXT",
      " user_size INTEGER",
      "user_age INTEGER",
      "user_sexe TEXT",
    ]);
    createTable(db, "imc", [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "user_id INTEGER",
      "user_name VARCHAR(100)",
      "user_poids INTEGER",
      "user_imc INTEGER",
      "imc_date DATE",
    ]);

  }, []);

  const handleProfile=profile => {
    curentUser=profile;
  };
  const Stack=createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {props => <Home {...props} db={db} handleProfile={handleProfile} />}
        </Stack.Screen>

        <Stack.Screen name="Add Profile">
          {props => (
            <AddProfile {...props} db={db} handleProfile={handleProfile} />
          )}
        </Stack.Screen>

        <Stack.Screen name="PROFILE">
          {props => <HomeTabs {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function HomeTabs(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="profile">
        {props => <Profile {...props} db={db} profile={curentUser} />}
      </Tab.Screen>
      <Tab.Screen name="IMC CALCUL">
        {props => <ImcCalcul {...props} db={db} profile={curentUser} />}
      </Tab.Screen>
      <Tab.Screen name="STATE INFO">
        {props => <StateInfo {...props} db={db} profile={curentUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default App;
