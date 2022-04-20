import React from 'react';
import { StyleSheet, View, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import Text from './../../components/text/TextWithStyle';

const Button = (props) => {
  return (
    <TouchableOpacity style={[styles.button, { opacity: props.disabled ? 0.7 : 1 }, props.styleButton]} disabled={props.disabled} onPress={props.onPress}>
      {props.loading ? props.children : <Text style={[styles.text, props.styleText]}>{props.children}</Text>}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: "center",
  },

  button: {
    width: '100%',
    height: 40,
    color: Theme.WHITE_COLOR,
    backgroundColor: Theme.SECONDARY_COLOR,
    borderRadius: 5,
    justifyContent: 'center',
    // alignSelf: 'center',
  },

  text: {
    alignSelf: 'center',
    textAlign: "center",
    fontSize: Theme.FONT_SIZE_LARGE,
    color: Theme.WHITE_COLOR
  }
});
