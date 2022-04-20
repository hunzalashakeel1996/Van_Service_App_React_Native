import React from 'react';
import {RefreshControl } from 'react-native';
import Theme from '../../Theme/Theme';

const RefreshController = (props) => {
    // console.log(props)
    return (
        <RefreshControl refreshing={props.refreshing} onRefresh={props.onRefresh} colors={[Theme.SECONDARY_COLOR,Theme.PRIMARY_COLOR]}/>
    );
};


export default RefreshController;
