import React, { Fragment } from 'react';
import { StyleSheet, View, Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import timeConverter from '../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../time/datetimeConventer';
import Text from '../text/TextWithStyle';
import TripCardContent from './TripCardContent';
import Button from './../button/Button';
import currencyFormat from './../currency/currencyFormat';
import { connect } from 'react-redux';

const TripCard = (props) => {
    const data = props.data;
    const index = props.index;
    // const isExpired = props.isExpired;
    const isBooked = (data.is_booked == true);
    const notShowBlock = (!props.showBlock);
    const notAvailable = (isBooked || props.isExpired == true);
    // console.warn(props)

    const getBlockStyle = () => {
        return notShowBlock ? styles.containerRadius : null;
    }

    const AdditionalData = (
        // <View style={{ borderTopWidth: 1, borderTopColor: Theme.BORDER_COLOR_OPACITY }}>
        <View style={{}}>
            {props.chkDetails && <View style={{ height: 30, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ flex: 1, textAlign: "right", color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }}>Bid Amount: <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, color: Theme.BLACK_COLOR }}>Php {currencyFormat(data.payment)}</Text></Text>
            </View>}
            {(props.chkDetails || props.retrieveBid) && <View style={{ flex: 1, height: 50, flexDirection: "row", alignItems: "center", paddingBottom: 10 }}>
                {props.retrieveBid && <TouchableOpacity onPress={() => props.retrieveBid()}><Text style={{ color: Theme.BLUE_COLOR, fontSize: Theme.FONT_SIZE_SMALL, borderBottomWidth: 1, borderBottomColor: Theme.BLUE_COLOR }}>RETRIEVE BID</Text></TouchableOpacity>}
                {props.chkDetails && <View style={{ flex: 1, }}>
                    <Button onPress={() => props.chkDetails()} styleButton={{ alignSelf: "flex-end", height: 35, width: 100 }} styleText={{ fontSize: Theme.FONT_SIZE_MEDIUM }} >{props.chkDetailsBtnText}</Button>
                </View>}
            </View>}
        </View>
        // </View>
    );

    const cardContent = (
        <View style={[styles.container, getBlockStyle(), props.platform === 'ios' && { zIndex: 100, shadowOffset: { width: 0, height: 2 }, shadowColor: 'black', shadowOpacity: 0.5, }]}>
            <TripCardContent {...props} notAvailable={notAvailable} isBooked={isBooked} notShowBlock={notShowBlock} AdditionalData={AdditionalData} />
        </View>);

    return (
        <View style={{ marginTop: index == 0 ? 15 : 0 }}>
            {props.onPress ? props.platform === 'android' ?
                <TouchableNativeFeedback onPress={notAvailable ? null : props.onPress}>
                    {cardContent}
                </TouchableNativeFeedback>
                :
                <TouchableOpacity onPress={notAvailable ? null : props.onPress}>
                    {cardContent}
                </TouchableOpacity>
                : cardContent}
            {/* {props.onPress ? <TouchableNativeFeedback onPress={notAvailable ? null : props.onPress}>
                <View>{cardContent}</View>
            </TouchableNativeFeedback> : cardContent} */}
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


export default connect(mapStateToProps)(TripCard);

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
