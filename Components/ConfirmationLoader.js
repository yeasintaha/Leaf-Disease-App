import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

const ConfirmationLoader = () => {
  const animation = useRef(null);
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
        }}
        speed={0.8}
        loop={false}
        source={require("../assets/confirmation-loader.json")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "lightgreen",
    opacity: 0.5,
  },
});

export default ConfirmationLoader;
