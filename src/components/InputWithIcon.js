import React from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import Theme from './Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { TextInputMask } from 'react-native-masked-text'
import TextWithStyle from './TextWithStyle';

const InputWithIcon = (props) => {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, { borderBottomColor: props.error ? Theme.RED_COLOR : Theme.BORDER_COLOR }]}>
                {props.iconColor ? <Ionicons name={props.iconName} color={props.iconColor} size={25} style={[styles.icon, props.iconStyle]} />
                 : <View style={styles.icon}><Image style={{ width: 20, height: 20}} source={props.iconName} /></View>}
                <TextInput
                    style={styles.input}
                    onChangeText={props.onChangeText}
                    value={props.value}
                    placeholder={props.placeholder}
                    onBlur={props.onBlur}
                    placeholderTextColor='grey'
                    onFocus={props.onFocus}
                    keyboardType={props.keyboardType}
                    maxLength={props.maxLength}
                />
            </View>
            {props.error && <TextWithStyle style={styles.text}>{props.error}</TextWithStyle>}
        </View>
    );
};


export default InputWithIcon;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        // marginBottom: 10,
        borderBottomColor: Theme.BORDER_COLOR
    },
    input: {
        flex: 0.9, height: 40, color: 'black'
    },
    icon: {
        flex: 0.1,
    },
    text: {
        marginLeft: 35,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR
    }
});
