import React from 'react';
import { StyleSheet, View, Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';
import timeConverter from '../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../time/datetimeConventer';
import Text from '../text/TextWithStyle';
import TripCard from './TripCard';
import OfferCard from './OfferCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OutlineButton from './../button/OutlineButton';
import { connect } from 'react-redux';

const DriverContractCard = (props) => {
    const data = props.data;
    const index = props.index;
    
    return (
        <View style={{ flex: 1, marginTop: index == 0 ? 15 : 0, marginVertical: 10, marginHorizontal: 15, borderWidth: 1, borderColor: Theme.BORDER_COLOR_OPACITY }}>
            {props.platform === 'android' ? <TouchableNativeFeedback onPress={props.onPress}>
                <View style={{zIndex: 1}}>
                    <TripCard data={data} showBlock={true} ContainerStyle={{ backgroundColor: "#e4e4e4" }} />
                    <OfferCard data={data} showBlock={true} ContainerStyle={{ backgroundColor: Theme.WHITE_COLOR }}/>
                </View>
            </TouchableNativeFeedback>
            :
            <TouchableOpacity onPress={props.onPress}>
                <View style={{zIndex: 1}}>
                    <TripCard data={data} showBlock={true} ContainerStyle={{ backgroundColor: "#e4e4e4" }} />
                    <OfferCard data={data} showBlock={true} ContainerStyle={{ backgroundColor: Theme.WHITE_COLOR }}/>
                </View>
            </TouchableOpacity>}
            <View style={{ flexDirection: "row" }}>
                <OutlineButton  outlineColor={Theme.BORDER_COLOR} styleButton={{ width: "50%", height: 40, borderRadius: 1 }}>Call</OutlineButton>
                <OutlineButton outlineColor={Theme.BORDER_COLOR} styleButton={{ width: "50%", height: 40, borderRadius: 1  }}>Chat</OutlineButton>
            </View>
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


export default connect(mapStateToProps)(DriverContractCard);

const styles = StyleSheet.create({
    container: { 
        flexDirection: "row",
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
    isNew: {
        backgroundColor: "#e4e4e4"
    },
    isBooked: {
        backgroundColor: "#e4e4e4"
    },
    button: {
        width: '100%',
        // height: 45,
        flex: 0.7,
        backgroundColor: Theme.RED_COLOR,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    borderShadow: {
        backgroundColor: Theme.WHITE_COLOR,
        elevation: 5,
    },

    text: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_MEDIUM,
    },
    textSmall: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_SMALL,
    },
    icon: {
        width: 15,
        height: 15
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_MEDIUM,

    },
    boldTextSmall: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_SMALL,

    },
    blackText: {
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_MEDIUM,
    },
    iconTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
