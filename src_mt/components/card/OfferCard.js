import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import Theme from '../../Theme/Theme';
import Button from './../button/Button';
import TimerComponent from './../time/TimerComponent';
import OfferCardContent from './OfferCardContent';

const OfferCard = (props) => {
    const data = props.data;
    // const isExpired = props.isExpired;
    const notShowBlock = (!props.showBlock);
    const notAvailable = (props.isExpired == true);

    const getBlockStyle = () => {
        return notShowBlock ? styles.containerRadius : null;
    }

    const AdditionalData = (
        <View style={{ marginTop: 5 }}>
            {props.customer_time_limit && <View style={{ height: 70, justifyContent: "center" }}>
                <TimerComponent timer={props.customer_time_limit}
                    timeCompleted={() => { props.timeCompleted(false) }}
                    textStyle={{ fontSize: 30 }}
                    contentStyle={{ padding: 2 }}
                    animate={false} />
                <Text style={{ color: Theme.RED_COLOR, fontSize: Theme.FONT_SIZE_SMALL, textAlign: "center" }}>{`Time left to make the payment`}</Text>
                {/* <Text style={{ color: Theme.RED_COLOR, fontSize: Theme.FONT_SIZE_SMALL, textAlign: "center" }}>{`You have ${data.customer_time_limit} hours to make payment for this trip`}</Text> */}
            </View>}
            {props.cardButton && <View style={{ height: 40, flex: 1, justifyContent: "center" }}>
                <Button onPress={() => props.cardButton()} styleButton={{ alignSelf: "center", height: 35, width: "80%" }} styleText={{ fontSize: Theme.FONT_SIZE_MEDIUM }} >{props.cardButtonText}</Button>
            </View>}
        </View>
    );

    const cardContent = (
        <View style={[styles.container, getBlockStyle()]}>
            <OfferCardContent {...props} notAvailable={notAvailable} notShowBlock={notShowBlock} AdditionalData={AdditionalData} />
        </View>);

    return (
        <View style={{}}>
            {props.onPress ?
                props.platform === 'android' ? <TouchableNativeFeedback onPress={notAvailable ? null : props.onPress}>
                    {cardContent}
                </TouchableNativeFeedback> :
                    <TouchableOpacity onPress={notAvailable ? null : props.onPress}>
                        {cardContent}
                    </TouchableOpacity>
                : cardContent}
        </View>
    );
};

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        driverDetails: state.user.driverDetails,
        platform: state.util.platform
    };
};


export default connect(mapStateToProps)(OfferCard);

const styles = StyleSheet.create({
    container: {
        // flexDirection: "row",
        justifyContent: "center",
        backgroundColor: Theme.WHITE_COLOR,
        elevation: 5,
        // zIndex: 1
    },
    containerRadius: {
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 5,
    },
});

