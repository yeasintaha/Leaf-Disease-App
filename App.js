import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import { UserContext } from "./UserContext";
import { useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import Register from "./screens/Register";
import Menu from "./screens/Menu";
import Trial_menu from "./screens/Trial_menu";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  const [userCredentials, setUserCredentials] = useState({
    Username: null,
    Email: null,
    Password: null,
    Phone: null,
    Location: null,
  });

  // const [isSignedIn, setIsSignedIn] = useState(false);

  const [emailProvider, setEmailProvider] = useState("");

  return (
    <UserContext.Provider
      value={{
        userCredentials,
        setUserCredentials,
        emailProvider,
        setEmailProvider,
      }}
    >
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* <Stack.Screen name="TrialMenu" component={Trial_menu} /> */}

            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Profile" component={Profile} />

          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    </UserContext.Provider>
  );
};

export default MyStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
