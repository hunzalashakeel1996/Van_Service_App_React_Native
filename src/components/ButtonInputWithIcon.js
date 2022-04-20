import React from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { TextInputMask } from 'react-native-masked-text'
import TextWithStyle from './TextWithStyle';
import Theme from '../Theme/Theme';

const ButtonInputWithIcon = (props) => {
    return (
        <View style={{marginBottom: 10}}>
            <View style={{ shadowColor: 'black', elevation: 1.5, borderWidth: 2, borderColor: Theme.BORDER_COLOR_2, height: 45, borderRadius: 8 }}>

                {/* {props.iconColor ? <Ionicons name={props.iconName} color={props.iconColor} size={25} style={[styles.icon, props.iconStyle]} />
                    : <View style={styles.icon}><Image style={{ width: 20, height: 20 }} source={props.iconName} /></View>}
                 */}
            </View>
            {props.error && <TextWithStyle style={styles.text}>{props.error}</TextWithStyle>}
        </View>
    );
};


export default ButtonInputWithIcon;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
});
