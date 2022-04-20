import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import Text from './../../components/text/TextWithStyle';
import SwipeButton from 'rn-swipe-button';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Button = (props) => {
  const icon = () => (
    <Ionicons name={props.iconName} color={'white'} size={30} />
  );
  return (

    <SwipeButton
      railBackgroundColor={Theme.SECONDARY_COLOR}
      thumbIconBackgroundColor={Theme.SECONDARY_COLOR}
      thumbIconBorderColor={Theme.SECONDARY_COLOR}
      railFillBackgroundColor={'rgba(242,103,59,0.7)'}
      railBorderColor={Theme.SECONDARY_COLOR}
      railFillBorderColor={Theme.SECONDARY_COLOR_RGB}
      title={props.title}
      titleColor={'white'}
      thumbIconStyles={{ borderRadius: 8 }}
      containerStyles={{ borderRadius: 8 }}
      enableRightToLeftSwipe={props.enableRightToLeft}
      thumbIconComponent={icon}
      height={50}
      onSwipeSuccess={props.onSwipeSuccess}
    />
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
    height: 45,
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
