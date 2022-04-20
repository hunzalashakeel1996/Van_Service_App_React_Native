import React, { Fragment, useState, useEffect, Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    TouchableNativeFeedback
} from 'react-native';
import Theme from '../../Theme/Theme';
import ButtonBorder from '../../components/button/ButtonBorder';
import RadioBox from '../../components/Radio/RadioBox';
import Button from '../../components/button/Button';
import Segment from '../../components/segment/Segment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Text from './../../components/text/TextWithStyle';
import timeConverter from '../../components/time/timeConverter';
import momentDate from '../../components/time/momentDate';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputWithIcon from './../../components/input/InputWithIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getAdditionalDetails, scheduleTripRequest, url, updateMyTrip } from '../../../store/actions/dataAction';
import { connect } from "react-redux";
import LoaderModal from './../../components/modal/LoaderModal';
import AsyncStorage from '@react-native-community/async-storage';
import UserProfileCard from './../../components/card/UserProfileCard';
import { connectSocket } from '../../../store/actions/socketAction';
// import io from 'socket.io-client';
import { addTripDetails, addMyTripDetails } from './../../../store/actions/dataAction';
// import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount = () => {
        // console.warn("socketinside")

        this.props.connectSocket(this.props.userData.id, addTripDetails);

        setTimeout(() => {
            this.props.socket.off('getTripData').on('getTripData', (data) => {
                console.warn("socketinside", data)
                this.props.addMyTripDetails(data.tripData)
            });
            this.props.socket.off('onTripStatusChange').on('onTripStatusChange', (socketData) => {
                console.log("socket onTripStatusChange", socketData)
                // let tempTrips = [],
                // sortTrips = Object.values(props.trips).reverse();
                // sortTrips.map((trip) => {
                //     // if (trip.request_id === data.request_id)
                //     //     tempTrip[index] = { ...tempTrip[index], upcommingTrip: true, trip_status: data.trip_status }
                //     if (trip.request_id == socketData.data.request_id && trip.isActive) {
                //         tempTrips.unshift({ ...trip, upcomingTrip: true, trip_status: socketData.data.trip_status });
                //     } else {
                //         tempTrips.push(trip)
                //     }
                // })
                // console.warn("tempTrips onTripStatusChange", tempTrips)

                // if (socketData.data.request_id == contract_detail.request_id) {
                //     setTripStatus(socketData.data.trip_status)
                //     setContract_detail({ ...contract_detail, trip_status: socketData.data.trip_status })
                //     // if(socketData.data.trip_status === 'Completed')
                //     //     props.navigation.navigate('PassengerFeedback', {trip: socketData.data} )
                // }

                if (socketData.data.trip_status === 'Completed')
                    this.props.navigation.navigate('PassengerFeedback', { trip: socketData.data })
                // setTrips(tempTrips)
                this.props.updateMyTrip(socketData.data);
            })
        }, 5000);
        // messaging().getToken().then(fcmtoken => {
        //     this.props.connectSocket(this.props.userData.id, addTripDetails);
        //     // this.props.socket.emit('notification', { device: fcmtoken })
        // });
    }

    navigateRideNow = async () => {
        let data = JSON.parse(await AsyncStorage.getItem('RideNowData'));

        if (data) {
            let navigateTo = data.status ? 'DriverOnRoute' : 'DriverList'
            this.props.navigation.navigate(navigateTo, { data });
        }
        else
            this.props.navigation.navigate('PlaceJob');
    }

    setValue = (type, val) => {
        let cont = { ...this.state.controls }
        cont[type].value = val;
        // console.warn(cont[type], val)
        this.setState({ controls: cont });
        // this.validateChk()
        this.validateChk([type]);
    }


    navigateScreen = (screen, data) => {
        this.props.navigation.navigate(screen, data);
    }

    formatDate = (date) => {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return `${date.day}-${months[date.month]}-${date.year}`;
    }

    // sendSocket = () => {
    //     console.warn('in')
    //     this.socket.emit('sendMessage', {id: 47, test: 'test'})
    // }


    render() {
        const { } = this.state;
        return (
            <Fragment>
                {/* <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" /> */}
                <StatusBar barStyle="light-content" />

                {/* <LoaderModal modalVisible={true} /> */}

                <View style={{ flex: 1, }}>
                    <UserProfileCard data={this.props.userData} />
                    <View style={{ flex: 0.85, marginHorizontal: 30, justifyContent: "center" }}>
                        <View style={{ flex: 0.4, }}>
                            <View style={{ flex: 0.25 }}>
                                <Text style={{ fontSize: Theme.FONT_SIZE_XXLARGE, color: Theme.SECONDARY_COLOR }}>Schedule a Trip</Text>
                            </View>
                            <View style={{ flex: 0.75, flexDirection: "row" }}>
                                <TouchableOpacity onPress={() => this.navigateScreen("ScheduleTrip", { trip_type: 'One Way' })} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/passenger/one-way-trip.png')} />
                                    <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR, textAlign: "center" }}>{`One-Way \n Trip`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.navigateScreen("ScheduleTrip", { trip_type: 'Round Trip' })} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/passenger/two-way-trip.png')} />
                                    <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR, textAlign: "center" }}>{`Round \n Trip`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Toast.show('Coming Soon!', Toast.LONG)} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/passenger/multi-stop.png')} />
                                    <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR, textAlign: "center" }}>{`Multi \n Stops`}</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => {this.sendSocket()}} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/passenger/multi-stop.png')} />
                                    <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR, textAlign: "center" }}>{`Multi \n Stops`}</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                        {/* <View style={{ flex: 0.35 }}>
                            <View style={{ flex: 0.25, justifyContent: "flex-end" }}>
                                <Text style={{ fontSize: Theme.FONT_SIZE_XXLARGE, color: Theme.SECONDARY_COLOR }}>Find a car with driver</Text>
                            </View>
                            <View style={{ flex: 0.75, flexDirection: "row" }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/passenger/one-day.png')} />
                                    <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.BORDER_COLOR, textAlign: "center" }}></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/passenger/one-week.png')} />
                                    <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.BORDER_COLOR, textAlign: "center" }}></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/passenger/one-month.png')} />
                                    <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.BORDER_COLOR, textAlign: "center" }}></Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}

                    </View>
                    {/* <View style={{  alignItems: 'center' }}>
                            <Button onPress={() => this.navigateRideNow()} styleButton={{ width: "85%", height: 50, borderRadius: 10, }} styleText={{ fontSize: Theme.FONT_SIZE_XXLARGE }}>Want a ride now ?</Button>
                        </View> */}
                </View >

            </Fragment >
        );
    }
}


const styles = StyleSheet.create({

    icon: {
        width: 20,
        height: 20,
    },
    text: {
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.SECONDARY_COLOR,
    },

    input: {
        flexDirection: "row",
        borderBottomColor: Theme.BORDER_COLOR,
        borderBottomWidth: 1,
        height: 50,
        marginBottom: 2
    },

    inputErr: {
        borderBottomColor: Theme.RED_COLOR,
        borderBottomWidth: 2,
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
        socket: state.socket.socket,
        platform: state.util.platform
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAdditionalDetails: () => dispatch(getAdditionalDetails()),
        scheduleTripRequest: (data) => dispatch(scheduleTripRequest(data)),
        addMyTripDetails: (data) => dispatch(addMyTripDetails(data)),
        connectSocket: (userId, dispatchFunc) => dispatch(connectSocket(userId, dispatchFunc)),
        updateMyTrip: (data) => dispatch(updateMyTrip(data)),


    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);