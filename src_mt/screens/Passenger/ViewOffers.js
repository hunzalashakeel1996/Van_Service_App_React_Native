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
    FlatList, TouchableHighlight
} from 'react-native';
import Theme from '../../Theme/Theme';
import Segment from '../../components/segment/Segment';
import OfferCard from '../../components/card/OfferCard';
import Text from './../../components/text/TextWithStyle';
import { connect } from "react-redux";
import { getOffers, updateTripDetails } from "../../../store/actions/dataAction";
import LoaderModal from './../../components/modal/LoaderModal';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import TripCard from '../../components/card/TripCard';
import { convertDatetime } from './../../components/time/datetimeConventer';
import TooltipModal from './../../components/modal/TooltipModal';
import { pushSeenQuoteId } from './../../../store/actions/seenAction';

const ViewOffers = (props) => {
    const getOffers = [];

    const [segment, setSegment] = useState("offers");
    const [offers, setOffers] = useState(getOffers);
    const [interested, setInterested] = useState([]);
    const [ignored, setIgnored] = useState([]);
    const [trip_timeDiff, setTrip_timeDiff] = useState(null);
    const seats = props.route.params?.seats;
    const request_details = props.route.params?.request_details;
    const offers_detail = props.trips["MT" + request_details.request_id].data.offers;

    // time limit for trip_timeDiff (if trip_timeDiff > time_limit) to active or inactive job
    const time_limit = 8;

    // useEffect(() => {

    //     // setJobs_detail();
    //     return () => {
    //         console.warn("TripDetails close")
    //         props.updateTripDetails('offers')
    //     };
    //     // console.log(props.userData);
    // }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            isFocused();
        });

        return unsubscribe;
    }, [props.navigation]);

    useEffect(() => {

        setTrip_timeDiff(-(convertDatetime(request_details.departure_date).hour_diff))
        AsyncStorage.multiGet(['interestedOffers', 'ignoredOffers']).then(values => {
            // setInterested(values[0][1] != null ? JSON.parse(values[0][1]) : []);
            // setIgnored(values[1][1] != null ? JSON.parse(values[1][1]) : []);
            let interestedStored = values[0][1] != null ? JSON.parse(values[0][1]) : [];
            let ignoredStored = values[1][1] != null ? JSON.parse(values[1][1]) : [];
            offersGet(interestedStored, ignoredStored);
        })

    }, [props.trips["MT" + request_details.request_id].data.offers])


    const offersGet = (interestedStored = interested, ignoredStored = ignored) => {
        // props.getOffers(request_details.id).then((data) => {
        // let newData = offers_detail.filter(val => val.no_of_seats >= seats);
        let newData = offers_detail;
        let interestedOffers = [];
        let ignoredOffers = [];

        let interestedIds = interestedStored.map(val => val.quote_id);
        let ignoredIds = ignoredStored.map(val => val.quote_id);

        let sortedOffers = newData.filter((offer) => {
            if (interestedIds.includes(offer.quote_id)) {
                interestedOffers.push(offer);
            } else if (ignoredIds.includes(offer.quote_id)) {
                ignoredOffers.push(offer);
            } else {
                return offer;
            }
        })

        setOffers(sortedOffers);
        setInterested(interestedOffers);
        setIgnored(ignoredOffers);
        // console.log(data);
        // })
    }

    const isFocused = () => {
        let data = props.route.params?.data;
        if (data) {
            pushToArray(data, data.type, offers)
        }

    }

    //push data to respective array and remove from that array data is coming from
    const pushToArray = (data, type, from) => {
        let off = [...from];
        off.splice(data.index, 1);

        if (type === 'interested') {
            AsyncStorage.multiSet([
                ["interestedOffers", JSON.stringify([...interested, data.item])],
                ['ignoredOffers', JSON.stringify(off)]
            ]).then(() => {
                setInterested([...interested, data.item])
            })
            from == ignored ? setIgnored(off) : setOffers(off);
        } else if (type === 'ignored') {
            AsyncStorage.multiSet([
                ["ignoredOffers", JSON.stringify([...ignored, data.item])],
                ['interestedOffers', JSON.stringify(off)]
            ]).then(() => {
                setIgnored([...ignored, data.item])
            })
            from == interested ? setInterested(off) : setOffers(off);
        }
    }

    const navigateScreen = (screen, data) => {
        props.navigation.navigate(screen, data)
    }

    return (
        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
            {/* show a loader when any activity in process */}
            {props.route.name === "ViewOffers" && <LoaderModal modalVisible={props.loading} />}
            <TooltipModal />

            <View style={{ flex: 1 }}>
                {/* <View style={{ height: 500 }}> */}
                <TripCard data={{ ...request_details }} showBlock={true} ContainerStyle={{ backgroundColor: "#e4e4e4" }} />
                {/* </View> */}

                <View style={{ height: 50, flexDirection: "row", marginBottom: 10, marginHorizontal: 15 }}>
                    <Segment text={`Offers`}
                        selectedSegment={segment == "offers"}
                        onPress={() => { setSegment("offers") }}
                        length={offers.length}
                    />
                    <Segment text={`Interested`}
                        selectedSegment={segment == "interested"}
                        onPress={() => setSegment("interested")}
                        length={interested.length}
                    />
                    <Segment text={`Ignore`}
                        selectedSegment={segment == "ignored"}
                        onPress={() => setSegment("ignored")}
                        length={ignored.length}
                    />
                </View>
                <SafeAreaView style={{ flex: 1 }}>

                    {segment == "offers" && <SwipeListView
                        data={offers}
                        leftOpenValue={78}
                        rightOpenValue={-78}
                        // closeOnRowOpen={true}
                        closeOnRowBeginSwipe={true}
                        closeOnScroll={true}
                        closeOnRowPress={true}
                        // disableLeftSwipe={
                        //     parseInt(index) % 2 === 0
                        // }

                        renderItem={({ item, index }) => <OfferCard data={{ ...item }}
                            onPress={() => { trip_timeDiff > time_limit ? navigateScreen("BookDriver", { data: item, index, segment, request_details, pushSeen: 'seenOffers', updateSeen: 'offers' }) : null }}
                            containerStyle={!(trip_timeDiff > time_limit) && { backgroundColor: Theme.BORDER_COLOR, opacity: 0.2 }} />}

                        keyExtractor={item => item.quote_id.toString()}
                        renderHiddenItem={(data, rowMap) => (
                            trip_timeDiff > time_limit && <View style={styles.rowBack}>
                                <TouchableOpacity onPress={() => pushToArray(data, 'ignored', offers)} style={[styles.backRightBtn, styles.backRightBtnRight,]} >
                                    <Text style={styles.backTextWhite}>Ignore</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => pushToArray(data, 'interested', offers)} style={[styles.backLeftBtn, styles.backRightBtnLeft,]}>
                                    <Text style={styles.backTextWhite}>Interested</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />}

                    {segment == "interested" && <SwipeListView
                        data={interested}
                        leftOpenValue={78}
                        rightOpenValue={-78}
                        // closeOnRowOpen={true}
                        closeOnRowBeginSwipe={true}
                        closeOnScroll={true}
                        closeOnRowPress={true}
                        disableRightSwipe={true}

                        renderItem={({ item, index }) => <OfferCard data={{ ...item }}
                            onPress={() => { trip_timeDiff > time_limit ? navigateScreen("BookDriver", { data: item, index, segment, request_details, pushSeen: 'seenOffers', updateSeen: 'offers' }) : null }}
                            containerStyle={!(trip_timeDiff > time_limit) && { backgroundColor: Theme.BORDER_COLOR, opacity: 0.2 }} />}

                        keyExtractor={item => item.quote_id.toString()}
                        renderHiddenItem={(data, rowMap) => (
                            trip_timeDiff > time_limit && <View style={styles.rowBack}>
                                {/* <TouchableOpacity onPress={() => pushToArray(data, 'ignored', interested)} style={[styles.backRightBtn, styles.backRightBtnRight,]} >
                                    <Text style={styles.backTextWhite}>Ignore</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={() => pushToArray(data, 'ignored', interested)} style={[styles.backRightBtn, styles.backRightBtnRight,]} >
                                    <Text style={styles.backTextWhite}>Ignore</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => pushToArray(data, 'interested')} style={[styles.backRightBtn, styles.backRightBtnRight,]}>
                                    <Text style={styles.backTextWhite}>Interested</Text>
                                </TouchableOpacity> */}
                            </View>
                        )}
                    />}

                    {segment == "ignored" && <SwipeListView
                        data={ignored}
                        leftOpenValue={78}
                        rightOpenValue={-78}
                        // closeOnRowOpen={true}
                        closeOnRowBeginSwipe={true}
                        closeOnScroll={true}
                        closeOnRowPress={true}
                        disableLeftSwipe={true}

                        renderItem={({ item, index }) => <OfferCard data={{ ...item }}
                            containerStyle={!(trip_timeDiff > time_limit) && { backgroundColor: Theme.BORDER_COLOR, opacity: 0.2 }} />}

                        keyExtractor={item => item.quote_id.toString()}
                        renderHiddenItem={(data, rowMap) => (
                            trip_timeDiff > time_limit && <View style={styles.rowBack}>
                                {/* <TouchableOpacity onPress={() => pushToArray(data, 'ignored')} style={[styles.backLeftBtn, styles.backRightBtnLeft,]} >
                                    <Text style={styles.backTextWhite}>Ignored</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={() => pushToArray(data, 'interested', ignored)} style={[styles.backLeftBtn, styles.backRightBtnLeft,]}>
                                    <Text style={styles.backTextWhite}>Interested</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />}

                    {/* {segment == "interested" && <FlatList
                        data={interested}
                        renderItem={({ item, index }) => <OfferCard data={{ ...item }} onPress={() => { navigateScreen("BookDriver", { data: item, index, segment, request_details }) }} />}
                        keyExtractor={item => item.id}
                    />} */}

                    {/* {segment == "ignored" && <FlatList
                        data={ignored}
                        renderItem={({ item, index }) => <OfferCard data={{ ...item }} />}
                        keyExtractor={item => item.id}
                    />} */}

                </SafeAreaView>
            </View>
        </Fragment >
    );
};

// const styles = StyleSheet.create({

//     icon: {
//         width: 20,
//         height: 20,
//     },
//     text: {
//         fontSize: Theme.FONT_SIZE_SMALL,
//         color: Theme.SECONDARY_COLOR,
//     },

// });

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
        backgroundColor: Theme.GREEN_COLOR,
        left: 0,
    },
    backRightBtnRight: {
        backgroundColor: Theme.RED_COLOR,
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
        trips: state.data.trips,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getOffers: trip_id => dispatch(getOffers(trip_id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewOffers);