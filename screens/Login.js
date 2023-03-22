import {
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
  KeyboardAvoidingView,
  View,
  Text,
  Linking,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import { db_firestore, auth } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Animatable from "react-native-animatable";
import { UserContext } from "../UserContext";
import Toast from "react-native-root-toast";
import ConfirmationLoader from "../Components/ConfirmationLoader";
import CircleLoader from "../Components/CircleLoader";
// import ProgressLoader from '../Components/ProgressLoader';
// import LottieView from 'lottie-react-native';

const { width: WIDTH } = Dimensions.get("window").width;
const platformAndroid = Platform.OS === "android";
const PlatformWeb = Platform.OS === "web";

const Login = ({ navigation }) => {
  // const animationRef = useRef(null);

  const { emailProvider, setEmailProvider, setUserCredentials } =
    useContext(UserContext);

  const [loginPending, setLoginPending] = useState(false);

  const [showpass, setShowpass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailRedBox, setEmailRedBox] = useState(false);
  const [passwordRedBox, setPasswordRedBox] = useState(false);

  // const [loaderAnimation, setLoaderAnimation] = useState(false);

  useEffect(() => {
    Keyboard.dismiss();
    setPassword("");
    setEmail("");
    setEmailProvider("");

    // setLoaderAnimation(true);
    // setTimeout(()=>{
    //   setLoaderAnimation(false);
    // }, 10000);
  }, []);

  const handleAuth = async () => {
    // setEmailProvider("taha@gmail.com");
    // navigation.navigate("Menu");

    // setLoginPending(true);

    Keyboard.dismiss();
    setEmailRedBox(false);
    setPasswordRedBox(false);
    let flag = 0;
    if (password == "" || password == null) {
      flag = 1;
      setPasswordRedBox(true);
    }
    if (email == "" || email == null) {
      flag = 1;
      setEmailRedBox(true);
    }
    if (!email.includes("@", 2) || !email.includes(".", 5)) {
      // Alert.alert("Invalid Email ID", [
      //     {text: 'Ok'}
      // ]);
      setEmailRedBox(true);
    }

    const userData = collection(db_firestore, "User_Data");
    const userDataSnapshot = await getDocs(userData);
    const userDataList = userDataSnapshot.docs.map((doc) => doc.data());

    if (flag == 0) {
      signInWithEmailAndPassword(auth, email, password)
        .then((re) => {
          // if(platformAndroid){
          //  ToastAndroid.show('Logged In Successfully!', ToastAndroid.LONG);
          // }
          // else {
          // alert("Logged In successfully!");
          setLoginPending(true);
          setTimeout(() => {
            setLoginPending(false);
            Toast.show("Logged In Successfully!", {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
              containerStyle: {
                backgroundColor: "green",
                borderRadius: 25,
                padding: 10,
              },
            });
            setPassword("");
            setEmail("");
            // }
            setShowpass(false);
            setEmailProvider(email);

            // var start = new Date().getTime();
            // var end = start;
            // while(end < start + 2000) {
            //   end = new Date().getTime();
            // }
            navigation.push("Menu");
          }, 1000);

          userDataList.map((item) => {
            if (item.Email.toLowerCase() == email.toLowerCase()) {
              setUserCredentials({
                Username: item.Username,
                Email: item.Email,
                Password: item.Password,
                Phone: item.Phone,
                Location: item.Location,
              });
            }
          });

          // alert("Email is : " + emailProvider);
        })
        .catch((re) => {
          Toast.show("Email or Password didn't match!", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            containerStyle: {
              backgroundColor: "red",
              borderRadius: 25,
              padding: 10,
            },
          });
          setEmailRedBox(true);
          setPasswordRedBox(true);
          // alert("Email or Password didn't match!!!");
        });
    }

    // setIsSignedIn(true);

    // alert("why no alert")
    // alert(userCredentials.Username + " " + userCredentials.Phone + " " + userCredentials.Location + " " + userCredentials.Email)
    //   navigation.navigate('Menu');
  };

  // const SignOutUser = ()=>{
  //   signOut(auth)
  //   .then((re)=>{
  //     navigation.navigate('Login');
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //   })
  // }

  return (
    <>
      <ImageBackground
        source={require("../assets/leaf_background.jpg")}
        style={styles.backgroundContainer}
        blurRadius={20}
      >
        <StatusBar barStyle="dark-content" />
        {/* <Toast ref={(ref)=>{Toast.setRef(ref)}} />  */}
        <KeyboardAvoidingView style={styles.logoContainer} behavior="padding">
          <Animatable.Image
            animation="bounceIn"
            source={require("../assets/leaf.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}> Sign In</Text>
        </KeyboardAvoidingView>
        <Animatable.View animation="fadeInUpBig">
          <KeyboardAvoidingView behavior="padding">
            <Icon
              name={"ios-person"}
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
              autoFocus
            ></TextInput>
          </KeyboardAvoidingView>
          <KeyboardAvoidingView behavior="padding">
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
              secureTextEntry={showpass == false ? true : false}
              value={password}
              onChangeText={(text) => setPassword(text)}
            ></TextInput>
            {password.length == 0 ? null : (
              <TouchableOpacity style={styles.btnEye}>
                <Icon
                  name={
                    showpass == false
                      ? "ios-eye-outline"
                      : "ios-eye-off-outline"
                  }
                  size={24}
                  color={"black"}
                  onPress={() => setShowpass(!showpass)}
                />
              </TouchableOpacity>
            )}
          </KeyboardAvoidingView>
          <KeyboardAvoidingView behavior="padding">
            <TouchableOpacity style={styles.btnLogin} onPress={handleAuth}>
              <Text style={styles.btnText}> Login</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
          <KeyboardAvoidingView behavior="padding">
            <TouchableOpacity
              style={[
                styles.btnLogin,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderColor: "#008200",
                  borderRadius: 10,
                  borderWidth: 3,
                },
              ]}
              onPress={() => navigation.navigate("Register")}
            >
              <Text
                style={{
                  color: "#008200",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {" "}
                Register
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
          <View style={{ width: "100%", height: 200 }}></View>
        </Animatable.View>
      </ImageBackground>
      {loginPending && platformAndroid ? (
        <ConfirmationLoader />
      ) : loginPending && !platformAndroid ? (
        <View
          style={{
            top: 0,
            position: "absolute",
            justifyContent: "center",
            zIndex: 100,
            width: "100%",
            height: "100%",
            backgroundColor: "lightgreen",
          }}
        >
          <ActivityIndicator size={"large"} color="blue" animating={true} />
        </View>
      ) : null}
      {
        // loaderAnimation  ?
        // <View style={{zIndex:1, position:"absolute", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
        // <Image
        //       source={require('../assets/logo.png')}
        //       style = {{zIndex:1, height:150, width:150, borderRadius:75, justifySelf:"center", alignItems:"center", margin:20, padding:10}}/>
        // {/* <LottieView
        //   style={{
        //   height: 200,
        //   justifyContent:"center"
        //   }}
        //   ref={animationRef}
        //   autoPlay={true}
        //   speed={0.5}
        //   loop={false}
        //   source={require("../assets/circle-loader.json")}  /> */}
        //  <ProgressLoader/>
        // </View>
        // : null
      }
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  backgroundContainer: {
    height: "100%",
    width: "100%",
  },
  backgroundImage: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },

  logo: {
    marginTop: 50,
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    alignSelf: "center",
  },

  logoText: {
    color: "#007a00",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },

  logoContainer: {
    alignItems: "center",
    margin: 20,
    marginTop: 40,
  },

  input: {
    width: WIDTH,
    height: 45,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: "bold",
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
  btnLogin: {
    height: 45,
    borderRadius: 10,
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
});
