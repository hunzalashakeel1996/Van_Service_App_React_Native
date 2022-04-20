import React from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputMask from 'react-native-text-input-mask';
import Text from '../text/TextWithStyle';

const MaskInputWithIcon = (props) => {
    return (
        <View style={styles.container}>
            {/* <View style={[styles.inputContainer, { borderBottomColor: props.error ? Theme.RED_COLOR : Theme.BORDER_COLOR }]}> */}
            <View style={[styles.inputContainer, props.noBackgroundColor && { backgroundColor: null, borderBottomWidth: 1, borderBottomColor: props.error ? Theme.RED_COLOR : Theme.BORDER_COLOR }]}>
                {props.iconColor ? <Ionicons name={props.iconName} color={props.iconColor} size={25} style={[styles.icon, props.iconStyle]} />
                    : <View style={styles.icon}><Image style={props.countryCode ? { width: 30, height: 20, } : { width: 20, height: 20 }} source={props.iconName} /></View>}
                {props.countryCode ? <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, flex: 0.125, alignSelf: "center", paddingLeft: 5 }}>{props.countryCode}</Text> : null}
                <TextInputMask
                    style={styles.input}
                    onChangeText={props.onChangeText}
                    value={props.value}
                    placeholder={props.placeholder}
                    // type={props.type}
                    // options={props.options}
                    // onEndEditing={props.onEndEditing}
                    mask={props.mask}
                    keyboardType={props.keyboardType}

                />
            </View>
            {props.error && <Text style={styles.text}>{props.error}</Text>}
        </View>
    );
};


export default MaskInputWithIcon;

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e4e4e4",
        borderColor: "#e4e4e4",
        borderRadius: 10,
        // borderBottomWidth: 1,
        // marginBottom: 10,
        // borderBottomColor: Theme.BORDER_COLOR
    },
    input: {
        flex: 0.75,
        height: 50,
        fontSize: Theme.FONT_SIZE_LARGE,
    },
    icon: {
        flex: 0.125,
        paddingLeft: 10
    },
    text: {
        marginLeft: 35,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR
    }
});
