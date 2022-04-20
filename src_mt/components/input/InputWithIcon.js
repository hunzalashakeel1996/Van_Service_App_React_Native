import React from 'react';
import { StyleSheet, View, TextInput, Text, Image } from 'react-native';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputWithIcon = (props) => {
    const icon = (props.iconColor ?
        <Ionicons name={props.iconName} color={props.iconColor} size={25} style={[styles.icon, props.iconStyle]} />
        :
        <View style={styles.icon}><Image style={props.countryCode ? { width: 30, height: 20 } : { width: 20, height: 20 }} source={props.iconName} /></View>);
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, { borderBottomColor: props.error ? Theme.RED_COLOR : Theme.BORDER_COLOR }]}>
                {props.iconName ? icon : null}
                <TextInput
                    style={[styles.input,props.inputText]}
                    onChangeText={props.onChangeText}
                    value={props.value}
                    placeholder={props.placeholder}
                    onBlur={props.onBlur}
                    onFocus={props.onFocus}
                    keyboardType={props.keyboardType}
                    maxLength={props.maxLength}
                    autoFocus={props.autoFocus}
                    secureTextEntry={props.secureTextEntry}
                    autoCapitalize={props.autoCapitalize}
                />
            </View>
            {props.error && <Text style={styles.text}>{props.error}</Text>}
        </View>
    );
};


export default InputWithIcon;

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        // marginBottom: 10,
        borderBottomColor: Theme.BORDER_COLOR
    },
    input: {
        flex: 0.9,
        height: 50,
        fontSize: Theme.FONT_SIZE_LARGE
    },
    icon: {
        flex: 0.1,
    },
    text: {
        // marginLeft: 35,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR,
    }
});
