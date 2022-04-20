import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {RFPercentage as RF} from 'react-native-responsive-fontsize';

const IconWithBg = (props) => {
    return (
        // <Text style={[styles.Font, props.style]}>{props.children}</Text>
        <View style={[styles.round_icon, props.style]}>
            <Image
                source={props.source}
                style={[styles.image, props.ImageStyle]}
            />
        </View>
    );
};


export default IconWithBg;

const styles = StyleSheet.create({
    round_icon: {
        justifyContent: "center",
        alignItems: "center",
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 50,
        backgroundColor: "rgba(20, 52, 89,1)"
    },
    image: {
        width: wp("7%"),
        height: wp("7%")
    },
});





