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
    Dimensions, Alert
} from 'react-native';
import Theme from '../../Theme/Theme';
import Button from '../../components/button/Button';
import Rating from '../../components/rating/Rating';
import Text from './../../components/text/TextWithStyle';
import Slider from './../../components/slider/Slider';
import LoaderModal from './../../components/modal/LoaderModal';
import { connect } from "react-redux";
import { requestTripStatus, uploadUrl } from '../../../store/actions/dataAction';
import { formatDatetime, calcTimeDifference } from '../../components/time/datetimeConventer';
import currencyFormat from './../../components/currency/currencyFormat';
import TripCard from './../../components/card/TripCard';
import UserInfoCard from '../../components/card/UserInfoCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { addMyTripDetails } from './../../../store/actions/dataAction';
import localNotification from './../../components/util/localNotification';
import { setNotificationVisible } from './../../../store/actions/utilAction';
import { pushSeenQuoteId } from './../../../store/actions/seenAction';
import { updateMyTripDetails } from './../../../store/actions/dataAction';
import { CommonActions, StackActions } from '@react-navigation/native';
// import { updateMyTripRequestStatus } from './../../../store/actions/dataAction';
const { width: screenWidth } = Dimensions.get('window')

const BookDriver = (props) => {

    const getSlides = [];
    const [slides, setSlides] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [offer, setOffer] = useState({});
    const [loader, setLoader] = useState(false);
    const offerIndex = props.route.params?.index;
    const segmentType = props.route.params?.segment;
    const request_details = props.route.params?.request_details;
    const data = props.route.params?.data;
    const pushSeen = props.route.params?.pushSeen;
    const updateSeen = props.route.params?.updateSeen;

    // const [request_trip_timeDiff, setRequest_trip_timeDiff] = React.useState(null);

    useEffect(() => {

        // setJobs_detail();
        return () => {
            props.updateMyTripDetails(updateSeen, { quote_id: data.quote_id, request_id: request_details.request_id })
        };
        // console.log(props.userData);
    }, [])

    useEffect(() => {
        // setRequest_trip_timeDiff(calcTimeDifference(request_details.requested_at, request_details.departure_date))
        // let data = props.route.params?.data;
        let tempSlides = [];
        for (let i = 1; i <= 8; i++) {
            if (data['car_image' + i] != null) {
                tempSlides.push(data['car_image' + i])
            }
        }
        setOffer(data);
        setSlides(tempSlides);

        // push quote_id to seen list
        data.isNew == true && props.pushSeenQuoteId(pushSeen, data.quote_id);

        setLoader(false);

    }, [])

    const navigateScreen = (screen, params) => {
        props.navigation.navigate(screen, params)
    }

    // const getSeenStatus = (status) => {
    //     if (status === 'pending') {
    //         return {pushSeen: 'seenOffers', updateSeen: 'offers'}
    //     } else if (status === 'confirm_booking') {

    //     } else if (status === 'booking_accepted') {

    //     } else if (status === 'booked') {

    //     }
    // }
    const resetNavigateScreen = (screen, params = {}) => {

        const resetAction = CommonActions.reset({
            index: 1,
            routes: [
                { name: 'MyTrips' },
                { name: screen, params: params },
            ],
        });
        props.navigation.dispatch(resetAction);
    }

    const bookNowDriver = (status) => {
        setLoader(true);

        let data_status = {
            request_id: offer.request_id,
            quote_id: offer.quote_id,
            driver_id: offer.driver_id,
            user_id: offer.user_id,
            driver_name: offer.name,
            customer_name: props.userData.name,
            status,
            departure_date: request_details.departure_date,
            destination: request_details.destination,
            // tokens: data.tokens.split(','),
        }
        props.requestTripStatus(data_status)
            .then(res => {
                if (res.err) {
                    Alert.alert("Alert", res.err)
                }
                //update trip details and dispatch it to update props
                // let updateTripDetails = {
                //     ...offer,
                //     ...res
                // }
                // console.log('updateTripDetails', res);
                props.addMyTripDetails(res);
                resetNavigateScreen('MyTripDetail', { trip: request_details })
                // localNotification("Thanks", `Thanks for choosing ${offer.name}! Kindly wait for the driver confirmation.`, {request_id: data_status.request_id, driver_id: data_status.driver_id, transaction_notification: "true", status});
                let notiData = {
                    modalVisible: true,
                    title: "Wohoo!",
                    message: `Thanks for choosing ${offer.name}! Driver has 24 hours to confirm his availability.`,
                    btnText: 'Okay',
                    request_id: offer.request_id,
                    driver_id: data_status.driver_id,
                    status,
                }
                // props.setNotificationVisible(notiData);

                // props.updateMyTripRequestStatus(notiData);
                setLoader(false);

            })
    }

    const payTrip = () => {
        // console.log("payment, offer details", offer)
        navigateScreen("Payment", { item: offer, request_details })
    }

    const monthDiff = (date) => {
        let months;
        let d2 = new Date();
        months = (d2.getFullYear() - date.getFullYear()) * 12;
        months -= date.getMonth() + 1;
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    const _renderItem = ({ item, index }) => {
        return (
            <View style={{}}>
                <Image style={{ width: "100%", height: "100%", resizeMode: "contain", borderRadius: 2 }} source={{ uri: `${uploadUrl}/${item}` }} />
                {/* <Text style={styles.title}>{ item.title }</Text> */}
            </View>
        );
    }

    return (
        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
            {/* show a loader when any activity in process */}
            {<LoaderModal modalVisible={loader} />}
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={{ flex: 1 }}>

                    {/* <View style={{ flex: 1, marginVertical: 5 }}> */}
                    {<TripCard data={{ ...request_details }} showBlock={true} ContainerStyle={{ backgroundColor: Theme.BORDER_COLOR_OPACITY }} />}
                    <UserInfoCard data={{ ...offer }} />

                    <View style={{ height: hp(25), marginVertical: 10 }}>
                        {slides != null && <Slider
                            data={slides}
                            renderItem={_renderItem}
                            activeSlide={activeSlide}
                            setActiveSlide={(item) => { setActiveSlide(item) }} />}
                    </View>
                    <View style={{ height: hp(12), justifyContent: 'space-evenly', marginHorizontal: 15, marginBottom: 5 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ flex: 1, color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }} numberOfLines={1}><Text style={styles.blackText}>{offer.vehicle_name}</Text></Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ flex: 0.3, color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Year: <Text style={styles.blackText}>{offer.year}</Text></Text>
                            <Text style={{ flex: 0.3, color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Color: <Text style={styles.blackText}>{offer.color}</Text></Text>
                            <Text style={{ flex: 0.4, color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Plate: <Text style={styles.blackText}>{offer.registration_number}</Text></Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <View style={[styles.iconTextContainer, { flex: 1 }]}>
                                <View style={{ flex: 0.2 }}>
                                    <Image style={styles.icon} source={require('../../../assets/passenger/seats.png')} />
                                </View>
                                <Text style={[styles.text, { flex: 0.8 }]}>Seats <Text style={styles.text}>({offer.vehicle_no_of_seats})</Text></Text>
                            </View>
                            <View style={[styles.iconTextContainer, { flex: 1 }]}>
                                <View style={{ flex: 0.2 }}>
                                    <Image style={styles.icon} source={require('../../../assets/passenger/ac.png')} />
                                </View>
                                <Text style={[styles.text, { flex: 0.8 }]}>A/C <Text style={styles.text}>{offer.aircon}</Text></Text>
                            </View>
                            <View style={[styles.iconTextContainer, { flex: 1 }]}></View>
                        </View>

                    </View>
                    {offer.driver_notes != "" && <View style={{ marginHorizontal: 15, marginBottom: 5 }}>
                        <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }} numberOfLines={2}>Driver Note: <Text style={styles.blackText}>{offer.driver_notes}</Text></Text>
                    </View>}
                    {/* <View style={{ flex: 0.1, justifyContent: "center", marginHorizontal: 15 }}>
                    <Text style={{ textAlign: "center", color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_XLARGE }}>Price: <Text style={[styles.boldText, { color: Theme.PRIMARY_COLOR }]}>{`Php ${currencyFormat(offer.payment)}`}</Text></Text>
                </View> */}
                    {(!segmentType && offer.payment) && <View style={{ alignItems: "center", marginVertical: 5 }}>
                        <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, fontFamily: Theme.FONT_FAMILY_BOLD }} numberOfLines={2}>Total price of offer <Text style={{ color: Theme.BORDER_COLOR }}>Php</Text> <Text style={{}}>{currencyFormat(offer.payment)}</Text></Text>
                    </View>}
                    <View style={{ height: hp(8), justifyContent: "center", marginHorizontal: 15, }}>
                        {segmentType && <Button
                            onPress={() => offer.driver_time_limit == null ? payTrip() : bookNowDriver('confirm_booking')}>
                            {`${offer.driver_time_limit == null ? 'PAY' : 'BOOK'} NOW at Php ${currencyFormat(offer.payment)}`}</Button>}

                        {!segmentType && <Button onPress={() => props.navigation.goBack(null)}>{`CLOSE`}</Button>}
                    </View>
                    {(segmentType && segmentType != "interested") && <View style={{ height: hp(5), justifyContent: "space-around", alignItems: "center", flexDirection: "row", marginHorizontal: 15 }}>
                        <TouchableOpacity style={{}} onPress={() => { navigateScreen('ViewOffers', { data: { item: offer, index: offerIndex, type: "interested" } }) }}>
                            <Text style={{ textAlign: "center", borderBottomWidth: 1, borderColor: Theme.BLUE_COLOR }}>Interested</Text>
                            {/* <Button styleButton={{ backgroundColor: Theme. BORDER_COLOR, height: 35 }} >Interested</Button> */}
                        </TouchableOpacity>

                        <TouchableOpacity style={{}} onPress={() => { navigateScreen('ViewOffers', { data: { item: offer, index: offerIndex, type: "ignored" } }) }}>
                            <Text style={{ textAlign: "center", borderBottomWidth: 1, borderColor: Theme.BLUE_COLOR }}>Ignored</Text>
                            {/* <Button styleButton={{ backgroundColor: Theme.BORDER_COLOR, height: 35 }} >Ignore</Button> */}
                        </TouchableOpacity>
                    </View>}
                    {/* </View> */}
                </ScrollView>
            </SafeAreaView>
        </Fragment >
    );
};

const styles = StyleSheet.create({

    text: {
        fontSize: Theme.FONT_SIZE_SMALL,
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
        fontSize: Theme.FONT_SIZE_SMALL
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR
    },
    blackText: {
        color: Theme.BLACK_COLOR
    },
});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        requestTripStatus: (data) => dispatch(requestTripStatus(data)),
        addMyTripDetails: (data) => dispatch(addMyTripDetails(data)),
        setNotificationVisible: (data) => dispatch(setNotificationVisible(data)),
        // updateMyTripRequestStatus: (data) => dispatch(updateMyTripRequestStatus(data)),
        pushSeenQuoteId: (name, quoteId) => dispatch(pushSeenQuoteId(name, quoteId)),
        updateMyTripDetails: (type, quoteId) => dispatch(updateMyTripDetails(type, quoteId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookDriver);