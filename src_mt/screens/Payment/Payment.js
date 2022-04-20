import React, { Fragment, useState, useEffect, Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    Pressable,
} from 'react-native';
import Theme from '../../Theme/Theme';
import Button from '../../components/button/Button';
import Text from '../../components/text/TextWithStyle';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { contractTrip, updateMyTripDetails } from '../../../store/actions/dataAction';
import { connect } from "react-redux";
import { CommonActions, StackActions } from '@react-navigation/native';
import LoaderModal from '../../components/modal/LoaderModal';
import currencyFormat from './../../components/currency/currencyFormat';
import { addMyTripDetails, updateTripDetails } from './../../../store/actions/dataAction';
import localNotification from './../../components/util/localNotification';
import { setNotificationVisible } from './../../../store/actions/utilAction';
import { pushSeenQuoteId } from './../../../store/actions/seenAction';
import TripNameFormat from './../../components/util/TripNameFormat';
import PushNotification from 'react-native-push-notification';
import TripCard from '../../components/card/TripCard';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyTrips from '../Passenger/MyTrips';


const Payment = (props) => {
    // const [index, setIndex] = React.useState(0);
    const item_details = props.route.params?.item;
    const request_details = props.route.params?.request_details;

    const [customer_options, setCustomer_options] = React.useState(null);

    useEffect(() => {

        // setJobs_detail();
        return () => {
            props.updateMyTripDetails("driverConfirmation", { quote_id: item_details.quote_id, request_id: request_details.request_id })
        };
        // console.log(props.userData);
    }, [])

    useEffect(() => {
        // console.log(item_details)
        // console.log("payment req", request_details);

        let tempDetails = "";
        for (let i = 1; i <= 8; i++) {
            if (request_details[`opt_${i}_val`] == true) {
                tempDetails += `${request_details[`opt_${i}`]}, `;
            }
        }
        setCustomer_options(tempDetails.replace(/. $/, "."));
        // push quote_id to seen list
        item_details.isNew == true && props.pushSeenQuoteId("seenDriverConfirmation", item_details.quote_id);

    }, [])

    const navigateScreen = (screen, params) => {
        props.navigation.navigate(screen, params)
    }

    const paymentMethods = [
        { name: 'Wallet' },
        { name: 'GCash' },
        { name: 'Paypal' },
        { name: 'InstaPay' },
    ]

 

    const [selectedMethod, setSelectedMethod] = useState(null)

    const resetNavigateScreen = (screen, params = {}) => {

        const resetAction = CommonActions.reset({
            index: 2,
            routes: [
                { name: 'MyTrips' },
                { name: 'MyTripDetail', params: { trip: request_details } },
                { name: "Contract", params: params },
            ],
        });
        // props.navigation.pop(2)
        props.navigation.dispatch(resetAction);
    }

    const tripPaid = () => {
        let data = {
            customer_name: props.userData.name,
            user_id: request_details.user_id,
            request_id: request_details.request_id,
            quote_id: item_details.quote_id,
            driver_id: item_details.driver_id,
            vehicle_id: item_details.vehicle_id,
            type: request_details.type,
            status: "booked",
            driver_name: item_details.name,
            car_name: item_details.vehicle_name,
            payment: item_details.payment,
            no_of_seats: request_details.no_of_seats,
            source: request_details.source,
            source_detail: request_details.source_detail,
            source_coordinate: request_details.source_coordinate,
            destination: request_details.destination,
            destination_detail: request_details.destination_detail,
            destination_coordinate: request_details.destination_coordinate,
            multi_stop: request_details.multi_stop,
            multi_stop_coordinate: request_details.multi_stop_coordinate,
            departure_date: request_details.departure_date,
            return_date: request_details.return_date,
            driver_stay: request_details.driver_stay,
            customer_notes: request_details.customer_notes,
            driver_notes: item_details.driver_notes,
            customer_options: customer_options,
            driver_conditions: item_details.driver_conditions,
            driver_time_limit: item_details.driver_time_limit,
            trip_path: request_details.trip_path,
            trip_distance: request_details.trip_distance,
            trip_time: request_details.trip_time,
            // tokens: item_details.tokens.split(','),
            requested_at: request_details.requested_at,
            quoted_at: item_details.quoted_at,
            customer_confirm_at: item_details.customer_confirm_at,
            driver_confirm_at: item_details.driver_confirm_at,

            // wallet Transaction Data
            walletId: props.walletData.id,
            walletType: selectedMethod,
            walletMethod: 'TRANSFER',
            walletStatus: 'Success',

        }

        // console.log(data);

        props.contractTrip(data).then(dataResp => {
            props.addMyTripDetails(dataResp);
            // navigateScreen("MyTripDetail", { insertId: dataResp.insertId, trip: request_details });
            resetNavigateScreen("Contract", { request_details });
            localNotification("", "", { id: "0", tag: data.request_id.toString(), timeoutAfter: 500, priority: "min", importance: "min" })
            // localNotification("Congrats", `We have received Php ${item_details.payment} as advanced payment for your trip. We’ll send an invoice to your email.`, {request_id: data.request_id, transaction_notification: "true", status: data.status});

            let notiData = {
                modalVisible: true,
                title: "Thank you!",
                message: `We have received Php ${item_details.payment} as advanced payment for your ${TripNameFormat(request_details.destination)}. We sent a copy of the invoice & contract to your email.`,
                btnText: "View Contract Now",
                request_id: data.request_id,
                status: data.status,
            }
            // props.setNotificationVisible(notiData);
        })
    }

    return (
        <Fragment>
            <StatusBar barStyle="light-content" />
            {/* show a loader when any activity in process */}
            {props.route.name === "Payment" && <LoaderModal modalVisible={props.loading} />}

            <ScrollView style={{ flex: 1 }}>
                {/* TRIP DETAIL CARD */}
                {request_details !== null && <TripCard
                    key={request_details.request_id}
                    data={{ ...request_details }}
                    showBlock={true}
                    ContainerStyle={{ backgroundColor: Theme.BORDER_COLOR_OPACITY }}
                />}


                <View style={{ flex: 1, marginHorizontal: 15, marginTop: 15 }}>
                    {/* payment Details Info */}
                    <TouchableOpacity onPress={() => { navigateScreen("CancellationPolicy") }} style={{ marginBottom: 15, flexDirection: "row" }}>
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 5 }}>Cancellation Policy</Text>
                            <Text style={{ color: Theme.BORDER_COLOR, }}>You can not cancel this trip, with prior notice.</Text>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: "center", alignItems: 'center' }}>
                            <Ionicons name={'chevron-forward'} size={25} color={Theme.SECONDARY_COLOR} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: hp(20), marginBottom: 15, }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 10 }}>Payment Break Up</Text>
                        <View style={{ flexDirection: "row", marginBottom: 8 }}>
                            <Text style={{ flex: 1, color: Theme.BORDER_COLOR }}>{request_details.type}</Text>
                            <Text style={{ flex: 1, color: Theme.BORDER_COLOR, }}>PHP {currencyFormat(item_details.payment)}</Text>
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
                            <Text style={{ flex: 1, color: Theme.BORDER_COLOR, }}>PHP {currencyFormat(item_details.payment)}</Text>
                        </View>
                    </View>
                    {/* payment detail info End */}
                    <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM, marginVertical: 10 }}>Select Payment Method</Text>
                    {paymentMethods.map((item, index) =>
                        <Pressable android_ripple={{ radius: 1000 }} key={index} disabled={item.name == 'Wallet' && props.walletData.amount < item_details.payment} onPress={() => setSelectedMethod(item.name)} style={[payItemStyle(selectedMethod, item), payItemDisabledStyle(item, item_details, props.walletData)]}>
                            <Text style={payItemTextStyle(selectedMethod, item)} >{item.name} {item.name == 'Wallet' && `( Php ` + currencyFormat(props.walletData.amount) + ` )`}</Text>
                        </Pressable>
                        // <TouchableOpacity onPress={()=>setValue('selectedMethod', item.name)} style={{ height: hp(7), flexDirection: "row", alignItems: "center", justifyContent: "center", elevation: 1, backgroundColor: selectedMethod == item.name ? Theme.SECONDARY_COLOR : Theme.WHITE_COLOR, borderRadius: 5, margin: 5 }}>
                        //     <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: selectedMethod == item.name ? Theme.WHITE_COLOR : Theme.BLACK_COLOR }} >{item.name}</Text>
                        // </TouchableOpacity>
                    )}

                    {selectedMethod != null && <View style={{ height: hp(20), justifyContent: "center" }}>
                        <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 5, alignSelf: 'center' }} numberOfLines={2}>Proceed to payment <Text style={{ color: Theme.BORDER_COLOR }}>Php</Text> <Text style={{}}>{currencyFormat(item_details.payment)}</Text></Text>
                        <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, fontFamily: Theme.FONT_FAMILY_BOLD, marginBottom: 20, alignSelf: 'center' }} numberOfLines={2}>for your booking</Text>
                        <Button disabled={props.loading} styleButton={{ width: "100%", alignSelf: 'center' }} onPress={() => tripPaid()}>PAY</Button>
                    </View>}
                </View >
            </ScrollView>
        </Fragment >
    );
}

const payItemStyle = (selectedMethod, item) => {
    return { height: hp(7), flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: selectedMethod == item.name ? Theme.SECONDARY_COLOR : Theme.BORDER_COLOR_OPACITY, borderRadius: 5, margin: 5 }
}

const payItemDisabledStyle = (item, item_details, walletData) => {
    const disabled = (item.name == 'Wallet' && walletData.amount < item_details.payment);
    return { backgroundColor: disabled ? Theme.BORDER_COLOR_OPACITY : Theme.WHITE_COLOR, opacity: disabled ? 0.3 : null }
}

const payItemTextStyle = (selectedMethod, item) => {
    return { fontSize: Theme.FONT_SIZE_MEDIUM, color: selectedMethod == item.name ? Theme.SECONDARY_COLOR : Theme.BLACK_COLOR }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    itemView: {
        flex: 0.1,
        borderBottomColor: Theme.BORDER_COLOR,
        borderBottomWidth: 1,
        flexDirection: "row",
        marginHorizontal: 20
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR
    },
});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        walletData: state.user.walletData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        contractTrip: (data) => dispatch(contractTrip(data)),
        addMyTripDetails: (data) => dispatch(addMyTripDetails(data)),
        setNotificationVisible: (data) => dispatch(setNotificationVisible(data)),
        pushSeenQuoteId: (name, quoteId) => dispatch(pushSeenQuoteId(name, quoteId)),
        updateMyTripDetails: (type, data) => dispatch(updateMyTripDetails(type, data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);