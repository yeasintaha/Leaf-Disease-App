import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Linking,
  Alert,
  BackHandler,
  ImageBackground,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
// import {ImagePicker} from "react-native-image-picker";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-root-toast";
import { auth, db_firestore, storage } from "../firebase";
import { uploadBytes, getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

const { width: WIDTH } = Dimensions.get("screen").width;

const Menu = ({ navigation }) => {
  const { userCredentials, setUserCredentials, setEmailProvider } =
    useContext(UserContext);
  const [showOptions, setShowOptions] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setShowOptions(false);
    BackHandler.addEventListener("hardwareBackPress", () => true);

    // const locationDoc = doc(db_firestore, "Get_Location", "Realtime");
    // getDoc(locationDoc)
    //   .then((snapshot) => {
    //     setLocationDevice(
    //       snapshot.data().Longitude + "," + snapshot.data().Latitude
    //     );
    //   })
    //   .catch((error) => {
    //     alert(error.message);
    //   });

    return () => {
      BackHandler.addEventListener("hardwareBackPress", () => true);
    };
  }, []);

  const refreshDevice = () => {
    setRefresh(true);
  };

  const handleSignOut = () => {
    setShowOptions(false);
    signOut(auth)
      .then((re) => {
        Toast.show("Signed Out Successfully!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          containerStyle: {
            backgroundColor: "green",
            borderRadius: 25,
            padding: 10,
          },
        });
        setUserCredentials({
          Username: null,
          Email: null,
          Password: null,
          Phone: null,
          Location: null,
        });
        setEmailProvider("");
        navigation.replace("Login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const [image, setImage] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    setImage(result.assets[0].uri);

    if (!result.canceled) {
      // alert(result.assets[0].uri);
      const storage = getStorage();
      const storageRef = ref(
        storage,
        "Images/leaf_image" + `${userCredentials.Username}.png`
      );
      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();
      uploadBytes(storageRef, bytes).then((snapshot) => {});
    }
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const storage = getStorage();
      const storageRef = ref(
        storage,
        "Images/leaf_image" + `${userCredentials.Username}.png`
      );
      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();
      uploadBytes(storageRef, bytes).then((snapshot) => {});
    }
  };

  //  Retrieve image from firebase storage
  //   const getImage = async () => {
  //     const storage = getStorage();
  //     const storageRef = ref(storage, "Images/leaf_image.png");
  //     await getDownloadURL(storageRef).then((x) => {
  //       setImage(x);
  //       alert("success image");
  //     });
  //   };

  // useEffect(() => {
  //   alert(
  //     userCredentials.Username +
  //       " " +
  //       userCredentials.Email +
  //       " " +
  //       userCredentials.Location +
  //       " " +
  //       userCredentials.Phone +
  //       " " +
  //       userCredentials.Password
  //   );
  // }, []);

  return (
    <SafeAreaView style={styles.menuContainer}>
      <SafeAreaView style={styles.headerMenu}>
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
          <View
            style={{
              flexDirection: "row",
              height: 40,
              width: 40,
              marginBottom: 0,
              paddingBottom: 0,
            }}
          >
            <FontAwesome
              name={"user-circle"}
              size={25}
              color={"rgba(0, 0, 0, 0.9)"}
              style={styles.userIcon}
            />
            <FontAwesome5
              name={"chevron-right"}
              size={18}
              color={"rgba(0, 0, 0, 0.9)"}
              style={[
                styles.userIcon,
                showOptions
                  ? { transform: [{ rotate: "90deg" }], paddingLeft: 6 }
                  : null,
              ]}
            />
          </View>
          <Text style={styles.headerText}> {userCredentials.Username}</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View
        style={{
          position: "absolute",
          backgroundColor: "lightgreen",
          top: 95,
          right: 10,
          zIndex: 1,
          justifyContent: "center",
        }}
      >
        {showOptions ? (
          <View
            style={{
              borderRadius: 7,
              borderWidth: 2,
              borderColor: "white",
              padding: 8,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                padding: 5,
                borderBottomWidth: 2,
                borderBottomColor: "white",
              }}
              onPress={() => {
                navigation.push("Profile");
                setShowOptions(false);
              }}
            >
              <FontAwesome5
                name={"user-edit"}
                size={20}
                color={"rgba(0, 0, 0, 0.7)"}
                style={{ padding: 2 }}
              />
              <Text
                style={{
                  paddingTop: 2,
                  paddingLeft: 5,
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", padding: 5 }}
              onPress={handleSignOut}
            >
              <Icon
                name={"log-out"}
                size={20}
                color={"rgba(0, 0, 0, 0.7)"}
                style={{ padding: 2 }}
              />
              <Text
                style={{
                  paddingTop: 2,
                  paddingLeft: 5,
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <View style={styles.container}>
        {image && (
          <SafeAreaView style={{ margin: 10 }}>
            <Image
              source={{ uri: image }}
              style={{ width: 256, height: 256 }}
            />
          </SafeAreaView>
        )}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[
              {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "#008200",
                borderRadius: 5,
                borderWidth: 1,
                marginBottom: 10,
              },
            ]}
            onPress={pickImage}
          >
            <View style={{ flexDirection: "row" }}>
              <FontAwesome5
                name={"leaf"}
                size={22}
                color={"green"}
                style={{
                  padding: 10,
                  paddingLeft: 12,
                  paddingRight: 5,
                  fontSize: 15,
                }}
              />
              <Text
                style={{
                  color: "#008200",
                  fontSize: 12,
                  fontWeight: "bold",
                  padding: 10,
                  paddingLeft: 0,
                }}
              >
                {" "}
                Take Photo
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "#008200",
                borderRadius: 5,
                borderWidth: 1,
                marginBottom: 10,
              },
            ]}
            onPress={handleChoosePhoto}
          >
            <View style={{ flexDirection: "row" }}>
              <FontAwesome5
                name={"upload"}
                size={22}
                color={"green"}
                style={{
                  padding: 10,
                  paddingLeft: 12,
                  paddingRight: 5,
                  fontSize: 15,
                }}
              />
              <Text
                style={{
                  color: "#008200",
                  fontSize: 12,
                  fontWeight: "bold",
                  padding: 10,
                  paddingLeft: 0,
                }}
              >
                {" "}
                Upload
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  btnImagePicker: {
    backgrondColor: "green",
    color: "white",
  },

  menuContainer: {
    width: "100%",
    height: "100%",
  },

  container: {
    // backgroundColor: "rgba(61, 227, 61, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 120,
  },
  headerMenu: {
    flex: 1,
    position: "absolute",
    marginTop: 40,
    right: 0,
    top: 14,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingRight: 5,
    marginRight: 5,
    zIndex: 1,
  },
  headerText: {
    color: "rgba(0, 0, 0, 0.9)",
    opacity: 0.7,
    fontSize: 11,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    margin: 0,
    textTransform: "capitalize",
    paddingTop: 0,
  },
  userIcon: {
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    marginTop: 2,
    marginRight: 3,
    paddingLeft: 2,
    alignSelf: "center",
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  checkNotification: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginTop: 100,
    padding: 10,
    margin: 10,
    backgroundColor: "rgba(254, 254, 254, 0.5)",
    border: "2px solid white",
    borderRadius: 10,
    // boxShadow: '5px 10px gray',
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
  },

  notificationText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    opacity: 0.5,
    padding: 10,
  },
  trackLocation: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(254, 254, 254, 0.5)",
    border: "2px solid white",
    borderRadius: 10,
    margin: 10,
    // boxShadow: '5px 10px gray',
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
});
