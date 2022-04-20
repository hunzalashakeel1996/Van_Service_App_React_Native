/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import Theme from '../../Theme/Theme';
import Text from './../../components/text/TextWithStyle';
import Button from './../../components/button/Button';

const TripBooked = (props) => {

    // const [activeSlide, setActiveSlide] = useState(0);
    const insertId = props.route.params?.insertId;

    useEffect(() => {
    }, [])

    const navigateScreen = (route) => {
        props.navigation.navigate(route)
      }

    return (
        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />

            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, fontFamily: Theme.FONT_FAMILY_BOLD }}>Thank You For Your Confirmation</Text>
                </View>
                <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ height: "100%", width: "32%", borderRadius: 100, justifyContent: "center", alignItems: "center", backgroundColor: Theme.SECONDARY_COLOR }}>
                        <Image style={{ width: 60, height: 60 }} source={require('../../../assets/passenger/thumbsup.png')} />
                    </View>
                </View>
                <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center", }}>
                    <Text  style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.BORDER_COLOR }}>Your Trip Has Been Booked</Text>
                </View>
                <View style={{ flex: 0.12, justifyContent: "center", alignItems: "center" }}>
                    <Button styleButton={{ width: "85%" }}>{`Booked Number : MT${insertId}`}</Button>
                </View>
                <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center", }}>
                    <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.PRIMARY_COLOR}}>See Your Trip Details</Text>
                </View>
                <View style={{ flex: 0.33, justifyContent: "center", alignItems: "center", }}>
                    <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.RED_COLOR, borderBottomWidth: 1, borderBottomColor: Theme.RED_COLOR}}>Cancel The Trip</Text>
                </View>
            </View>
        </Fragment >
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: Theme.FONT_SIZE_XSMALL,
        color: Theme.SECONDARY_COLOR,
    },
    iconTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 15,
        height: 15
    },
    text: {
        color: Theme.BORDER_COLOR,
        fontSize: Theme.FONT_SIZE_XSMALL
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR
    },
});

export default TripBooked;