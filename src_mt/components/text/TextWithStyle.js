import React from 'react';
import {StyleSheet, Text } from 'react-native';
import PropTypes from "prop-types";
import Theme from '../../Theme/Theme';

const TextWithStyle = (props) => {
    return (
        <Text style={[styles.Font, props.style]} onPress={props.onPress} numberOfLines={props.numberOfLines} ellipsizeMode={props.ellipsizeMode} lineBreakMode={props.lineBreakMode}>{props.children}</Text>
    );
};

TextWithStyle.propTypes = {
    ellipsizeMode: PropTypes.string,
    lineBreakMode: PropTypes.string,
    numberOfLines: PropTypes.number,
  };

export default TextWithStyle;

const styles = StyleSheet.create({
   Font:{
    fontFamily: Theme.FONT_FAMILY_LATO
   }
});





