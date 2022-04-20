import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Theme from './Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextWithStyle from './TextWithStyle';

const OutlineButton = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[styles.button, props.styleButton]}
        onPress={props.onPress}>
        {/* <Ionicons name="logo-googleplus" size={25} color={Theme.RED_COLOR} style={{flex: 0.3}}/> */}
        <TextWithStyle style={[styles.text, props.styleText]}>{props.children}</TextWithStyle>
      </TouchableOpacity>
    </View>
  );
};


export default OutlineButton;

const styles = StyleSheet.create({
  button: {
    width: '80%',
    height: 45,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.PRIMARY_COLOR,
    flexDirection: "row",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: "center"
  },

  text: {
    // alignSelf: 'center',
    fontSize: Theme.FONT_SIZE_LARGE,
    color: Theme.PRIMARY_COLOR
  }
});
