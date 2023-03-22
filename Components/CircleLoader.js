import React, { useRef } from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from "lottie-react-native";

const CircleLoader = () => {
    const animation = useRef(null); 
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <LottieView 
            autoPlay
            ref={animation}
            style={{
            width: 200,
            height: 200,
            backgroundColor:"#004100",
            }}
            speed={0.5}
            loop={true}
            source={require("../assets/circle-loader.json")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        justifyContent:"center", 
        alignItems:"center", 
        zIndex:1,
        backgroundColor:"lightblue", 
    }
})

export default CircleLoader;