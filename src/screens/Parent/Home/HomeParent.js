import { PolyUtil } from "node-geometry-library";
import NetInfo from '@react-native-community/netinfo';
import { isPointWithinRadius, findNearest } from 'geolib';
import haversine from 'haversine';
import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { AppState, BackHandler, Image, ScrollView, StyleSheet, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { phonecall } from 'react-native-communications';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import PushNotification from 'react-native-push-notification';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import Footer from './Footer';
import Toast from 'react-native-simple-toast';
import Sound from 'react-native-sound';

import {
    getChilds,
    getDrivers,
    getStatus,
    getTodayTrips,
    VWGeneralGetTripsData,
    getUnseenNotifications,
    VWGeneralGetStatus,
    uploadUrl, url
} from '../../../../store/actions/dataAction';
import { setChilds, setDrivers, setUnseenNotifications } from '../../../../store/actions/Map';
import DraggableView from '../../../components/DraggableView';
import Loader from '../../../components/Loader';
import TextWithStyle from '../../../components/TextWithStyle';
import Theme from '../../../components/Theme';
import Header from './Header';
import TimerComponent from './TimerComponent';
import TodayTrips from './TodayTrips';
import AsyncStorage from '@react-native-community/async-storage';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import timeConverter from '../../../components/timeConverter';

class HomeParent extends Component {
    state = {
        userLocation: [], // driver location variable
        startingLocation: [],
        steps: [],  // steps of each individual drivers
        time: [],
        loader: true,
        isNoShift: true,
        footerHeight: 0,
        isArrived: false,
        isDriverDetail: false,
        pressedDriverDetail: {},
        shiftColor: {},
        colors: ['#f23030', '#30e2f2', '#be30f2', '#f26d30', '#f2a830', '#d2f230', '#30f240', '#30f2a1', '#3097f2', '#3030f2', '#7430f2', '#f2304e'],
        isCloseView: false,
        isTodayTripOpen: false,  // varaible to check if today trip page is open or closed
        isBackButtonPressed: false,  // variabe to check if back button is pressed when today trip page is open
        trips: [],  // variable to store today trips data to pass on props
        appState: AppState.currentState,
        arrivedTimer: 120,
        isNetConnected: true,
        isNewUser: false,
        isNewAccount: true,
        currentTurnUserId: []
        // a: {...b}
    };

    sound = new Sound('arrived_beep.wav');

    constructor(props) {
        super(props);
        this.socket = io(url, {
            transports: ['websocket'],
            jsonp: false,
        });
        this.socket.on('connect', () => {
            this.socketId = this.socket.id
        });

    }



    // method when app back and forth from foreground to background  and vice versa
    _handleAppStateChange = (nextAppState) => {
        AsyncStorage.setItem('trips', JSON.stringify(this.state.trips))
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            this.getDataWhenAppNotKilled()
        }
        this.setState({ appState: nextAppState });
        // this.appStateEvent.remove()


    };

    componentDidMount = async () => {
        this.props.navigation.setOptions({ headerShown: false })
        // get initial data from database
        this.getInitialDataFromDB()

        // const backHandler = BackHandler.addEventListener("hardwareBackPress", () => { handleBackBtn(); return true; });
        // this.props.navigation.setParams({ handleBackBtn });

        // this.backHandlerEvent = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        // method when user send app to background and reopen it
        this.appStateEvent = AppState.addEventListener('change', this._handleAppStateChange);

        this.netInfo = NetInfo.addEventListener(state => {
            if (state.isConnected && !this.state.isNetConnected) {
                this.setState({ isNetConnected: state.isConnected })
                this.getDataWhenAppNotKilled()
            }
            else
                this.setState({ isNetConnected: state.isConnected })
        });

        // ======================================= Sockets events start ===================================================
        // this.socket.on('disconnect', () => {
        //   if (this.state.appState == 'active' && this.driverChildData) {
        //     this.driverChildData.map(driver => {
        //       this.socket.emit('createParent', { id: driver.driver_id, name: driver.child_name, socket_id: this.socketId })
        //     })
        //   }
        // })

        // get event of user location
        this.socket.on('getUserLocation', (data) => {
            let slicedIndex = 0
            let temp = [...this.state.trips]
            temp.map((trip, index) => {
                if (data.shift_id === trip.shift_id && temp[index].pathCoordinate && !this.state.isNoShift) {
                    // calculate time 
                    const home = this.convertToLatLong(trip.coordinate.split('-vw-')[trip.splitIndex]);
                    const driver = { longitude: data.data.longitude, latitude: data.data.latitude };
                    let value = Math.ceil(((haversine(home, driver, { unit: "km" })) / 10) * 60);

                    // remove path from map which driver already coverd
                    const nearestPathCord = findNearest(data.data, temp[index].pathCoordinate);
                    const nearestPathIndex = temp[index].pathCoordinate.findIndex(x => x.latitude === nearestPathCord.latitude && x.longitude === nearestPathCord.longitude);

                    // for (let i = 0; i < temp[index].pathCoordinate.length; i++) {
                    //     if (isPointWithinRadius(temp[index].pathCoordinate[i], data.data, 20))
                    //         slicedIndex = i
                    // }
                    temp[index] = {
                        ...temp[index],
                        driverLocation: {
                            longitude: data.data.longitude, latitude: data.data.latitude,
                            longitudeDelta: data.data.longitudeDelta, latitudeDelta: data.data.latitudeDelta,
                            heading: data.data.heading
                        },
                        driverTime: value,
                        pathCoordinate: temp[index].pathCoordinate.slice(nearestPathIndex)

                    }
                }
            })
            this.setState({ trips: temp, currentTurnUserId: data.user }, () => { this.fitAllMarkers() })

        })

        this.socket.on('steps', (data) => {
            if (data.shift_id && data.path && data.path.length > 1) {
                this.assignGooglePathToPolyline(data, true)
                // data.path = mapboxPolyline.decode(data.path)
                // let temp = [...this.state.steps]
                // let counter = 0
                // let finalSteps = []

                // data.path.map(singleCoord => {
                //   finalSteps.push({ latitude: singleCoord[0], longitude: singleCoord[1] })
                // })

                // for(let i = 0; i < finalSteps.length; i++){
                //   if ((isPointWithinRadius(finalSteps[i], this.convertToLatLong(this.props.childs[0].coordinates), 30))){
                //     counter = i
                //     break;
                //   }
                // }

                // if(counter === 0) finalSteps = []
                // else finalSteps = finalSteps.slice(0, counter + 1)

                // counter = 0
                // this.state.steps.map(driver => {
                //   if (driver.id === data.id)
                //     temp[counter] = { ...temp[counter], coordinates: finalSteps, shift_id: data.shift_id };
                //   counter++;
                // })

                // this.setState({ steps: temp })
            }
        })

        this.socket.on('sendPathToUsers', (path) => {
            if (path.path && path.path.length > 1 && !this.state.isNoShift)
                this.assignGooglePathToPolyline(path)
            // path.path = mapboxPolyline.decode(path.path)
            // let finalSteps = []
            // let temp = [...this.state.steps]
            // let counter = 0

            // path.path.map(singleCoord => {
            //   finalSteps.push({ latitude: singleCoord[0], longitude: singleCoord[1] })
            // })

            // for (let i = 0; i < finalSteps.length; i++) {
            //   if ((isPointWithinRadius(finalSteps[i], this.convertToLatLong(this.props.childs[0].coordinates), 30))) {
            //     counter = i
            //     break;
            //   }
            // }

            // if(counter === 0) finalSteps = []
            // else finalSteps = finalSteps = finalSteps.slice(0, counter + 1)

            // counter = 0
            // this.state.steps.map(driver => {
            //   if (driver.id === path.id)
            //     temp[counter] = { ...temp[counter], coordinates: finalSteps, shift_id: path.shift_id };
            //   counter++;
            // })

            // this.setState({steps: temp})
        })

        // event get when driver arrived and either leaved or pick a child
        this.socket.on('checkStatus', (data) => {
            let temp = [];
            let tempTrips = JSON.parse(JSON.stringify(this.state.trips))
            tempTrips.map((singleData, index) => {
                if (singleData.shift_id === data.shift_id && singleData.id === data.child_id && !this.state.isNoShift) {
                    // loop through whole array if child match update status for that child according to parameter
                    // this.driverChildData[index] = { ...singleData, status: data.status }


                    // logic for splitIndex increament if driver completed first trip (i.e picked)
                    if (['Picked', 'ParentLeft', 'Left'].includes(data.status)) {
                        tempTrips[index].splitIndex = 1

                    }
                    temp.push(data.status)
                    tempTrips[index].status = `${data.status}-vw-${data.status}`

                    if (data.status === 'Arrived')
                        this.sound.play()
                }
                else
                    temp.push(singleData.status)
            })


            this.setState({ isArrived: temp.includes('Arrived') ? true : false, trips: tempTrips }, () => {
                // change google path when driver picked passenger and is on his way to drop off
                if (data.status === 'Picked')
                    this.assignGooglePathToPolyline(data)
                this.fitAllMarkers()
            })

            // if status is arrived then sort footers immediately otherwise wait for 3 sec to sort
            // data.status !== 'Arrived' ?
            //     setTimeout(() => {
            //         this.sortFooter()
            //     }, 5000)
            //     :
            //     this.sortFooter()
        })

        // event when driver either start or end the shift
        this.socket.on('shiftStartOrEnd', (data) => {
            this.updateTripStatus(this.state.trips).then(() => {
                if (data.shift === 'end') {
                    // if shift was ended then remove driver icon from the map

                } else {
                    //assign color to shift
                }
                // this.sortFooter().then(() => {
                this.checkIsShift().then(() => {
                    // this.state.isNoShift ? this.props.navigation.navigate('TodayTrips') : null

                })
                // })
            })
        })

        // =========================================== Sockets events end =============================================

        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onNotification: (notification) => {
                // local notification for ios when app is in foreground
                if (Platform.OS == 'ios') {
                    PushNotification.localNotification({
                        title: notification.title, // (optional)
                        message: notification.message, // (required)
                        largeIconUrl: notification.bigPictureUrl,
                    });
                }
            },

            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "540629351078",
        })
    }

    componentWillUnmount = () => {
        this.socket.disconnect();
        // this.backHandlerEvent.remove();
        this.appStateEvent.remove()
    }

    // get intial data from database includes childs of curent parent and drivers of that childs
    getInitialDataFromDB = async () => {
        try {
            this.decoded = this.props.userData
            // get trips data of current user
            this.props.VWGeneralGetTripsData(this.decoded.id).then(trips => {
                // this.setState({loader:false})
                if (trips.length === 0) {
                    this.setState({ loader: false, isNewAccount: true })
                    this.props.navigation.navigate('Subscription')
                }
                else {
                    // update trip status for all trips
                    this.updateTripStatus(trips).then(() => {
                        this.setState({ loader: false, isNewAccount: trips.filter((val) => { return val.shift_id !== null }).length <= 0 })

                        // database hit to get number of unseen notifications
                        this.props.getUnseenNotifications(this.decoded.id)
                            .then(res => {
                                this.props.onSetUnseenNotifications(res['unseenNotification'])
                                this.props.navigation.setParams({
                                    unseenNotifications: this.props.unseenNotifications,
                                });
                            })
                    })

                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    updateTripStatus = (trips) => {
        return new Promise((resolve, reject) => {
            this.props.VWGeneralGetStatus(this.decoded.id).then(tripLog => {
                if (tripLog.length > 0) {

                    trips.map((trip, index) => {
                        this.socket.emit('createParent', { id: trip.driver_id, name: this.decoded.name, socket_id: this.socketId })

                        let temp = tripLog.filter((val) => { return val.shift_id === trip.shift_id })
                        // if we get some object after filter then add values on that trip object else do nothing 

                        if (temp.length > 0) {
                            temp = temp[0]
                            let splitIndex = ['Picked', 'ParentLeft', 'Left'].includes(temp.status.split('-vw-')[0]) ? 1 : 0
                            trips[index] = {
                                ...trips[index],
                                status: temp.status,
                                shift_end_time: temp.shift_end_time,
                                splitIndex,
                                pick_time: temp.pick_time,
                                drop_time: temp.drop_time
                            }
                        }
                    })
                } else {
                    trips.map((trip, index) => {
                        this.socket.emit('createParent', { id: trip.driver_id, name: this.decoded.name, socket_id: this.socketId })
                    })
                }

                this.setState({ trips }, () => {
                    this.checkIsShift()
                    this.updateFooterHeight();
                    setTimeout(() => { this.fitAllMarkers() }, 1000);
                    resolve()
                })

            })
        })
    }

    // method to get data from database when user either send app to background and return to foregorund or if net disconnected and then connected
    getDataWhenAppNotKilled = async () => {
        this.setState({ trips: JSON.parse(await AsyncStorage.getItem('trips')) }, () => {
            this.updateTripStatus(this.state.trips)
        })
    }

    // method to check if there is  any shift currently if no then set footer size to 0
    checkIsShift = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem('trips')
            if (this.state.trips.filter(val => { return (val.shift_end_time === null && val.status && !['Absent','ParentLeft', 'Left'].includes(val.status.split('-vw-')[0]) )}).length > 0)
                this.setState({ isNoShift: false }, () => { console.log("checkIsShift if", this.state.footerHeight),resolve() })
            else {
                console.log("checkIsShift else")
                setTimeout(() => {
                    this.setState({ isNoShift: true, footerHeight: 0 })
                    resolve()
                }, 5000)
            }

        })
    }

    // initialize all state variables acoordingly
    preStateInit = (id, name) => {
        this.setState({
            userLocation: [...this.state.userLocation, { id: id }],
            steps: [...this.state.steps, { id: id, coordinates: [] }],
            time: [...this.state.time, { id: id }]
        }, () => {
            // this.socket.emit('createParent', { id, name, socket_id: this.socketId })  // create user in the specific room on socket
        })
    }

    assignGooglePathToPolyline = (data, isInitial) => {
        if (data.path) {
            data.path = PolyUtil.decode(data.path)
            let counter = 0
            let finalSteps = []
            let tempTrips = [...this.state.trips]
            let user_id = 0
            // convert latlong string into object
            data.path.map(singleCoord => {
                // finalSteps.push({ latitude: singleCoord[0], longitude: singleCoord[1] })
                finalSteps.push({ latitude: singleCoord.lat, longitude: singleCoord.lng })
            })

            tempTrips.map((singleTrip, index) => {
                if (singleTrip.shift_id === data.shift_id) {
                    // get path from user location till house location
                    const nearestPathCord = findNearest(this.convertToLatLong(singleTrip.coordinate.split('-vw-')[singleTrip.splitIndex]), finalSteps);
                    const nearestPathIndex = finalSteps.findIndex(x => x.latitude === nearestPathCord.latitude && x.longitude === nearestPathCord.longitude);

                    // for (let i = 0; i < finalSteps.length; i++) {
                    //     if ((isPointWithinRadius(finalSteps[i], this.convertToLatLong(singleTrip.coordinate.split('-vw-')[singleTrip.splitIndex]), 150))) {
                    //         counter = i
                    //         break;
                    //     }
                    // }
                    // save final values to variable and change state value 
                    tempTrips[index] = { ...tempTrips[index], pathCoordinate: finalSteps.slice(0, nearestPathIndex + 1) }
                    // tempTrips[index] = {...tempTrips[index], pathCoordinate: finalSteps}

                    if (isInitial) {
                        // remove path from map which driver already coverd
                        const nearestPathCord = findNearest(data.userLocation, tempTrips[index].pathCoordinate);
                        const nearestPathIndex = tempTrips[index].pathCoordinate.findIndex(x => x.latitude === nearestPathCord.latitude && x.longitude === nearestPathCord.longitude);

                        const home = this.convertToLatLong(singleTrip.coordinate.split('-vw-')[singleTrip.splitIndex]);
                        const driver = { longitude: data.userLocation.longitude, latitude: data.userLocation.latitude };
                        let value = Math.ceil(((haversine(home, driver, { unit: "km" })) / 10) * 60);
                        tempTrips[index] = {
                            ...tempTrips[index],
                            driverLocation: {
                                longitude: data.userLocation.longitude, latitude: data.userLocation.latitude,
                                longitudeDelta: data.userLocation.longitudeDelta, latitudeDelta: data.userLocation.latitudeDelta,
                                heading: data.userLocation.heading
                            },
                            driverTime: value,
                            pathCoordinate: tempTrips[index].pathCoordinate.slice(nearestPathIndex)
                        }
                        user_id = [...data.user]
                    }
                    else {
                        user_id = [...this.state.currentTurnUserId]
                    }
                }
            })
            this.setState({ trips: tempTrips, currentTurnUserId: user_id })
        }
    }

    getTrips = async () => {
        // get all trips 
        // this.props.getTodayTrips(this.decoded.id)
        //     .then(trips => {
        //         this.setState({ trips: trips })
        //     })
    }

    // method to assign same color for same shift in the footer
    assignColorToShift = () => {
        let sectionList = {}
        let color = 0
        this.driverChildData.map((shift, index) => {
            if (!shift.hasOwnProperty(shift.shift_id)) {
                sectionList[shift.shift_id] = this.state.colors[color]
                color++;
            }
        })
        this.setState({ shiftColor: sectionList })
    }

    // method to update child status (if there is any shift for current child or not)
    updateChildStatus = () => {
        return new Promise((resolve, reject) => {
            let childIds = [];
            let driverIds = [];
            let temp = [];
            this.driverChildData.map(child => { childIds.push(child.child_id); driverIds.push(child.driver_id) });
            if (driverIds.length > 0) {
                this.props.getStatus(childIds.toString(), driverIds.toString())
                    .then(status => {
                        let counter = 0;
                        let tempUserLocation = [...this.state.userLocation]
                        let tempSteps = [...this.state.steps]
                        let tempTime = [...this.state.time]
                        // loop through all childs and upadte status
                        this.driverChildData.map((singleData, index) => {
                            if (counter === status.length)
                                return
                            // if found temporary driver id and end time null then connect room of that driver 
                            if (status[counter].temp_driver_id !== null && status[counter].shift_end_time === null) {
                                this.socket.emit('createParent', { id: status[counter].temp_driver_id, name: singleData.child_name, socket_id: this.socketId })
                                this.socket.emit('leaveParent', { id: status[counter].driver_id }) // leave room from previous driver

                                // update driver id from all objects for current shift
                                tempUserLocation[index].id = status[counter].temp_driver_id
                                tempSteps[index].id = status[counter].temp_driver_id
                                tempTime[index].id = status[counter].temp_driver_id
                                // this.driverChildData[index] = {...this.driverChildData[index]}
                                this.setState({ userLocation: tempUserLocation, steps: tempSteps, time: tempTime })
                            }
                            else {
                                this.driverChildData.map(driver => {
                                    this.socket.emit('createParent', { id: driver.driver_id, name: driver.child_name, socket_id: this.socketId })
                                    temp.push(driver.status)  // push each child status on array to check if any child is in arrived state or not
                                })
                            }
                            // if user id and (driver or temporary driver id) match with current child then update all values in object
                            if (singleData.child_id === status[counter].user_id && (singleData.driver_id === status[counter].driver_id || singleData.driver_id === status[counter].temp_driver_id)) {
                                this.driverChildData[index] = { ...singleData, ...status[counter] }
                                // condition to check if shift is belong to temporary driver
                                // if (temproray driver detail is avaialable) and (if shift end time is null or if not null than difference with current time should be smaller than 5 seconds)
                                if (status[counter].name !== null && (status[counter].shift_end_time === null || Math.abs(new Date(status[counter].shift_end_time).getTime() - new Date().getTime()) <= 5000))
                                    this.driverChildData[index] = { ...this.driverChildData[index], driver_id: status[counter].temp_driver_id, profile_picture: status[counter].profile_picture, driver_name: status[counter].name, mobile_number: status[counter].mobile_number, registration_number: status[counter].registration_number }

                                counter++
                            }
                        })

                        // if any child's driver is in arrived mode then set isArrived tru else false
                        if (temp.includes('Arrived'))
                            this.setState({ isArrived: true })
                        else
                            this.setState({ isArrived: false })

                        this.sortFooter()
                        resolve()
                    })
            }
            else {
                this.setState({ isNewUser: true })
                resolve()
            }
        })
    }

    // sort footer when shift is on accroding to priority
    sortFooter = () => {
        return new Promise((resolve, reject) => {

            let dataTemp = [...this.driverChildData];
            let timeTemp = [...this.state.time]
            let userLocationTemp = [...this.state.userLocation]
            let stepsTemp = [...this.state.steps]
            let temp = [];

            // sorting of all footers according to new indexes
            temp = temp
                .concat(this.driverChildData.filter((singleData) => { return singleData.status === 'Arrived' }))
                .concat(this.driverChildData.filter((singleData) => { return singleData.status === 'Waiting' }))
                .concat(this.driverChildData.filter((singleData) => { return (singleData.status === 'Picked' || singleData.status === 'Dropped') }))
                .concat(this.driverChildData.filter((singleData) => { return (singleData.status === 'NotArrived') }))
                .concat(this.driverChildData.filter((singleData) => { return (singleData.status === 'ParentLeft') }))
                .concat(this.driverChildData.filter((singleData) => { return (singleData.status === 'Left') }))
                .concat(this.driverChildData.filter((singleData) => { return (singleData.status === 'completed' || singleData.status === undefined || singleData.status === 'Absent') }))
            this.driverChildData = [...temp]

            this.setState({ time: timeTemp, userLocation: userLocationTemp, steps: stepsTemp }, () => { this.updateFooterHeight(), resolve() })
        })
    }

    // method to change footer height according to current no of childs shift
    updateFooterHeight = () => {
        let counter = 0;
        this.state.trips.map((singleData, index) => {
            // if childs are in any one below status increase footer height untill 3 or smaller
            if ((singleData.status !== undefined && !['completed', 'ParentLeft', 'Absent'].includes(singleData.status.split('-vw-')[0])))
                counter < 3 ? counter++ : null;
        })

        // if counter is greater than 0 than set footerHeight to counter else set footer height to previous value
        this.setState(prevState => {
            return {
                ...prevState,
                footerHeight: counter === 0 ? prevState.footerHeight : counter
            }
        })
    }

    // method to calculate driver time from home
    // calculateTime = (driverObject) => {
    //     let temp = [...this.state.time] // temporary varaible to store state value
    //     let counter = 0;

    //     this.state.time.map((driverTime, index) => {
    //         if (driverObject.id === driverTime.id) {
    //             const home = this.driverChildData[index] ? this.convertToLatLong(this.driverChildData[index].coordinates) : { longitude: 24.915089, latitude: 67.089141 };
    //             const driver = { longitude: driverObject.longitude, latitude: driverObject.latitude };
    //             let value = Math.ceil(((haversine(home, driver, { unit: "km" })) / 10) * 60);
    //             temp[counter] = { id: driverObject.id, value: value }
    //             this.setState({ time: temp });
    //         }
    //         counter++;
    //     })


    // }

    // method to fit map screen according to no of markers
    fitAllMarkers = () => {
        // this.sound.play()
        if (this.state.isNoShift) {
            this.mapRef.animateToRegion({ ...this.getCoordinates()[0], latitudeDelta: 0.055, longitudeDelta: 0.035 })
            // this.mapRef.animateCamera({center: {...this.getCoordinates()[0]},pitch: 0, heading: (this.state.trip&&this.state.trip.driverLocation&&this.state.trip.driverLocation.heading) ? this.state.trip.driverLocation.heading : 360,altitude: 5, zoom: 30},500)
            // this.mapRef.setCamera({center: {...this.getCoordinates()[0]},pitch: 10, heading: (this.state.trip&&this.state.trip.driverLocation&&this.state.trip.driverLocation.heading) ? (this.state.trip.driverLocation.heading+25): 25,altitude: 5, zoom: 17},500)
            // this.mapRef.animateToNavigation({...this.getCoordinates()[0]}, (this.state.trip&&this.state.trip.driverLocation&&this.state.trip.driverLocation.heading) ? (this.state.trip.driverLocation.heading +360): 360, 360)
        } else {
            const DEFAULT_PADDING = { top: 150, right: 40, bottom: 300, left: 40 };
            this.mapRef && this.mapRef.fitToCoordinates(this.getCoordinates(), {
                edgePadding: DEFAULT_PADDING,
                animated: true
            });
        }
        // Linking.openURL('https://play.google.com/store/apps/details?id=com.eejaad.vanwala&hl=en')
    }

    // method to return coordinates of all markers (home and all drivers)
    getCoordinates = () => {
        let coordinates = [];
        // console.log(this.props.userData, ' asda', this.state.currentTurnUserId)
        this.state.trips.map(trip => {
            if (trip.coordinate && !['completed', 'ParentLeft', 'Absent'].includes(trip.status && trip.status.split('-vw-')[0])) {
                coordinates.push(this.convertToLatLong(trip.coordinate.split('-vw-')[trip.splitIndex]))
            }
            if (trip.driverLocation)
                coordinates.push({ latitude: trip.driverLocation.latitude, longitude: trip.driverLocation.longitude })

        })
        // this.state.userLocation.map((driver, index) => {
        //     coordinates.push(this.convertToLatLong(this.driverChildData[index].coordinates));
        //     if (driver.latitude)
        //         coordinates.push({ longitude: driver.longitude, latitude: driver.latitude });
        // })
        return coordinates
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    // method to change user coords string into lat and lon
    convertToLatLong = (centerPoint) => {
        if (centerPoint == undefined || this.state.isNoShift) {
            let temp = this.state.trips.length > 0 ? `${this.state.trips[0].coordinate.split('-vw-')[0]}`.split(',') : '24.9069,67.0814'
            centerPoint = { latitude: JSON.parse(temp[0]), longitude: JSON.parse(temp[1]), longitudeDelta: 0.035, latitudeDelta: 0.055 }
        }
        else {
            let temp = centerPoint.split(',')
            centerPoint = { latitude: JSON.parse(temp[0]), longitude: JSON.parse(temp[1]) }
        }
        return centerPoint;
    }

    // handleBackPress = () => {
    //     if (this.props.navigation.isFocused()) {
    //         Alert.alert(
    //             'Exit App',
    //             'Exiting the application?', [{
    //                 text: 'Cancel',
    //                 onPress: () => console.log('Cancel Pressed'),
    //                 style: 'cancel'
    //             }, {
    //                 text: 'OK',
    //                 onPress: () => BackHandler.exitApp()
    //             },], {
    //             cancelable: false
    //         }
    //         )
    //         return true;
    //     }
    //     else {
    //         return false
    //     }
    //     // //if back button is pressed & view is not opened close the app
    //     // if (!this.state.isTodayTripOpen) {
    //     //     this.props.navigation.navigate('HomeDashboard')
    //     //     return true
    //     // }
    //     // else {
    //     //     //otherwise close the  view 
    //     //     this.setState({ isBackButtonPressed: true }, () => { this.setState({ isBackButtonPressed: false }) });
    //     //     return true;
    //     // }
    // }

    // driver detail to show on modal
    onDriverDetail = (driverChild) => {
        this.setState({ pressedDriverDetail: driverChild, isDriverDetail: true })
    }

    getApproxDriverTime = (trip) => {
        let hours = new Date(new Date().getTime() + trip.driverTime * 60000).getHours() < 10 ? `0${new Date(new Date().getTime() + trip.driverTime * 60000).getHours()}` : new Date(new Date().getTime() + trip.driverTime * 60000).getHours()
        let minutes = new Date(new Date().getTime() + trip.driverTime * 60000).getMinutes() < 10 ? `0${new Date(new Date().getTime() + trip.driverTime * 60000).getMinutes()}` : new Date(new Date().getTime() + trip.driverTime * 60000).getMinutes()
        let seconds = new Date(new Date().getTime() + trip.driverTime * 60000).getSeconds() < 10 ? `0${new Date(new Date().getTime() + trip.driverTime * 60000).getSeconds()}` : new Date(new Date().getTime() + trip.driverTime * 60000).getSeconds()
        return `${hours}:${minutes}:${seconds}`
    }


    // Render method    
    render() {
        const todayTrips = (<TodayTrips trips={this.state.trips} navigation={this.props.navigation}></TodayTrips>)
        const dashboard = (<View style={styles.dashboard}>
            <TextWithStyle style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold', height: 30 }}>Check Your Trips</TextWithStyle>
            <TextWithStyle style={{ marginTop: 10 }}>Completed {'&'} Remaining</TextWithStyle>
            <TextWithStyle style={{ fontStyle: 'italic' }}>Swipe Up</TextWithStyle>
        </View>)
        const parentProfileHeader = (<View style={[styles.dragHeaderContainer]} >
            <TextWithStyle style={{ alignSelf: 'center', fontSize: 18, color: 'white' }}>Today Trips</TextWithStyle>
        </View >)

        const { trips, isNoShift, isNewAccount } = this.state

        if (this.state.loader === false) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.mapContainer}>
                        {/* header where profile info goes */}
                        {!this.state.isTodayTripOpen ?
                            <View style={[styles.headerContainer]}>
                                <Header openDrawer={this.onOpenDrawer} />
                            </View>
                            : null}

                        <MapView
                            style={styles.map}
                            // initialCamera={{
                            //     center: {
                            //         latitude: 24.9072291,
                            //         longitude: 67.0690,
                            //     },
                            //     pitch: 10,
                            //     heading: 40,

                            //     // Only when using Google Maps.
                            //     zoom: 20
                            // }}
                            userInterfaceStyle='light'
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{ latitude: 24.9072291, longitude: 67.0690, latitudeDelta: 0.055, longitudeDelta: 0.035 }}
                            // initialRegion={{...this.convertToLatLong(this.props.userData.coordinates), latitudeDelta: 0.1, longitudeDelta: 0.1}}
                            ref={(ref) => { this.mapRef = ref }}
                        >

                            {/* render multiple markers according to dirvers */}
                            {/* {trips.map((trip, index) => (
                               ((trip.shift_end_time!==undefined && trip.shift_end_time===null)) ?
                                    <View key={index}>
                                        {trip.status === 'Waiting' ?
                                            <Marker style={{ zIndex: 100 }} coordinate={{ longitude: trip.driverLocation.longitude, latitude: trip.driverLocation.latitude }}>
                                                <View ><TextWithStyle style={styles.markerText}>{trip.time} {trip.time < 2 ? 'min' : 'mins'}</TextWithStyle></View>
                                            </Marker>
                                            : null}

                                        {trip.driverLocation && <Marker coordinate={{ longitude: trip.driverLocation.longitude, latitude: trip.driverLocation.latitude }} rotation={trip.driverLocation.heading ? trip.driverLocation.heading + 360 : 360} >
                                            <View>
                                                <Image style={{ height: 60, width: 60, alignSelf: 'center' }} source={require('../../../../assets/icons/Bus-front3d.png')}></Image>
                                            </View>
                                        </Marker>}


                                    </View>
                                    : null
                            ))} */}

                            {trips.map((trip, index) => {
                                return (
                                    ((trip.shift_end_time !== undefined && trip.shift_end_time === null && trip.driverLocation)) ?
                                        <Marker key={index} anchor={{ x: 0.5, y: 0.5 }} coordinate={{ longitude: trip.driverLocation.longitude, latitude: trip.driverLocation.latitude }} rotation={trip.driverLocation.heading ? trip.driverLocation.heading + 360 : 360} >

                                            <View>
                                                <Image style={{ height: 60, width: 60, resizeMode: 'contain', alignSelf: 'center', }} source={require('../../../../assets/icons//vans/yellow-van-2d.png')}></Image>
                                            </View>
                                        </Marker>
                                        : null
                                )
                            })}

                            {/* marker for child home */}
                            {trips.map((trip, index) => (
                                <View key={index}>
                                    {/* {this.driverChildData[index].status === 'Waiting' ? <TextWithStyle style={styles.markerText}>{this.state.time[index].value} {this.state.time[index].value < 2 ? 'min' : 'mins'}</TextWithStyle> : null} */}
                                    {(trip.coordinate && trip.shift_end_time !== undefined && trip.shift_end_time === null && !isNoShift) &&
                                        <Marker coordinate={this.convertToLatLong(trip.coordinate.split('-vw-')[trip.splitIndex])} >
                                            <View>
                                                {/* {this.driverChildData[index].status === 'Waiting' ?  <TextWithStyle style={styles.markerText}>{this.state.time[index].value} {this.state.time[index].value < 2 ? 'min' : 'mins'}</TextWithStyle> : null} */}
                                                {(trip.driverTime > 0 && trip.status.split('-vw-')[1] !== 'Dropped') &&
                                                    <View style={{ backgroundColor: 'white', padding: 8, alignItems: 'center', elevation: 5, shadowColor: '#000', marginBottom: 5, shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.5, shadowRadius: 5 }}>
                                                        <TextWithStyle style={{ color: 'grey', fontSize: 12 }}>Arrival</TextWithStyle>
                                                        <TextWithStyle style={{ color: 'black' }}>{timeConverter(this.getApproxDriverTime(trip))}</TextWithStyle>
                                                    </View>}

                                                <Image style={{ height: 40, width: 40, alignSelf: 'center' }} source={require('../../../../assets/icons/new-house-3d.png')}></Image>
                                            </View>
                                        </Marker>}


                                </View>
                            ))}
                            {/* <View >
                                <Marker coordinate={{latitude: '24.908019', longitude: '67.083251'}} >
                                    <View>
                                        <View style={{backgroundColor: 'white', padding: 8, alignItems: 'center',shadowColor: '#000', marginBottom: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,  
    elevation: 5}}>
                                            <TextWithStyle style={{color: 'grey', fontSize: 12}}>Arrival</TextWithStyle>
                                            <TextWithStyle>{timeConverter(`${new Date(new Date().getTime()+30*60000).getHours()}:${new Date(new Date().getTime()+30*60000).getMinutes()}:${new Date(new Date().getTime()+30*60000).getSeconds()}`)}</TextWithStyle>
                                        </View>
                                        <Image style={{ height: 50, width: 50, alignSelf: 'center' }} source={require('../../../../assets/icons/new-house-3d.png')}></Image>
                                    </View>
                                </Marker>
                            </View> */}
                            {/* marker for school */}
                            {/* {this.driverChildData[0] !== undefined ?
                                
                                : null} */}

                            {/* render multiple polygon according to dirvers */}
                            {trips.map((trip, index) => (
                                (trip.shift_end_time !== undefined && trip.shift_end_time === null && ['Picked', 'Waiting'].includes(trip.status.split('-vw-')[1])) ?
                                    [
                                        (trip.pathCoordinate && trip.pathCoordinate.length > 0 && this.state.currentTurnUserId.includes(this.props.userData.id)) ? <Polyline key={index} coordinates={trip.pathCoordinate} strokeColor={Theme.PRIMARY_COLOR} strokeWidth={3} /> : null
                                    ] : null
                            ))}

                            {

                            }

                        </MapView>

                        {/* <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                <View style={styles.timerContainer}>
                                    <Image source={require('../../../../assets/icons/loader_driver.gif')} style={{ width: 180, height: 160 }} />
                                    <View style={{ position: 'absolute', bottom: 0, top: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}><TimerComponent timer={this.state.arrivedTimer} style={{ alignSelf: 'center' }} /></View>
                                </View>
                            </View> */}

                        {/* timer component */}
                        {this.state.isArrived === true ?
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                <View style={styles.timerContainer}>
                                    <Image source={require('../../../../assets/icons/loader_driver.gif')} style={{ width: 180, height: 160 }} />
                                    <View style={{ position: 'absolute', bottom: 0, top: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}><TimerComponent timer={this.state.arrivedTimer} style={{ alignSelf: 'center' }} /></View>
                                </View>
                            </View>
                            : null}

                        {/* when driver arrives timer start */}
                        {!isNoShift ?
                            <View style={[styles.footerContainer, { height: (this.state.footerHeight * 120) }]}>
                                {/* if there is any shift of any child show footer where student and van driver info goes */}
                                <ScrollView>
                                    {trips.map((driverChild, index) => {
                                        return (
                                            (driverChild.status && driverChild.shift_end_time !== undefined && driverChild.shift_end_time === null) &&
                                            <Footer key={index} onDriverDetail={this.onDriverDetail} color={driverChild.shift_id} driverChild={driverChild} time={driverChild.driverTime !== undefined ? driverChild.driverTime : null} timer={this.state.arrivedTimer} currentTurnUserId={this.state.currentTurnUserId} />
                                        )
                                    })}
                                </ScrollView>
                            </View>
                            : null
                        }

                        {/* target location icon */}
                        <View style={[styles.locateContainer, { bottom: `${this.state.footerHeight > 0 ? this.state.footerHeight * 20 : 20}%` }]}>
                            <TouchableOpacity onPress={this.fitAllMarkers}>
                                <Ionicons name="md-locate" size={25} color="#14345A" />
                            </TouchableOpacity>
                        </View>

                        {/* driver details popup */}
                        {this.state.isDriverDetail ?
                            <TouchableOpacity onPress={() => { this.setState({ isDriverDetail: false }) }} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 110 }}>
                                <View style={styles.driverDetailContainer}>
                                    <TouchableOpacity onPress={() => { this.setState({ isDriverDetail: false }) }} style={{ width: '80%', alignItems: 'flex-end', marginLeft: 20, marginTop: 10 }}>
                                        <Ionicons name="md-close" size={25} color="#143459" />
                                    </TouchableOpacity>

                                    <View style={{ width: 80, height: 80, backgroundColor: '#143459', borderRadius: 50, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Image source={{ uri: `${uploadUrl + '/' + this.state.pressedDriverDetail.driver_profile_picture}` }} style={{ width: 80, height: 80, alignSelf: 'center', borderRadius: 60 }} />
                                    </View>

                                    <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                                        <TextWithStyle style={{ fontSize: RF(2.6), marginTop: 10, marginBottom: 5, color: 'black' }}>Driver Name: {this.state.pressedDriverDetail.driver_name}</TextWithStyle>
                                        {/* <TextWithStyle style={{ fontSize: RF(2.6), marginBottom: 5, color: 'black' }}>Vehicle Type: {this.state.pressedDriverDetail.van_type}</TextWithStyle> */}
                                        <TextWithStyle style={{ fontSize: RF(2.6), color: 'black' }}>Vehicle Number: {this.state.pressedDriverDetail.driver_registration_number}</TextWithStyle>
                                        <TextWithStyle style={{ fontSize: RF(2.6), color: 'green', marginTop: 5, fontWeight: 'bold' }}>Verified Driver</TextWithStyle>
                                    </View>

                                    <View style={styles.button}>
                                        <TouchableOpacity style={{ width: '50%' }} onPress={() => { phonecall(this.state.pressedDriverDetail.driver_mobile_number, true) }}>
                                            <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                                {/* <Ionicons name="md-call" size={20} color="white" style={{ marginRight: 10, }} /> */}
                                                <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Call</TextWithStyle>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            : null}

                        {(isNoShift && !isNewAccount) ?
                            Platform.OS == 'ios'
                                ?
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('TodayTrips', { trips: this.state.trips }) }} style={[styles.dashboard, { flex: 1, position: 'absolute' }]}>
                                    {this.state.isTodayTripOpen ? parentProfileHeader : dashboard}
                                </TouchableOpacity>
                                :
                                <DraggableView
                                    initialDrawerSize={0.18}
                                    // renderContainerView={() => (locateIcon)}
                                    renderDrawerView={() => (todayTrips)}
                                    renderInitDrawerView={() => (this.state.isTodayTripOpen ? parentProfileHeader : dashboard)}
                                    Finished={(mode) => { this.setState({ isTodayTripOpen: mode }) }}
                                    closeView={this.state.isCloseView}
                                    viewClose={(bool) => this.setState({ isCloseView: bool })}
                                    parentBackButton={this.state.isBackButtonPressed}
                                />
                            : null
                        }

                        {(isNewAccount) &&
                            <View style={[styles.dashboard, { flex: 1, position: 'absolute' }]}>
                                <TextWithStyle style={{ marginTop: 10, fontSize: RF(4), fontWeight: 'bold', }}>Welcome To VanWala</TextWithStyle>
                                <TextWithStyle style={{ marginTop: 10 }}>Thank you for signup at Van Wala,</TextWithStyle>
                                <TextWithStyle style={{ textAlign: 'center' }}>Our customer support will contact you soon or call <TextWithStyle style={{ fontWeight: 'bold' }}>03458269252</TextWithStyle></TextWithStyle>
                            </View>
                        }


                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader />

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    timerContainer: {
        position: 'absolute',
        zIndex: 90,
        left: '15%',
        top: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('70%'),
        height: hp('30%'),
        shadowColor: 'black',
    },

    driverDetailContainer: {
        position: 'absolute',
        zIndex: 110,
        left: "15%",
        top: '20%',
        backgroundColor: 'white',
        width: wp('70%'),
        height: hp('43%'),
        borderRadius: 20,
        shadowColor: 'black',
        elevation: 30,
    },

    footerContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        zIndex: 100,
        left: 0,
    },

    dashboard: {
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        bottom: 0,
        width: '90%',
        height: '20%',
        borderBottomWidth: 0,
        shadowColor: 'black',
        elevation: 30,
        alignSelf: 'center',
    },

    headerContainer: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
    },

    dragHeaderContainer: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: "#14345A",
        height: 55,
        flex: 1,
        justifyContent: 'center',
    },

    locateContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        position: "absolute",
        right: 10,
        backgroundColor: "white",
        width: RF(7),
        height: RF(7),
        borderRadius: 50,
    },

    map: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    mapContainer: {
        position: 'relative',
        width: "100%",
        height: "70%",
        resizeMode: "cover",
        flex: 1
    },

    markerText: {
        color: 'white',
        paddingHorizontal: 10,
        backgroundColor: '#ee3d3c',
        borderRadius: 10,
        alignItems: 'center'
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        position: "absolute",
        alignSelf: 'center',
        bottom: 10,
    },

    nextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
        width: '100%',
        borderRadius: 10,
    },

    badgeIconView: {
        position: "absolute",
        width: wp("4%"),
        height: wp("4%"),
        borderRadius: 50,
        backgroundColor: "rgba(238,61,60,1)",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        top: -5,
        left: -5,
    },

    badge: {
        color: '#fff',
    },

    text: {
        fontWeight: '100',
        fontSize: wp(8),
        color: '#143459',
    }
});

mapStateToProps = (state) => {
    return {
        childs: state.map.childs,
        userData: state.user.userData,
        drivers: state.map.drivers,
        url: state.data.url,
        deviceToken: state.data.deviceToken,
        unseenNotifications: state.map.unseenNotifications,
        uploadUrl: state.data.uploadUrl,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSetChilds: (childs) => dispatch(setChilds(childs)),
        onSetDrivers: (drivers) => dispatch(setDrivers(drivers)),
        onSetUnseenNotifications: (number) => dispatch(setUnseenNotifications(number)),
        getChilds: (id, access) => dispatch(getChilds(id, access)),
        getDrivers: (childId) => dispatch(getDrivers(childId)),
        getStatus: (childId, driverId) => dispatch(getStatus(childId, driverId)),
        getTodayTrips: (parent_id) => dispatch(getTodayTrips(parent_id)),
        VWGeneralGetTripsData: (user_id) => dispatch(VWGeneralGetTripsData(user_id)),
        getUnseenNotifications: (parent_id) => dispatch(getUnseenNotifications(parent_id)),
        VWGeneralGetStatus: (user_id) => dispatch(VWGeneralGetStatus(user_id)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeParent);






