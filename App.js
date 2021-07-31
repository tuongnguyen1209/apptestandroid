import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet } from "react-native";
import HomeScreen from "./components/HomeScreen";
import ScanScreen from "./components/ScanScreen";
import SettingsScreen from "./components/SettingsScreen";

const Tab = createBottomTabNavigator();
const style = StyleSheet.create({
  tabContainer: {
    paddingBottom: 20,
    height: "100vh",
  },
});

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator style={style.tabContainer}>
        <Tab.Screen name="Trang chủ" component={HomeScreen} />
        <Tab.Screen name="Khách hàng" component={SettingsScreen} />
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Tính Toán" component={SettingsScreen} />
        <Tab.Screen name="Cài đặt" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
