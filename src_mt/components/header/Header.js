import React, { Component } from 'react';
import {
    Modal,
    View,
    ActivityIndicator,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Text from './../text/TextWithStyle';

const Header = (props) => {
    return (
        <View style={{ backgroundColor: Theme.SECONDARY_COLOR, height: 60, flexDirection: 'row' }}>
            <TouchableOpacity onPress={props.onBackPress} style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons  style={{}} name={"md-arrow-back"} size={25} color={'white'} />
            </TouchableOpacity>
            <View style={{ flex: 0.85, justifyContent: 'center', marginLeft: 20 }}>
                <Text style={{ color: 'white', fontSize: 18 }}>{props.text}</Text>
            </View>
        </View>
    );
}

export default Header;