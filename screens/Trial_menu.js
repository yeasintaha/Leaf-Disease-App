import * as ImagePicker from "expo-image-picker";
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
  Button,
  BackHandler,
  ImageBackground,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-root-toast";
import { auth, db_firestore } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { uploadBytes, getStorage, ref, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const Trial_menu = ({ navigation }) => {
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
      const storageRef = ref(storage, "Images/leaf_image.png");
      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();
      uploadBytes(storageRef, bytes).then((snapshot) => {});
    }
  };

  // Retrieve image from firebase storage
  //   const getImage = async () => {
  //     const storage = getStorage();
  //     const storageRef = ref(storage, "Images/leaf_image.png");
  //     await getDownloadURL(storageRef).then((x) => {
  //       setImage(x);
  //       alert("success image");
  //     });
  //   };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 128, height: 128 }} />
      )}
      {/* <Button title="Get Image" onPress={getImage} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Trial_menu;
