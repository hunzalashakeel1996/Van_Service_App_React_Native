import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import Text from '../text/TextWithStyle';

const OutlineButton = (props) => {
  return (
    <TouchableOpacity style={[styles.button, { borderColor: props.outlineColor ? props.outlineColor : Theme.RED_COLOR }, props.styleButton]} disabled={props.disabled} onPress={props.onPress}>
      <Text style={[styles.text, { color: props.outlineColor ? props.outlineColor : Theme.RED_COLOR }, props.styleText]}>{props.children}</Text>
    </TouchableOpacity>
  );
};


export default OutlineButton;

const styles = StyleSheet.create({
  button: {
    width: '80%',
    height: 45,
    backgroundColor: "transparent",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: "center"
  },

  text: {
    alignSelf: 'center',
    fontSize: Theme.FONT_SIZE_LARGE,
  }
});
