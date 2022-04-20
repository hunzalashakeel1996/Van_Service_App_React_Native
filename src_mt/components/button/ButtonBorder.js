import React from 'react';
import { StyleSheet, View, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ButtonBorder = (props) => {
    const icon = (props.iconColor ?
        <Ionicons name={props.iconName} color={props.iconColor} size={25} style={[props.iconStyle]} />
        :
        <Image style={[props.iconStyle]} source={props.iconName} />);
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, props.error && styles.errCont]}>
            <View style={styles.icon}>{props.iconName ? icon : null}</View>
                {/* <View style={styles.icon}>
                    <Image style={[props.imageStyle]} source={props.iconName} />
                </View> */}
                <TouchableOpacity onPress={props.onPress} style={styles.input}>
                    <Text style={styles.text} numberOfLines={1}>{props.text ? props.text : props.defaultText}</Text>
                </TouchableOpacity>
            </View>
            {props.error && <Text style={styles.errText}>{props.error}</Text>}
        </View>
    );
};


export default ButtonBorder;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Theme.BORDER_COLOR_OPACITY,
        borderRadius: 5,
    },
    input: {
        flex: 0.85,
        height: 45,
        // fontSize: Theme.FONT_SIZE_MEDIUM,
        justifyContent: "center"
    },
    icon: {
        flex: 0.15,
        alignItems: "center"
    },
    text: {
        // marginLeft: 35,
        fontSize: Theme.FONT_SIZE_LARGE,
        color: Theme.BORDER_COLOR,
    },
    errText: {
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR,
    },
    errCont: {
        borderColor: Theme.RED_COLOR,
        borderWidth: 2,
    }
});
