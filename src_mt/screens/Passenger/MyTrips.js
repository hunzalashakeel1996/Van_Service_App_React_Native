/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    FlatList, TouchableHighlight, RefreshControl
} from 'react-native';
import Theme from '../../Theme/Theme';
import Segment from '../../components/segment/Segment';
import TripCard from '../../components/card/TripCard';
import Text from './../../components/text/TextWithStyle';
import { connect } from "react-redux";
import { getMTTrips, addMyTripDetails, setTripRequests, getMyTripDetails } from "../../../store/actions/dataAction";
// import LoaderModal from './../../components/modal/LoaderModal';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import { isActiveChk } from '../../components/util/isChk';
import { connectSocket, socketClose } from '../../../store/actions/socketAction';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyTrips = (props) => {

    const [trips, setTrips] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    // const [loader, setLoader] = useState(true);

    useEffect(() => {
        // socket to change trip_status

        console.warn("test")
        return () => {
            // props.socketClose();

            // loader && setLoader(false);
            // console.warn("ScheduleTrip unMount")
        };
    }, [])

    useEffect(() => {
        sortTrips();

    }, [props.trips])

    const sortTrips = () => {
        console.warn("inside use effect")
        let sortTrips = Object.values(props.trips).reverse();
        let tempTrips = [];
        // console.warn("inside use effect", props.trips)

        sortTrips.map((trip) => {
            // if (trip.trip_status !== null)
            //     trip = { ...trip, upcomingTrip: true }
            if (trip.trip_status !== null && trip.trip_status != "Completed") {
                tempTrips.unshift({ ...trip, upcomingTrip: true });
            } else {
                tempTrips.push(trip.trip_status === "Completed" ? { ...trip, upcomingTrip: true } : trip)
            }
        })
        setTrips(tempTrips);
    }

    const getMTTrips = () => {
        // props.socket.off('onTripStatusChange').on('onTripStatusChange', (socketData) => {
        //     let tempTrips = []
        //     trips.map((trip) => {
        //         // if (trip.request_id === data.request_id)
        //         //     tempTrip[index] = { ...tempTrip[index], upcommingTrip: true, trip_status: data.trip_status }
        //         if (trip.request_id == socketData.data.request_id && trip.isActive) {
        //             tempTrips.unshift({ ...trip, upcomingTrip: true, trip_status: socketData.data.trip_status });
        //         } else {
        //             tempTrips.push(trip)
        //         }
        //     })

        //     setTrips(tempTrips)
        //     // props.setTripRequests(tempTrips);
        // })
        setRefreshing(true)
        props.getMyTripDetails(props.userData.id).then(trips => {
            setRefreshing(false)
        });
        // props.getMTTrips(props.userData.id).then(trips => {
        //     props.setTripRequests(trips);
        //     setRefreshing(false)
        // })
    }


    const navigateScreen = (screen, data) => {
        props.navigation.navigate(screen, data)
    }

    const filterData = (data) => {
        let newData = data.filter(item => item.isNew == true)
        return newData.length;
    }

    return (
        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => getMTTrips()} colors={[Theme.SECONDARY_COLOR,Theme.PRIMARY_COLOR]} />
                        }
                        data={trips}
                        // data={Object.values(props.trips)}
                        renderItem={({ item, index }) => {
                            item.isActive = isActiveChk(item.departure_date)
                            item.newOffers = item.data.offers.length > 0 ? filterData(item.data.offers) : 0;
                            item.newDriverConfirmation = item.data.driverConfirmation.length > 0 ? filterData(item.data.driverConfirmation) : 0;
                            item.allOffers = item.data.offers.length - item.newOffers;
                            item.allDriverConfirmation = item.data.driverConfirmation.length - item.newDriverConfirmation;
                            return (<TripCard
                                key={item.request_id}
                                data={{ ...item }}
                                showStatus={true}
                                datetime={item.requested_at}
                                index={index}
                                isExpired={(item.trip_status == null ? item.isActive == false : false)}
                                onPress={() => { let trip = { ...item }; delete trip.data; item.upcomingTrip ? navigateScreen('PassengerDuringTrip', { request_details: trip }) : navigateScreen('MyTripDetail', { trip: trip }) }} />)
                        }}
                        keyExtractor={item => item.request_id.toString()}
                        // ListEmptyComponent={<View style={{marginVertical: 5, alignItems: "center"}}><Text>{refreshing ? `Fetching Records` :`No Records Found!`}</Text></View>}
                        ListFooterComponent={<View style={{ marginVertical: 5, marginHorizontal: 20 }}><Text style={{ textAlign: "center" }}>Our partner drivers are reviewing your travel order/s. Kindly wait for several bids. We'll notify you promptly so you can check the offers, soon.</Text></View>}

                    />
                </SafeAreaView>
            </View>
        </Fragment >
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
    },
    text: {
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.SECONDARY_COLOR,
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        // backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
        padding: 25,
        borderRadius: 10,
        marginVertical: 5,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        // backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginVertical: 5,
        marginHorizontal: 15,
    },
    backRightBtn: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backLeftBtn: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backRightBtnLeft: {
        backgroundColor: Theme.RED_COLOR,
        left: 0,
    },
    backRightBtnRight: {
        backgroundColor: Theme.SECONDARY_COLOR,
        right: 0,
    },
    controls: {
        alignItems: 'center',
        marginBottom: 30,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: 100,
    },
});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        socket: state.socket.socket,
        tripRequests: state.data.tripRequests,
        trips: state.data.trips,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getMTTrips: user_id => dispatch(getMTTrips(user_id)),
        getMyTripDetails: user_id => dispatch(getMyTripDetails(user_id)),
        socketClose: () => dispatch(socketClose()),
        connectSocket: (userId, dispatchFunc) => dispatch(connectSocket(userId, dispatchFunc)),
        setTripRequests: data => dispatch(setTripRequests(data)),
        addMyTripDetails: (data) => dispatch(addMyTripDetails(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTrips);