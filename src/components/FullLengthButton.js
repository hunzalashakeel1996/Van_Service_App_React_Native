import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Theme from './Theme';
import TextWithStyle from './TextWithStyle';

const FullLengthButton = (props) => {
    return (
      <TouchableOpacity activeOpacity={0.6} style={[styles.button, props.styleButton]} disabled={props.disabled} onPress={props.onPress}>
        <TextWithStyle style={[styles.text, props.styleText]}>{props.children}</TextWithStyle>
      </TouchableOpacity>
    );
};


export default FullLengthButton;

const styles = StyleSheet.create({
  button:{
    width: '80%',
    height: 45,
    backgroundColor: Theme.PRIMARY_COLOR,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  text:{
    alignSelf: 'center',
    fontSize: Theme.FONT_SIZE_LARGE,
    color: Theme.WHITE_COLOR
  }
});
