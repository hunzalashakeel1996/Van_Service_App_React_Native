import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';

const RadioBox = (props) => {
    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
                    <View style={[styles.radio, props.selected ? {borderColor: Theme.PRIMARY_COLOR} : null, props.style]}>
                        {props.selected && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={[styles.text, props.selected ? {color: Theme.BORDER_COLOR} : null]}>{props.text}</Text>
        </TouchableOpacity>
    );
};


export default RadioBox;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        // justifyContent: 'center',
    },
    radio: {
        // flex: 0.2,
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 10,
    },
    radioSelected: {
        // flex: 0.8,
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: Theme.SECONDARY_COLOR,
    },
    text: {
        fontSize: Theme.FONT_SIZE_MEDIUM,
        color: Theme.BORDER_COLOR,
    }
});
