import React from 'react';
import {StyleSheet, Text } from 'react-native';
import {RFPercentage as RF} from 'react-native-responsive-fontsize';
import PropTypes from "prop-types";

const TextWithStyle = (props) => {
    return (
        <Text style={[styles.Font, props.style]} numberOfLines={props.numberOfLines} ellipsizeMode={props.ellipsizeMode} onPress={props.onPress}>{props.children}</Text>
    );
};

TextWithStyle.propTypes = {
    ellipsizeMode: PropTypes.string,
    numberOfLines: PropTypes.number,
  };

export default TextWithStyle;

const styles = StyleSheet.create({
   Font:{
    fontFamily: "Lato-Regular",
    color: 'black'
   }
});





