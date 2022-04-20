import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import Ionicons from "react-native-vector-icons/Ionicons";


const Rating = (props) => {
    const stars = [];

    for(let i=1; i<=props.starCount; i++){
        stars.push(<TouchableOpacity activeOpacity={0.6} key={i} style={{paddingRight: 2}} disabled={props.disabled} onPress={()=>props.onPress(i)}>
            <Ionicons name={'star'} size={props.starSize} color={i <= props.rating ? Theme.PRIMARY_COLOR : Theme.BORDER_COLOR}/>
        </TouchableOpacity>)
    }

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            {stars}
        </View>
    );
};


export default Rating;

const styles = StyleSheet.create({
    button: {
        width: '100%',
        // height: 45,
        flex: 0.7,
        backgroundColor: Theme.RED_COLOR,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center',
    },

    text: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_LARGE,
        color: Theme.WHITE_COLOR
    }
});
