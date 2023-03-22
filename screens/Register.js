import React, { useState, useEffect, useRef, useContext } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Dimensions,
  Animated,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import { db_firestore, auth } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-root-toast";
import { UserContext } from "../UserContext";

const { width: WIDTH } = Dimensions.get("window").width;
const platformWeb = Platform.OS === "web";
const platformIos = Platform.OS === "ios";

const Register = ({ navigation }) => {
  // const { userCredentials, setUserCredentials } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  // const [device, setDevice] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const [emailRedBox, setEmailRedBox] = useState(false);
  const [usernameRedBox, setUsernameRedBox] = useState(false);
  // const [deviceRedBox, setDeviceRedBox] = useState(false);
  const [passwordRedBox, setPasswordRedBox] = useState(false);
  const [confirmPasswordRedBox, setConfirmPasswordRedBox] = useState(false);
  const [phoneRedBox, setPhoneRedBox] = useState(false);
  const [locationRedBox, setLocationRedBox] = useState(false);

  //   const [deviceIdFirestore, setDeviceIdFirestore] = useState(null);

  const handleRegister = async () => {
    setUsernameRedBox(false);
    setEmailRedBox(false);
    // setDeviceRedBox(false);
    setPasswordRedBox(false);
    setConfirmPasswordRedBox(false);
    setPhoneRedBox(false);
    setLocationRedBox(false);

    let flag = 0;
    if (username === "" || username == null) {
      flag = 1;
      setUsernameRedBox(true);
    }
    if (email === "" || email == null) {
      flag = 1;
      setEmailRedBox(true);
    }

    if (password === "" || password == null) {
      flag = 1;
      setPasswordRedBox(true);
    }
    if (confirmPassword === "" || confirmPassword == null) {
      flag = 1;
      setConfirmPasswordRedBox(true);
    }
    if (phone === "" || phone == null) {
      flag = 1;
      setPhoneRedBox(true);
    }
    if (location === "" || location == null) {
      flag = 1;
      setLocationRedBox(true);
    }
    if (username != "" && email != "") {
      const userData = collection(db_firestore, "User_Data");
      const userDataSnapshot = await getDocs(userData);
      const userDataList = userDataSnapshot.docs.map((doc) => doc.data());

      let isUsernameTaken = false;
      let isEmailTaken = false;
      userDataList.map((item) => {
        if (item.Username.toLowerCase() == username.toLowerCase().trim()) {
          isUsernameTaken = true;
        }
        if (item.Email.toLowerCase() == email.toLowerCase().trim()) {
          isEmailTaken = true;
        }
      });
      if (isUsernameTaken) {
        setTimeout(() => {
          Toast.show("Username already taken. Try Another!", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            containerStyle: {
              backgroundColor: "red",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "white",
              padding: 10,
            },
          });
        }, 500);
        setUsernameRedBox(true);
      }
      if (isEmailTaken) {
        Toast.show("Email Already Exists!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          containerStyle: {
            backgroundColor: "red",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "white",
            padding: 10,
          },
        });
        // alert("Email ID already exists.");
        setEmailRedBox(true);
      }
    }

    if (password != confirmPassword && password?.length > 0) {
      (flag = 2), // password and confirm password didn't match
        Toast.show("Confirm password didn't match with given password!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          containerStyle: {
            backgroundColor: "red",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "white",
            padding: 10,
          },
        });
      setConfirmPasswordRedBox(true);
      setPasswordRedBox(true);
    }

    if (
      flag == 1 &&
      email != "" &&
      (!email.includes("@", 2) || !email.includes(".", 5))
    ) {
      flag = 6;
      // Alert.alert("Invalid Email ID", [
      //     {text: 'Ok'}
      // ]);
      Toast.show("Invalid Email ID!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        containerStyle: {
          backgroundColor: "dodgerblue",
          borderRadius: 20,
          padding: 10,
        },
      });
      setEmailRedBox(true);
    }
    if (
      phone != "" &&
      (!phone.includes("01", 0) || phone?.length != 11 || !/^\d+$/.test(phone))
    ) {
      flag = 4; // phone no. invalid
      Toast.show("Invalid Phone Number !", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        containerStyle: {
          backgroundColor: "red",
          borderRadius: 20,
          padding: 10,
        },
      });
      setPhoneRedBox(true);
    }
    if (password.length < 6 && password != "") {
      flag = 5;
      Toast.show("Password Must Contain At Least 6 Characters!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        containerStyle: {
          backgroundColor: "red",
          borderRadius: 20,
          padding: 10,
        },
      });
      setPasswordRedBox(true);
    }
    if (username.length > 9) {
      Toast.show("Username Is Too Long", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        containerStyle: {
          backgroundColor: "red",
          borderRadius: 20,
          padding: 10,
        },
      });
      setUsernameRedBox(true);
    }
    if (location.length < 3 && location != "") {
      flag = 8;
      Toast.show("Please Give Your Location Properly!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        containerStyle: {
          backgroundColor: "red",
          borderRadius: 20,
          padding: 10,
        },
      });
      setLocationRedBox(true);
    }

    if (flag == 0) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((re) => {
          navigation.navigate("Login");

          const getUserDoc = doc(db_firestore, "User_Data", username.trim());
          const userData = {
            Username: username.toLowerCase().trim(),
            Email: email.toLowerCase().trim(),
            // "Device": device.trim(),
            Password: password,
            Phone: phone.trim(),
            Location: location.trim(),
          };
          setDoc(getUserDoc, userData)
            .then(() => {
              platformWeb
                ? alert("Registration Successful!")
                : Toast.show("Registration Successful!", {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.BOTTOM,
                    containerStyle: {
                      backgroundColor: "green",
                      borderRadius: 20,
                      padding: 10,
                    },
                  });
            })
            .catch((error) => {
              alert(error.message);
            });
        })
        .catch((re) => {
          alert(re);
        });
    }
  };

  const getDataFirestore = async () => {
    navigation.navigate("Login");
    // const deviceDoc = doc(db_firestore, "Device", device)

    // getDoc(deviceDoc)
    // .then((snapshot)=>{
    //     if(snapshot.exists){
    //         if(snapshot.data()!=null){
    //          alert("Device ID matched!!!");
    //         }else{
    //             alert("Device ID not found");
    //         }
    //     }else{
    //         alert("Device ID not found");
    //     }
    // })

    // const userData = collection(db_firestore, "User_Data");
    // const userDataSnapshot = await getDocs(userData);
    // const userDataList = userDataSnapshot.docs.map(
    //     doc => doc.data());

    // userDataList.map(item=>{
    //     if(item.Email== "rahat@gmail.com"){
    //         alert(item.Username + " " + item.Device )
    //     }
    // })
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.registerContainer}
    >
      <StatusBar barStyle="dark-content" />
      <Image
        source={require("../assets/leaf_background.jpg")}
        style={StyleSheet.absoluteFillObject}
        blurRadius={10}
      />
      <SafeAreaView
        style={[
          styles.registerTitle,
          { flex: 1, flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <TouchableOpacity
          style={{
            padding: 5,
            marginLeft: 10,
            marginTop: 10,
            justifyContent: "flex-start",
            zIndex: 1,
          }}
          onPress={() => navigation.navigate("Login")}
        >
          <Icon name={"chevron-back-sharp"} size={40} color={"#004100"} />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 10 }}>
          <Text
            style={[
              styles.registerTitleText,
              {
                margin: 10,
                padding: 10,
                textAlign: "center",
                alignSelf: "center",
              },
            ]}
          >
            {" "}
            Register{" "}
          </Text>
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <Icon
            name={"ios-person"}
            size={22}
            color={"rgba(0,0,0, 0.3)"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={"Username"}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            underlineColorAndroid="transparent"
            style={[
              styles.input,
              usernameRedBox ? styles.btnBoxRed : styles.input,
            ]}
            value={username}
            onChangeText={(text) => setUsername(text.trim())}
            autoFocus
          ></TextInput>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <MaterialIcon
            name={"email"}
            size={22}
            color={"rgba(0,0,0, 0.3)"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={"Email"}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            underlineColorAndroid="transparent"
            value={email}
            onChangeText={(text) => setEmail(text.trim())}
            style={[
              styles.input,
              emailRedBox ? styles.btnBoxRed : styles.input,
            ]}
            keyboardType="email-address"
          ></TextInput>
        </KeyboardAvoidingView>
        {/* <KeyboardAvoidingView>
                        <MaterialIcon name={'devices'} size={22} color={'rgba(0,0,0, 0.3)'}  style={styles.inputIcon}/>
                        <TextInput 
                            placeholder = {'Device ID'}
                            placeholderTextColor={'rgba(0,0,0, 0.3)'}
                            underlineColorAndroid='transparent'
                            value = {device}
                            onChangeText={text => setDevice(text.trim())}
                            style= {[styles.input, deviceRedBox ? styles.btnBoxRed : styles.input]}
                            keyboardType="numeric"
                            >                        
                        </TextInput>              
                    </KeyboardAvoidingView> */}
        <KeyboardAvoidingView>
          <FontAwesome
            name={"lock"}
            size={22}
            color={"rgba(0,0,0, 0.3)"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={"Password"}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            style={[
              styles.input,
              passwordRedBox ? styles.btnBoxRed : styles.input,
            ]}
            underlineColorAndroid="transparent"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={visiblePassword ? false : true}
          ></TextInput>
          {password.length == 0 ? null : (
            <TouchableOpacity style={styles.btnEye}>
              <Icon
                name={
                  visiblePassword ? "ios-eye-off-outline" : "ios-eye-outline"
                }
                size={24}
                color={"rgba(0,0,0, 0.6)"}
                onPress={() => setVisiblePassword(!visiblePassword)}
              />
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <FontAwesome
            name={"lock"}
            size={22}
            color={"rgba(0,0,0, 0.3)"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={"Confirm Password"}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            underlineColorAndroid="transparent"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            style={[
              styles.input,
              confirmPasswordRedBox ? styles.btnBoxRed : styles.input,
            ]}
            secureTextEntry={visibleConfirmPassword ? false : true}
          ></TextInput>
          {confirmPassword.length == 0 ? null : (
            <TouchableOpacity style={styles.btnEye}>
              <Icon
                name={
                  visibleConfirmPassword
                    ? "ios-eye-off-outline"
                    : "ios-eye-outline"
                }
                size={24}
                color={"rgba(0,0,0, 0.6)"}
                onPress={() =>
                  setVisibleConfirmPassword(!visibleConfirmPassword)
                }
              />
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <FontAwesome
            name={"phone"}
            size={22}
            color={"rgba(0,0,0, 0.3)"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={"Phone No."}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            underlineColorAndroid="transparent"
            value={phone}
            onChangeText={(text) => setPhone(text.trim())}
            style={[
              styles.input,
              phoneRedBox ? styles.btnBoxRed : styles.input,
            ]}
            keyboardType="number-pad"
          ></TextInput>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <Icon
            name={"md-location-sharp"}
            size={22}
            color={"rgba(0,0,0, 0.3)"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={"Location"}
            placeholderTextColor={"rgba(0,0,0, 0.3)"}
            underlineColorAndroid="transparent"
            value={location}
            onChangeText={(text) => setLocation(text)}
            style={[
              styles.input,
              locationRedBox ? styles.btnBoxRed : styles.input,
            ]}
            keyboardType="default"
          ></TextInput>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <TouchableOpacity
            style={[styles.btnRegister, { marginTop: 50 }]}
            onPress={handleRegister}
          >
            <Text style={styles.btnText}> Register </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <View style={styles.signInOption}>
          <Text style={styles.alreadySignInText}>Already have an account?</Text>
          <TouchableOpacity
            // onPress={()=> navigation.replace("Login")}>
            onPress={getDataFirestore}
          >
            <Text style={styles.signInText}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={{ width: "100%", height: 150 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "lightblue",
  },
  registerTitle: {
    marginTop: 40,
    marginBottom: 40,
  },
  registerTitleText: {
    color: "#004100",
    opacity: 1,
    fontSize: 20,
    fontWeight: "bold",
    // shadowColor:"gray",
    // shadowOffset:{
    //     width:0,
    //     height:10
    // },
    // shadowOpacity:0.5,
    // shadowRadius:30,
  },
  input: {
    width: WIDTH,
    height: 42,
    borderRadius: 10,
    fontSize: 15,
    padding: 10,
    paddingLeft: 45,
    backgroundColor: "rgba(30, 144, 255, 0.2)",
    textAlignVertical: "center",
    color: "black",
    borderColor: "gray",
    margin: 10,
    marginLeft: 25,
    marginRight: 25,
    fontWeight: "500",
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  inputIcon: {
    position: "absolute",
    top: 20,
    left: 40,
  },
  btnEye: {
    position: "absolute",
    top: 18,
    right: 40,
    color: "white",
  },
  btnRegister: {
    height: 45,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#008200",
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
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
  btnBoxRed: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  signInOption: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  alreadySignInText: {
    fontWeight: "600",
    fontSize: 15,
    color: "black",
    opacity: 0.8,
    padding: 5,
  },
  signInText: {
    borderBottomWidth: 1,
    borderBottomColor: "#008200",
    color: "#008200",
    padding: 5,
    fontSize: 15,
    fontWeight: "bold",
    fontWeight: "bold",
  },
});

export default Register;
