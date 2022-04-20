import React from 'react';
import { StyleSheet, View, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';


const InputWithBackground = (props) => {
    const icon = (props.iconColor ?
        <View style={styles.icon}><Ionicons name={props.iconName} color={props.iconColor} size={25} style={[props.iconStyle]} /></View>
        :
        <View style={styles.icon}><Image style={props.countryCode ? { width: 30, height: 20 } : { width: 20, height: 20 }} source={props.iconName} /></View>);

    const iconLeft = (<TouchableOpacity onPress={props.leftIconPress} style={[styles.icon, {paddingRight: 5}]}>
        <Ionicons  name={props.iconLeftName} color={props.iconLeftColor} size={25} style={[props.iconLeftStyle]} />
    </TouchableOpacity>);

    return (
        <View style={[styles.container]}>
            <View style={[styles.inputView, props.inputContainer, { borderColor: props.error ? Theme.RED_COLOR : Theme.BORDER_COLOR_OPACITY }]}>
                {/* {props.iconName && <View style={styles.icon}>
                    <Image style={[props.imageStyle]} source={props.iconName} />
                </View>} */}
                {props.iconName ? icon : null}
                <TextInput
                    style={[styles.input, props.inputText]}
                    onChangeText={props.onChangeText}
                    value={props.value}
                    placeholder={props.placeholder}
                    onBlur={props.onBlur}
                    onFocus={props.onFocus}
                    keyboardType={props.keyboardType}
                    maxLength={props.maxLength}
                    editable={props.editable}
                    onFocus={props.onFocus}
                    multiline={props.multiline}
                    numberOfLines={4}
                    secureTextEntry={props.secureTextEntry}
                    autoCompleteType={props.autoCompleteType}
                />
                {props.iconLeftName ? iconLeft : null}
            </View>
            {props.error && <Text style={styles.text}>{props.error}</Text>}
        </View>
    );
};


export default InputWithBackground;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        backgroundColor: "#e4e4e4",
        borderColor: "#e4e4e4",
        borderRadius: 10
    },
    input: {
        flex: 0.9,
        height: 50,
        marginLeft: 10,
        fontSize: Theme.FONT_SIZE_LARGE,
    },
    icon: {
        flex: 0.12,
        alignItems: "flex-end",
    },
    text: {
        marginLeft: 35,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR
    }
});
