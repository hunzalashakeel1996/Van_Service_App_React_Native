/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import Theme from '../../Theme/Theme';
import Text from './../../components/text/TextWithStyle';
import Button from './../../components/button/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TripCard from './../../components/card/TripCard';
import OfferCard from './../../components/card/OfferCard';
import currencyFormat from './../../components/currency/currencyFormat';
import OutlineButton from '../../components/button/OutlineButton';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Contract = (props) => {

    // const [activeSlide, setActiveSlide] = useState(0);
    const request_details = props.route.params?.request_details;
    const contract_detail = props.trips["MT" + request_details.request_id].data.contract[0];

    useEffect(() => {
    }, [])

    const navigateScreen = (screen, params) => {
        props.navigation.navigate(screen, params)
    }


    return (
        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={{ flex: 1 }}>
                    <View style={{ marginBottom: 15 }}>
                        <TripCard data={{ ...request_details }} showBlock={true} ContainerStyle={{ backgroundColor: Theme.BORDER_COLOR_OPACITY }} />
                        {/* </View> */}
                        {/* <View style={{ height: hp(15) }}> */}
                        <OfferCard data={{ ...contract_detail }} showBlock={true} ContainerStyle={{ backgroundColor: Theme.WHITE_COLOR }} />
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <View style={{ marginBottom: 0 }}>
                            {contract_detail.driver_notes !== "" && <View style={{ marginBottom: 8 }}>
                                <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 5 }}>Driver Notes</Text>
                                <Text style={{ color: Theme.BORDER_COLOR, }}>{contract_detail.driver_notes}</Text>
                            </View>}
                            {request_details.customer_notes !== "" && <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 5 }}>Customer Notes</Text>
                                <Text style={{ color: Theme.BORDER_COLOR, }}>{request_details.customer_notes}</Text>
                            </View>}
                        </View>
                        <TouchableOpacity onPress={() => { navigateScreen("CancellationPolicy") }} style={{ marginBottom: 15, flexDirection: "row" }}>
                            <View style={{ flex: 0.9, justifyContent: "center" }}>
                                <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 5 }}>Cancellation Policy</Text>
                                <Text style={{ color: Theme.BORDER_COLOR, }}>You can not cancel this trip, with prior notice.</Text>
                            </View>
                            <View style={{ flex: 0.1, justifyContent: "center", alignItems: 'center' }}>
                                <Ionicons name={'chevron-forward'} size={25} color={Theme.SECONDARY_COLOR} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 10 }}>Payment Break Up</Text>
                            <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR }}>{request_details.type}</Text>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR, }}>PHP {currencyFormat(contract_detail.payment)}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR }}>Add Stop</Text>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR, }}>PHP -</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR }}>Fuel</Text>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR, }}>PHP -</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginBottom: 8 }}>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR }}>Total</Text>
                                <Text style={{ flex: 1, color: Theme.BORDER_COLOR, }}>PHP {currencyFormat(contract_detail.payment)}</Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, color: Theme.BLUE_COLOR, marginBottom: 5, textDecorationLine: "underline" }}>Terms and condition</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginBottom: 10, justifyContent: "space-around" }}>
                            <Text style={{ flex: 0.3, width: wp(35), fontFamily: Theme.FONT_FAMILY_BOLD, alignSelf: "center" }}>Need Help ?</Text>
                            <OutlineButton onPress={() => props.navigation.navigate('PassengerDuringTrip', { request_details })} outlineColor={Theme.BLACK_COLOR} styleButton={{ flex: 0.25, height: 30 }}>Call</OutlineButton>
                            <OutlineButton outlineColor={Theme.BLACK_COLOR} styleButton={{ flex: 0.25, height: 30 }}>Chat</OutlineButton>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Fragment >
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: Theme.FONT_SIZE_XSMALL,
        color: Theme.SECONDARY_COLOR,
    },
    iconTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 15,
        height: 15
    },
    text: {
        color: Theme.BORDER_COLOR,
        fontSize: Theme.FONT_SIZE_XSMALL
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR
    },
});

const mapStateToProps = state => {
    return {
        // loading: state.ui.isLoading,
        // userData: state.user.userData,
        trips: state.data.trips
    };
};

export default connect(mapStateToProps, null)(Contract);