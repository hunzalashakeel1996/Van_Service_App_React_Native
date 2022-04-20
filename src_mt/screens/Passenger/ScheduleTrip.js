/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

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
import { Picker } from '@react-native-picker/picker';
import Theme from '../../Theme/Theme';
import ButtonBorder from '../../components/button/ButtonBorder';
import RadioBox from '../../components/Radio/RadioBox';
import Button from '../../components/button/Button';
import Segment from '../../components/segment/Segment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Text from './../../components/text/TextWithStyle';
import timeConverter from '../../components/time/timeConverter';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputWithIcon from './../../components/input/InputWithIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scheduleTripRequest, addMyTrip } from '../../../store/actions/dataAction';
import { connect } from "react-redux";
// const WebSocket = require('ws');
import { formatDatetime } from '../../components/time/datetimeConventer';
import LoaderModal from './../../components/modal/LoaderModal';
import LocationMapModal from './../../components/modal/LocationMapModal';
import Validators from './../../components/validator/Validators';
import localNotification from './../../components/util/localNotification';
import { setNotificationVisible } from './../../../store/actions/utilAction';
import LocationButtonBorder from './../../components/button/LocationButtonBorder';
import { Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
// import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import { Platform } from 'react-native';

class ScheduleTrip extends Component {

    constructor(props) {
        super(props);

        this.initControls = {
            pickupLoc: {
                value: '',
                validationRules: [
                    Validators.required("Pickup Location is required"),
                ]
            },
            dropLoc: {
                value: '',
                validationRules: [
                    Validators.required("Dropoff Location is required")
                ]
            },
            multiLoc: {
                value: '',
                validationRules: [
                    Validators.required("Multi Stop Location is required")
                ]
            },
            driverStay: {
                value: false,
            },
            depart: {
                value: '',
                validationRules: [
                    Validators.required("Depart date is required")
                ]
            },
            return: {
                value: '',
                validationRules: [
                    Validators.required("Return date is required")
                ]
            },
            seats: {
                value: '',
                validationRules: [
                    Validators.required("Seats are required")
                ]
            },
            notes: {
                value: '',
            },
        };


        this.state = {
            segment: props.route.params?.trip_type,
            detailsShow: true,
            addStop: false,
            showDate: false,
            showTime: false,
            // dateTimeShow: false,
            datetimeMode: null,
            controls: JSON.parse(JSON.stringify(this.initControls)),
            modalVisible: false,
            currentLocation: null,
            locationType: "pickupLoc",
            additionalDetails: [],
            allDetails: props.additionalDetails,
            loader: false,
        }

        this.datetime = this.getDatetime();

        this.tempLocation = null;
        this.datetimeType = null;
        // this.trip_type = props.route.params?.trip_type;
        this.tripTypes = ['One Way', 'Round Trip'];
        this.noOfSeats = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

        this.keys = {
            'One Way': ['pickupLoc', 'dropLoc', 'depart', 'seats'],
            'Round Trip': ['pickupLoc', 'dropLoc', 'depart', 'return', 'seats'],
            'Multi Stop': ['pickupLoc', 'dropLoc', 'multiLoc', 'depart', 'return', 'seats'],
        }
    }

    componentDidMount = async () => {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.didMount()
        });
    }

    componentWillUnmount = () => {
        this._unsubscribe();
    }

    didMount = () => {
        this.setState({ locationType: "pickupLoc", loader: true }, () => {
            this.checkStatus();
            this.filterAddDetailsBySeats(0);
            // this.props.getAdditionalDetails().then((data) => {
            //     this.setState({ allDetails: data }, () => {
            //         this.filterAddDetailsBySeats(0);
            //     });
            // })
        })
    }

    // sendSocket = (code, data) => {
    //     this.ws.send(JSON.stringify({ code, data }));
    // }

    // receivedSocket = (code, callback) => {
    //     this.ws.onmessage = (e) => {
    //         // a message was received
    //         let parseData = JSON.parse(e.data)
    //         if (parseData.code == code) {
    //             console.warn(parseData.data);
    //             callback(null, parseData.data);
    //         }
    //     };
    // }

    setValue = (type, val) => {
        let cont = { ...this.state.controls }
        cont[type].value = val;
        // console.warn(cont[type], val)
        this.setState({ controls: cont });
        // this.validateChk();
        if (cont[type].validationRules) {
            Validators.validation([type], cont).then(validate => {
                // if (validate.formValid) {
                this.setState({ controls: validate.controls })
                // } else {
                //     this.setState({ controls: cont });
                // }
            });
        }
    }


    updateAdditionalDetails = (value, index) => {
        let temp = [...this.state.additionalDetails];
        temp[index].value = value;
        this.setState({ additionalDetails: temp })
    }

    navigateScreen = (screen, data) => {
        this.props.navigation.navigate(screen, data);
    }

    filterAddDetailsBySeats = (seat) => {
        this.state.allDetails.map((details) => {
            if (details.no_of_seats === seat) {
                // filter allDetails by seats then sort that detailOptions into an array (removing null options)
                let tempDetails = [];
                for (let i = 1; i <= 8; i++) {
                    if (details[`opt_${i}`]) {
                        tempDetails.push({ name: details[`opt_${i}`], value: false });
                    }
                }
                this.setState({ additionalDetails: tempDetails });
            }
        })
    }

    requestTrip = () => {
        const { controls, additionalDetails, segment } = this.state;

        let keys = this.keys[`${segment}`]; // change keys with respect to segment to validate 
        Validators.validation(keys, { ...controls }).then(validate => {

            // console.warn(validate)

            // if all validation feilds are valid
            if (validate.formValid) {
                let data = {
                    user_id: this.props.userData.id,
                    userData: this.props.userData,
                    // user_mobile_number: this.props.userData.mobile_number,
                    // user_email: this.props.userData,
                    // user_profile_picture: this.props.userData.profile_picture,
                    // userData: this.props.userData.rated,
                    // userData: this.props.userData.reviews,
                    // userData: this.props.userData,
                    source: controls.pickupLoc.value,
                    destination: controls.dropLoc.value,
                    multi_stop: segment == this.tripTypes[2] ? controls.multiLoc.value : null,
                    departure_date: controls.depart.value,
                    return_date: segment == this.tripTypes[0] ? null : controls.return.value,
                    driver_stay: segment == this.tripTypes[0] ? null : controls.driverStay.value,
                    no_of_seats: controls.seats.value,
                    notes: controls.notes.value,
                    additionalDetails,
                    type: segment,
                }

                // console.warn(data);
                this.props.scheduleTripRequest(data).then((dataRes) => {
                    if (dataRes.err) {
                        Alert.alert(dataRes.err.title, dataRes.err.message)
                        return;
                    }
                    this.setState({ controls: JSON.parse(JSON.stringify(this.initControls)), locationType: "pickupLoc" }, () => {
                        let payload = {
                            request_id: dataRes.insertId,
                            user_id: this.props.userData.id,
                            type: segment,
                            no_of_seats: controls.seats.value,
                            source: controls.pickupLoc.value.name,
                            source_detail: controls.pickupLoc.value.detailName,
                            destination: controls.dropLoc.value.name,
                            destination_detail: controls.dropLoc.value.detailName,
                            multi_stop: null,
                            source_coordinate: controls.pickupLoc.value.location,
                            destination_coordinate: controls.dropLoc.value.location,
                            multi_stop_coordinate: null,
                            customer_notes: controls.notes.value,
                            departure_date: controls.depart.value.toISOString(),
                            return_date: segment == this.tripTypes[0] ? null : controls.return.value.toISOString(),
                            driver_stay: segment == this.tripTypes[0] ? null : controls.driverStay.value,
                            requested_at: new Date().toISOString(),
                            opt_1: additionalDetails[1] ? additionalDetails[1].name : null,
                            opt_1_val: additionalDetails[1] ? additionalDetails[1].value : null,
                            opt_2: additionalDetails[2] ? additionalDetails[2].name : null,
                            opt_2_val: additionalDetails[2] ? additionalDetails[2].value : null,
                            opt_3: additionalDetails[3] ? additionalDetails[3].name : null,
                            opt_3_val: additionalDetails[3] ? additionalDetails[3].value : null,
                            opt_4: additionalDetails[4] ? additionalDetails[4].name : null,
                            opt_4_val: additionalDetails[4] ? additionalDetails[4].value : null,
                            opt_5: additionalDetails[5] ? additionalDetails[5].name : null,
                            opt_5_val: additionalDetails[5] ? additionalDetails[5].value : null,
                            opt_6: additionalDetails[6] ? additionalDetails[6].name : null,
                            opt_6_val: additionalDetails[6] ? additionalDetails[6].value : null,
                            opt_7: additionalDetails[7] ? additionalDetails[7].name : null,
                            opt_7_val: additionalDetails[7] ? additionalDetails[7].value : null,
                            opt_8: additionalDetails[8] ? additionalDetails[8].name : null,
                            opt_8_val: additionalDetails[8] ? additionalDetails[8].value : null,
                            trip_path: dataRes.trip_path,
                            trip_distance: dataRes.trip_distance,
                            trip_time: dataRes.trip_time,
                            trip_status: null,
                            status: null,
                        }
                        this.props.addMyTrip(payload);
                        // localNotification("Got your order, boss!", "Standby as we look for available drivers near you.", {request_id: dataRes.insertId, transaction_notification: "true", status: null});

                        let notiData = {
                            modalVisible: true,
                            title: "Got your order, boss!",
                            message: "Standby as we look for available drivers near you.",
                            btnText: "Okay",
                            request_id: dataRes.insertId,
                            status: null
                        }
                        // this.props.setNotificationVisible(notiData);
                        this.navigateScreen("My Trips");
                        Toast.show("Job successfully placed!", Toast.LONG);
                        this.checkStatus();
                        this.filterAddDetailsBySeats(0);
                    })
                })
            } else {
                this.setState({ controls: validate.controls })
            }
        })
    }

    setDateTime = (DateTime, mode) => {
        if (mode == "date") {
            this.setState({ datetimeMode: null })
            // if (event.type == "set" && mode == "date") {
            this.datetime.setDate(DateTime.getDate());
            this.datetime.setMonth(DateTime.getMonth());
            this.datetime.setFullYear(DateTime.getFullYear());
            
            this.setState({ datetimeMode: "time" })
            // } else if (event.type == "set" && mode == "time") {
        } else if (mode == "time") {
            this.datetime.setHours(DateTime.getHours());
            this.datetime.setMinutes(DateTime.getMinutes());

            this.setState({ datetimeMode: null });

            let now = new Date();
            let time_limit = 8;
            now.setHours(now.getHours() + time_limit);
            if (this.datetime.getTime() > now.getTime()) {
                this.setValue(this.datetimeType, new Date(this.datetime));
            } else {
                this.setState({ datetimeMode: "time" });

                Toast.show("Please select time (8 hrs) prior to current time", Toast.LONG)
            }

        } else {
            this.setState({ datetimeMode: null })
        }
    }


    onMarkerDrag = (location) => {
        this.tempLocation = { ...location };
    }

    setLocation = (location, isMapDrag) => {
        if (isMapDrag) {
            let data = {
                latitude: this.tempLocation.latitude,
                longitude: this.tempLocation.longitude,
            }
            this.getLocationFromCoordinates(data)
            // fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.tempLocation.latitude + ',' + this.tempLocation.longitude + '&location_type=' + 'ROOFTOP' + '&key=' + 'AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8')
            //     .then((response) => response.json())
            //     .then((responseJson) => {
            //         console.warn('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.results[0].formatted_address));
            //         let location = { name: responseJson.results[0].formatted_address, location: `${this.tempLocation.latitude}, ${this.tempLocation.longitude}` };
            //         this.setValue(this.state.locationType, location)
            //         this.setState({ loader: false })
            //     })
        } else if (location.location == this.state.currentLocation) {
            // only execute when current location is selected
            let data = {
                latitude: this.state.currentLocation.latitude,
                longitude: this.state.currentLocation.longitude,
            }
            this.getLocationFromCoordinates(data);
            // fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.currentLocation.latitude + ',' + this.state.currentLocation.longitude + '&location_type=' + 'ROOFTOP' + '&key=' + 'AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8')
            //     .then((response) => response.json())
            //     .then((responseJson) => {
            //         console.warn('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.results[0].formatted_address));
            //         let location = { name: responseJson.results[0].formatted_address, location: `${this.state.currentLocation.latitude}, ${this.state.currentLocation.longitude}` };
            //         this.setValue(this.state.locationType, location)
            //         this.setState({ loader: false })
            //     })
        }
        else {
            let loc = { name: location.name, detailName: location.detailName, location: `${location.location.latitude}, ${location.location.longitude}` };
            this.setValue(this.state.locationType, loc)
        }

        // setValue(locationType, tempLocation)
        // location get "currentLoc" when this screen render and get current location (to dont show toast) 
        if (location != "currentLoc") {

            Toast.show('Location Changed Successfully', Toast.LONG)
        }
        this.setState({ modalVisible: false });
    }

    getLocationFromCoordinates = (data) => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + data.latitude + ',' + data.longitude + '&location_type=' + 'ROOFTOP' + '&key=' + 'AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8')
            .then((response) => response.json())
            .then((responseJson) => {
                // format string with first occurence comma
                const s = responseJson.results[0].formatted_address.split(",");
                const name = s[0];
                const detailName = s.slice(1).join().trim();
                // format end
                let location = { name, detailName, location: `${data.latitude}, ${data.longitude}` };
                this.setValue(this.state.locationType, location)
                this.setState({ loader: false })
            })
    }

    checkStatus = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            console.warn(granted)

            if (granted) {
                this.getCurrentLocation();
            }
            else {
                try {
                    console.warn('granted')

                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    console.warn(granted)

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.getCurrentLocation();
                    } else {
                        console.log('Location permission denied');
                    }
                } catch (err) {
                    console.warn(err);

                }
            }
        }
        else {
            this.getCurrentLocation();
        }
    }

    getDatetime = () => {
        var now = new Date();
        now.setHours(8);
        now.setMinutes(0);
        now.setSeconds(0);
        return now;
    }

    getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                let cord = Object.assign(position.coords, { latitudeDelta: 0.005, longitudeDelta: 0.005, });
                this.setState({ currentLocation: cord });
                this.tempLocation = cord;
                this.setLocation("currentLoc", true)
                // console.log(position);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    getMinimumDate = () => {
        const { controls } = this.state;

        if (this.datetimeType == 'depart') {
            return this.getDatetime();
        } else {
            if (controls.depart.value == '')
                return this.getDatetime();
            if (controls.depart.value !== '')
                return controls.depart.value;
        }
    }

    getMaximumDate = () => {
        const { controls } = this.state;

        if (this.datetimeType == 'depart') {
            if (controls.return.value == '')
                return null;
            if (controls.return.value !== '')
                return controls.return.value;
        } else {
            return null;
        }
    }


    // getMinimumDate = () => {
    //     const { controls } = this.state;

    //     if (this.datetimeType == 'depart') {
    //         if (controls.depart.value == '' && controls.return.value == '')
    //             return this.getDatetime();
    //         if (controls.depart.value !== '' && controls.return.value == '')
    //             return this.getDatetime();
    //         if (controls.depart.value == '' && controls.return.value !== '')
    //             return this.getDatetime();
    //         if (controls.depart.value !== '' && controls.return.value !== '')
    //             return this.getDatetime();
    //     } else {
    //         if (controls.depart.value == '' && controls.return.value == '')
    //             return this.getDatetime();;
    //         if (controls.depart.value !== '' && controls.return.value == '')
    //             return controls.depart.value;
    //         if (controls.depart.value == '' && controls.return.value !== '')
    //             return this.getDatetime();;
    //         if (controls.depart.value !== '' && controls.return.value !== '')
    //             return controls.depart.value;
    //     }
    //     // controls.depart.value !== '' && controls.return.value == '' ? this.datetime : this.getDatetime()
    // }

    // getMaximumDate = () => {
    //     const { controls } = this.state;

    //     if (this.datetimeType == 'depart') {
    //         if (controls.depart.value == '' && controls.return.value == '')
    //             return null;
    //         if (controls.depart.value !== '' && controls.return.value == '')
    //             return null;
    //         if (controls.depart.value == '' && controls.return.value !== '')
    //             return controls.return.value;
    //         if (controls.depart.value !== '' && controls.return.value !== '')
    //             return controls.return.value;
    //     } else {
    //         if (controls.depart.value == '' && controls.return.value == '')
    //             return null;
    //         if (controls.depart.value !== '' && controls.return.value == '')
    //             return null;
    //         if (controls.depart.value == '' && controls.return.value !== '')
    //             return null;
    //         if (controls.depart.value !== '' && controls.return.value !== '')
    //             return null;
    //     }
    // }

    openDatetime = (control_type, control_value) => {
        this.datetimeType = control_type;
        this.datetime = control_value !== "" ? control_value : this.getDatetime();

        this.setState({ datetimeMode: 'date' });
    }

    render() {
        const { segment, detailsShow, addStop, showDate, showTime, modalVisible, currentLocation,
            locationType, additionalDetails, allDetails, controls, datetimeMode, loader } = this.state;

        const notOneWay = !(segment == this.tripTypes[0]);
        const getActiveRouteState = function (route) {
            if (!route.routes || route.routes.length === 0 || route.index >= route.routes.length) {
                return route;
            }

            const childActiveRoute = route.routes[route.index];
            return getActiveRouteState(childActiveRoute);
        }
        // const isRoundTrip = segment == this.tripTypes[1];
        // const isMultiStop = segment == this.tripTypes[2];
        return (
            <Fragment>
           <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
                {/* {console.warn('11', this.props.navigation)} */}
                {this.props.route.name === "ScheduleTrip" && <LoaderModal modalVisible={(this.props.loading)} />}
                {/* {showDate && <DateTimePicker mode="date" value={this.datetime} onChange={(event, date) => { this.setDate(event, date) }}
                    minimumDate={this.getDatetime()}
                // maximumDate={new Date()}
                />}
                {showTime && <DateTimePicker mode="time" value={this.datetime} is24Hour={false} onChange={(event, time) => { this.setTime(event, time) }} />} */}

                {datetimeMode != null && this.props.platform == 'android' ? <DateTimePicker mode={datetimeMode} value={this.datetime} is24Hour={false} minimumDate={this.getMinimumDate()} maximumDate={this.getMaximumDate()} onChange={(event, datetime) => { this.setDateTime(datetime, datetimeMode) }} />
                    :
                    <DateTimePickerModal
                        isVisible={datetimeMode !== null}
                        mode={datetimeMode}
                        locale="en_GB"
                        date={this.datetime}
                        minimumDate={this.getMinimumDate()}
                        maximumDate={this.getMaximumDate()}
                        onConfirm={(datetime) => { this.setDateTime(datetime, datetimeMode) }}
                        onCancel={() => { this.setState({ datetimeMode: null }) }}
                    />}
                {/* opens location modal to set location */}
                {modalVisible && (
                    <LocationMapModal
                        modalVisible={modalVisible}
                        setModalVisible={isVisible => this.setState({ modalVisible: isVisible })}
                        coordinate={currentLocation}
                        locationType={this.state.locationType}
                        selectedLocation={this.state.locationType == "pickupLoc" ?
                            controls.pickupLoc.value : controls.dropLoc.value}
                        onMarkerDrag={loc => this.onMarkerDrag(loc)}
                        setLocation={(loc, isMapDrag) => this.setLocation(loc, isMapDrag)}
                    />
                )}

                <View style={{ flex: 1, marginHorizontal: 15 }}>
                    <View style={{ height: 50, flexDirection: "row" }}>
                        {this.tripTypes.map(type => (
                            <Segment key={type} text={type}
                                selectedSegment={segment == type}
                                onPress={() => this.setState({ segment: type })}
                            />
                        ))}
                    </View>

                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={{}}>
                                <View style={{ paddingTop: 15, paddingBottom: 5 }}>
                                    {/* pickup location */}
                                    {false ? <ContentLoader
                                        speed={2}
                                        width={"100%"}
                                        height={60}
                                        viewBox={`0 0 ${wp(100)} 60`} backgroundColor="#f3f3f3"
                                        foregroundColor="#dedede"
                                    >
                                        <Circle cx="29" cy="33" r="12" />
                                        <Rect x="51" y="21" rx="2" ry="2" width="140" height="12" />
                                        <Rect x="50" y="41" rx="2" ry="2" width="180" height="6" />
                                        <Rect x="2" y="5" rx="0" ry="0" width="100%" height="5" />
                                        <Rect x="3" y="54" rx="0" ry="0" width="100%" height="5" />
                                        <Rect x="2" y="8" rx="0" ry="0" width="5" height="50" />
                                        <Rect x="98.5%" y="7" rx="0" ry="0" width="5" height="50" />

                                    </ContentLoader> :

                                        <LocationButtonBorder
                                            iconName={require('../../../assets/passenger/dot.png')}
                                            iconStyle={{ width: 18, height: 18 }}
                                            defaultText={"Pickup Location"}
                                            text={controls.pickupLoc.value}
                                            onPress={() => { this.setState({ modalVisible: true, locationType: 'pickupLoc' }); }}
                                            error={controls.pickupLoc.error}
                                        />}

                                    {/* Drop location */}
                                    {false ? <ContentLoader
                                        speed={1}
                                        width={"100%"}
                                        height={60}
                                        viewBox="0 0 '100%' 60"
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#dedede"
                                    >
                                        <Circle cx="29" cy="33" r="12" />
                                        <Rect x="51" y="21" rx="2" ry="2" width="140" height="12" />
                                        <Rect x="50" y="41" rx="2" ry="2" width="180" height="6" />
                                        <Rect x="2" y="5" rx="2" ry="2" width="100%" height="3" />
                                        <Rect x="3" y="54" rx="2" ry="2" width="100%" height="3" />
                                        <Rect x="2" y="8" rx="0" ry="0" width="3" height="50" />
                                        <Rect x="99%" y="7" rx="0" ry="0" width="3" height="50" />
                                    </ContentLoader> :
                                        <LocationButtonBorder
                                            iconName={require('../../../assets/passenger/driver.png')}
                                            iconStyle={{ width: 25, height: 25 }}
                                            defaultText={"Drop Off Location"}
                                            text={controls.dropLoc.value}
                                            onPress={() => { this.setState({ modalVisible: true, locationType: 'dropLoc' }); }}
                                            error={controls.dropLoc.error}
                                        />}

                                    {/* multi stop */}
                                    {/* {!addStop ? <TouchableOpacity onPress={() => setAddStop(true)} style={{ width: "26%", marginLeft: 10, marginVertical: 5 }}>
                                        <Text style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, borderBottomColor: Theme.PRIMARY_COLOR, borderBottomWidth: 1 }}>Add Stop Over</Text>
                                    </TouchableOpacity> :
                                        <View>
                                            <ButtonBorder
                                                iconName={require('../../../assets/passenger/locator.png')}
                                                imageStyle={{ width: 15, height: 15 }}
                                                text={"Drop Location"}
                                            // onPress={()=>this.onPress()}
                                            // error={parentControls.email.error}
                                            />

                                            <TouchableOpacity onPress={() => setAddStop(false)} style={{ position: 'absolute', alignSelf: "flex-end", top: -7, right: -5, paddingLeft: 10, paddingBottom: 10 }}>
                                                <Image style={{ width: 25, height: 25 }} source={require('../../../assets/passenger/cross.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    } */}
                                </View>

                                {/* Depart & Return Date */}
                                <View style={{ flexDirection: 'row' }}>
                                    {/* Depart */}
                                    <View style={{ flex: 1, marginRight: notOneWay ? 8 : 0, marginBottom: 5 }}>
                                        <View style={[styles.input, controls.depart.error && styles.inputErr]}>
                                            <View style={{ flex: notOneWay ? 0.2 : 0.1, justifyContent: "center" }}>
                                                <Image style={styles.icon} source={require('../../../assets/passenger/datetime.png')} />
                                            </View>
                                            <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}
                                                onPress={() => { this.openDatetime('depart', controls.depart.value) }}
                                            >
                                                <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR }}>{controls.depart.value ? formatDatetime(controls.depart.value).datetime : 'Depart Date'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {controls.depart.error && <Text style={styles.text}>{controls.depart.error}</Text>}
                                    </View>

                                    {/* Return */}
                                    {notOneWay && <View style={{ flex: 1, marginLeft: 8, marginBottom: 5 }}>
                                        <View style={[styles.input, controls.return.error && styles.inputErr]}>
                                            <View style={{ flex: 0.2, justifyContent: "center" }}>
                                                <Image style={styles.icon} source={require('../../../assets/passenger/datetime.png')} />
                                            </View>
                                            <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}
                                                onPress={() => { this.openDatetime('return', controls.return.value) }}
                                            >
                                                <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR }}>{controls.return.value ? formatDatetime(controls.return.value).datetime : 'Return Date'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {controls.return.error && <Text style={styles.text}>{controls.return.error}</Text>}
                                    </View>}
                                </View>

                                {/* Driver stay */}
                                {notOneWay && <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', marginTop: 10 }}>
                                    <CheckBox
                                        value={controls.driverStay.value}
                                        onValueChange={(val) => { this.setValue('driverStay', val) }}
                                        tintColors={{ true: Theme.SECONDARY_COLOR }}
                                        onCheckColor={Theme.PRIMARY_COLOR}
                                        onTintColor={Theme.PRIMARY_COLOR}
                                    />
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_LARGE }} onPress={() => this.setValue('driverStay', !controls.driverStay.value)} numberOfLines={1}>Stay during the whole trip</Text>
                                </View>}

                                {/* Number */}
                                <View style={{ marginBottom: 5 }}>
                                    <View style={[styles.input, controls.seats.error && styles.inputErr]}>
                                        <View style={{ flex: 1 }}>
                                            {/* {this.props.platform === 'android' ?  */}
                                            <Picker
                                                style={{ height: 50, width: "100%", color: Theme.BORDER_COLOR }}
                                                selectedValue={controls.seats.value}
                                                onValueChange={(val) => { this.filterAddDetailsBySeats(val), this.setValue('seats', val) }}
                                                mode={'dropdown'}>
                                                <Picker.Item label="Number Of Seats" value='' />
                                                {this.noOfSeats.map(seat => (
                                                    <Picker.Item key={seat} label={seat} value={JSON.parse(seat)} />
                                                ))}
                                            </Picker>
                                                {/* :
                                                <RNPickerSelect
                                                    value={controls.seats.value}
                                                    onValueChange={(val) => { this.filterAddDetailsBySeats(val), this.setValue('seats', val) }}
                                                    style={{ viewContainer: { height: 50, width: "100%", justifyContent: 'center', marginLeft: 5 }, inputIOS: { fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR } }}
                                                    placeholder={{ label: "Number Of Seats" }}
                                                    // onUpArrow={() => { console.warn('a') }}
                                                    // onDownArrow={() => { console.warn('a') }}
                                                    ref={el => {
                                                        this.pickerRef = el;
                                                    }}
                                                    items={this.noOfSeats.map(seat => { return { label: seat, value: JSON.parse(seat) } })}
                                                />} */}
                                        </View>
                                    </View>
                                    {controls.seats.error && <Text style={styles.text}>{controls.seats.error}</Text>}
                                </View>

                                {/* Notes */}
                                <InputWithIcon
                                    placeholder={` Notes (Optional)`}
                                    value={controls.notes.value}
                                    inputText={{ fontSize: 17 }}
                                    onChangeText={(val) => this.setValue('notes', val)}
                                    error={controls.notes.error}
                                />

                                {/* additional details */}
                                <View style={{ marginBottom: 20, }}>
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }} >
                                        <View style={{ flex: 0.1, justifyContent: "center" }}>
                                            <Image style={styles.icon} source={require('../../../assets/passenger/additional_detail.png')} />
                                        </View>
                                        <View style={{ flex: 0.7, justifyContent: "center" }}>
                                            <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR }}>{'Additional Details'}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => { this.setState({ detailsShow: !detailsShow }) }} style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                                            <Ionicons name={detailsShow ? "chevron-up" : "chevron-down"} size={25} color={Theme.BORDER_COLOR} />
                                        </TouchableOpacity>
                                    </View>
                                    {detailsShow && <View style={{}}>
                                        {additionalDetails.map((option, i) => {
                                            let nextOption = [...additionalDetails][i + 1];
                                            return (

                                                i % 2 == 0 &&
                                                <View key={i} style={{ flexDirection: "row" }}>
                                                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                                                        <CheckBox
                                                            value={option.value}
                                                            onValueChange={(val) => this.updateAdditionalDetails(val, i)}
                                                            tintColors={{ true: Theme.SECONDARY_COLOR }}
                                                            onCheckColor={Theme.PRIMARY_COLOR}
                                                            onTintColor={Theme.PRIMARY_COLOR}
                                                        />
                                                        <Text onPress={() => this.updateAdditionalDetails(!option.value, i)} style={{ color: Theme.BORDER_COLOR, marginLeft: 5 }} numberOfLines={1}>{option.name}</Text>
                                                    </View>
                                                    {nextOption && <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>

                                                        <CheckBox
                                                            onCheckColor={Theme.PRIMARY_COLOR}
                                                            onTintColor={Theme.PRIMARY_COLOR}
                                                            value={nextOption.value}
                                                            onValueChange={(val) => this.updateAdditionalDetails(val, i + 1)}
                                                            tintColors={{ true: Theme.SECONDARY_COLOR }}

                                                        />
                                                        <Text onPress={() => this.updateAdditionalDetails(!nextOption.value, i + 1)} style={{ color: Theme.BORDER_COLOR, marginLeft: 5 }} numberOfLines={1}>{nextOption.name}</Text>
                                                    </View>}
                                                </View>

                                            )
                                        })}
                                    </View>}
                                </View>

                            </View>
                            <View style={{ flex: 1, marginBottom: 10, justifyContent: 'flex-end' }}>
                                <Button onPress={() => {
                                    // navigateScreen()
                                    this.requestTrip()
                                }}>Get Price</Button>
                            </View>
                        </ScrollView>
                    </SafeAreaView>

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
    }

});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        platform: state.util.platform,
        additionalDetails: state.user.additionalDetails,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // getAdditionalDetails: () => dispatch(getAdditionalDetails()),
        scheduleTripRequest: (data) => dispatch(scheduleTripRequest(data)),
        setNotificationVisible: (data) => dispatch(setNotificationVisible(data)),
        addMyTrip: (data) => dispatch(addMyTrip(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleTrip);