import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db_firestore } from "../firebase";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-root-toast";
import { UserContext } from "../UserContext";

const WIDTH = Dimensions.get("window").width;

const Profile = ({ navigation }) => {
  const { userCredentials, setUserCredentials } = useContext(UserContext);
  const [location, setLocation] = useState(userCredentials.Location);
  const [phone, setPhone] = useState(userCredentials.Phone);
  const [locationRedBox, setLocationRedBox] = useState(false);
  const [phoneRedBox, setPhoneRedBox] = useState(false);

  const handleProfileUpdate = () => {
    let flag = 0;
    setLocationRedBox(false);
    setPhoneRedBox(false);
    if (location == "" || location == null) {
      flag = 1;
      setLocationRedBox(true);
    }
    if (location?.length < 3) {
      flag = 1;
      setLocationRedBox(true);
      alert("Give Location Properly");
    }
    if (phone == "" || phone == null) {
      setPhoneRedBox(true);
    }
    if (
      (!phone.includes("01", 0) ||
        phone?.length != 11 ||
        !/^\d+$/.test(phone)) &&
      flag != 1
    ) {
      flag = 1;
      Toast.show("Invalid Phone Number!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        containerStyle: {
          backgroundColor: "red",
          borderRadius: 25,
          padding: 10,
        },
      });
      setPhoneRedBox(true);
    }

    if (flag == 0) {
      let userDoc = doc(
        db_firestore,
        "User_Data",
        userCredentials.Username.trim()
      );

      const userData = {
        Username: userCredentials.Username.trim(),
        Email: userCredentials.Email.trim(),
        Password: userCredentials.Password,
        Phone: phone.trim(),
        Location: location.trim(),
      };

      setUserCredentials(userData);
      setDoc(userDoc, userData, { merge: true })
        .then(() => {
          Toast.show("Updated Successfully!", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            containerStyle: {
              backgroundColor: "green",
              borderRadius: 25,
              padding: 10,
            },
          });
          // alert("Updated Successfully!!!");
          navigation.navigate("Menu");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <SafeAreaView style={styles.profileContainer}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
      >
        <TouchableOpacity
          style={{
            flex: 0,
            flexDirection: "row",
            padding: 5,
            marginLeft: 10,
            marginTop: 30,
            justifyContent: "flex-start",
            zIndex: 1,
          }}
          onPress={() => navigation.navigate("Menu")}
        >
          <Icon
            name={"chevron-back-sharp"}
            size={40}
            color={"rgba(0, 0, 255, 0.7)"}
          />
        </TouchableOpacity>
        <View style={styles.profileHeader}>
          <FontAwesome
            name={"user-circle"}
            size={40}
            color={"rgba(0, 0, 255, 0.7)"}
            style={styles.profileIcon}
          />
          <Text style={styles.headerText}> {userCredentials.Username} </Text>
        </View>
        <View style={styles.componentView}>
          <Text style={styles.componentViewHeader}>Email :</Text>
          <Text style={styles.componentViewText}>{userCredentials.Email}</Text>
        </View>
        <KeyboardAvoidingView style={styles.componentView}>
          <Text style={styles.componentViewHeader}>Phone No. :</Text>
          <TextInput
            placeholder={"Phone No."}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            style={[
              styles.input,
              phoneRedBox ? styles.btnBoxRed : styles.input,
            ]}
            underlineColorAndroid="transparent"
            value={phone}
            onChangeText={(text) => setPhone(text)}
          ></TextInput>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView style={styles.componentView}>
          <Text style={styles.componentViewHeader}>Location :</Text>
          <TextInput
            placeholder={"Location"}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            style={[
              styles.input,
              locationRedBox ? styles.btnBoxRed : styles.input,
            ]}
            underlineColorAndroid="transparent"
            value={location}
            onChangeText={(text) => setLocation(text)}
          ></TextInput>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.btnUpdate}
          onPress={handleProfileUpdate}
        >
          <Text style={styles.btnText}> Update </Text>
        </TouchableOpacity>
        <View style={{ width: "100%", height: 180 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "lightblue",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  profileHeader: {
    flex: 0.8,
    margin: 10,
    marginTop: 0,
    padding: 10,
    paddingTop: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    maxHeight: 150,
    // backgroundColor:"gray",
  },
  profileIcon: {
    padding: 5,
    margin: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "rgba(0, 0, 255, 0.7)",
    textTransform: "capitalize",
  },
  componentView: {
    flex: 1,
    padding: 5,
    marginHorizontal: 20,
    width: "95%",
    maxHeight: 100,
    // backgroundColor:"blue"
  },
  componentViewHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "blue",
    opacity: 0.8,
    textTransform: "capitalize",
    paddingHorizontal: 15,
  },
  componentViewText: {
    height: 40,
    borderRadius: 10,
    fontSize: 13,
    padding: 5,
    paddingLeft: 20,
    paddingTop: 10,
    backgroundColor: "rgba(30, 144, 255, 0.2)",
    textAlignVertical: "center",
    color: "rgba(0, 0, 0, 0.7)",
    opacity: 0.5,
    borderColor: "gray",
    marginLeft: 10,
    marginRight: 10,
    margin: 10,
    fontWeight: "500",
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    textAlignVertical: "center",
  },
  input: {
    height: 45,
    borderRadius: 10,
    fontSize: 13,
    padding: 5,
    paddingLeft: 20,
    backgroundColor: "rgba(30, 144, 255, 0.2)",
    textAlignVertical: "center",
    color: "black",
    borderColor: "gray",
    margin: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: "500",
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  btnBoxRed: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  btnUpdate: {
    width: WIDTH - 50,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "dodgerblue",
    marginLeft: 35,
    marginRight: 25,
    marginTop: 30,
    padding: 10,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },

  btnText: {
    color: "white",
    opacity: 1,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Profile;
