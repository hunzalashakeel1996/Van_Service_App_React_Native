import React from 'react';
import { StyleSheet, View, TextInput, Text, Image } from 'react-native';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';


const InputWithBorder = (props) => {
    const icon = (props.iconColor ?
        <View style={styles.icon}><Ionicons name={props.iconName} color={props.iconColor} size={25} style={[props.iconStyle]} /></View>
        :
        <View style={styles.icon}><Image style={props.countryCode ? { width: 30, height: 20 } : { width: 20, height: 20 }} source={props.iconName} /></View>);
    return (
        <View style={[styles.container]}>
            <View style={[styles.inputView, props.inputContainer, { borderColor: props.error ? Theme.RED_COLOR : Theme.BORDER_COLOR_OPACITY }]}>
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
                    onFocus={(val) => console.warn(val)}
                    multiline={props.multiline}
                    numberOfLines={4}
                />
            </View>
            {/* {props.error && <Text style={styles.text}>{props.error}</Text>} */}
        </View>
    );
};


export default InputWithBorder;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Theme.BORDER_COLOR_OPACITY,
        borderRadius: 5
    },
    input: {
        flex: 0.9,
        height: 40,
        marginLeft: 10,
        fontSize: Theme.FONT_SIZE_MEDIUM,
    },
    icon: {
        flex: 0.1,
        alignItems: "center",
    },
    text: {
        marginLeft: 35,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR
    }
});
