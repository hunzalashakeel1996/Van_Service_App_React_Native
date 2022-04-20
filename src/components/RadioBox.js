import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Theme from './Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextWithStyle from './TextWithStyle';

const RadioBox = (props) => {
    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
            {/* {props.radio.map(box => ( */}
                {/* <View> */}
                    <View style={[styles.radio, props.style]}>
                        {props.selected && <View style={styles.radioSelected} />}
                    </View>
                    <TextWithStyle style={[styles.text, {color: Theme.PRIMARY_COLOR }]}>{props.text}</TextWithStyle>
                {/* </View> */}
            {/* ))} */}
        </TouchableOpacity>
    );
};


export default RadioBox;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    radio: {
        // flex: 0.2,
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 10,
    },
    radioSelected: {
        // flex: 0.8,
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: Theme.PRIMARY_COLOR,
    },
    text: {
        fontSize: Theme.FONT_SIZE_MEDIUM,
    }
});
