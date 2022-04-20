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
    ToastAndroid,
    TouchableNativeFeedback,
    Dimensions, RefreshControl
} from 'react-native';
import Theme from '../../Theme/Theme';
import ButtonBorder from '../../components/button/ButtonBorder';
import RadioBox from '../../components/Radio/RadioBox';
import Button from '../../components/button/Button';
import Segment from '../../components/segment/Segment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Text from '../../components/text/TextWithStyle';
import timeConverter from '../../components/time/timeConverter';
import datetimeConventer, { formatDatetime, calcTimeDifference } from '../../components/time/datetimeConventer';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputWithIcon from '../../components/input/InputWithIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getTripDetails, getRequestTripDetails } from '../../../store/actions/dataAction';
import { connect } from "react-redux";
import LoaderModal from './../../components/modal/LoaderModal';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TripNameFormat from './../../components/util/TripNameFormat';
import { addTripDetails, resetTripDetails, addMyTripDetails } from './../../../store/actions/dataAction';
// import { connectSocket } from '../../../store/actions/socketAction';
// import { socketClose } from './../../../store/actions/socketAction';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { PolyUtil } from "node-geometry-library";
import TripCard from '../../components/card/TripCard';
import TripDetailItem from '../../components/listItem/TripDetailItem';

let mapRef = null
const MyTripDetail = (props) => {
    const [index, setIndex] = React.useState(0);
    // const [request_details, setRequestDetail] = React.useState(props.route.params?.trip);
    // const [mapRef, setMapRef] = React.useState(null);
    const [routes] = React.useState([
        { key: 'dashboard', title: 'Dashboard' },
        { key: 'activities', title: 'Activities' },
    ]);
    // const [contract, setContract] = React.useState({});
    const request_details = props.route.params?.trip;
    const [request_trip_timeDiff, setRequest_trip_timeDiff] = React.useState(null);
    const [googlePath, setGooglePath] = React.useState([]);

    useEffect(() => {
        // props.connectSocket(props.userData.id, addTripDetails);
        // socket.on('connect', () => {
        // socket.emit("createUser", { id: props.userData.id })

        // // socket.on('disconnect', () => {
        // //     console.log('connection to server lost.');
        // // });

        // socket.on('getTripData', (data) => {
        //     console.log("Passenger ====> socketsData =================",data)
        //     if(request_details.request_id == data.tripData.request_id){
        //         props.addTripDetails(data.tripData)
        //     }
        //     // store.dispatch(storePublicMessages([message]));
        // });
        // })

        didMount();


        return () => {
            // props.resetTripDetails();
            // props.socketClose();
            // console.warn("ScheduleTrip unMount")
        };
    }, [])

    const navigateScreen = (screen, params) => {
        props.navigation.navigate(screen, params)
    }

    const didMount = () => {
        // if (props.route.params?.trip) {
        // let request_details = props.route.params?.trip
        // setRequestDetail(request_details)
        // setRequest_trip_timeDiff(calcTimeDifference(request_details.requested_at, request_details.departure_date))
        // console.warn(props)
        getTripDetails();
        // }
        // else {
        //     // hit to database to get details request first then trip details
        //     props.getRequestTripDetails(props.route.params?.request_id).then(res => {
        //         let request_details = res[0]
        //         setRequestDetail(res[0])
        //         // setRequest_trip_timeDiff(calcTimeDifference(request_details.requested_at, request_details.departure_date))
        //         // console.warn(props)
        //         getTripDetails(request_details);
        //     })
        // }
    }
    const getTripDetails = () => {
        //  props.socket.off('getTripData').on('getTripData', (data) => {
        //     alert("ok");
        //     console.log("addMyTripDetialsSocket", data.tripData)
        //     // if (request_details.request_id == data.tripData.request_id) {
        //         props.addMyTripDetails(data.tripData)
        //     // }
        // });
        setRequest_trip_timeDiff(calcTimeDifference(request_details.requested_at, request_details.departure_date))
        // props.getTripDetails(request_details.request_id);
    }

    const sendOffers = () => {
        // let offers_detail = props.tripDetails.offers.newOffers.concat(props.tripDetails.offers.allOffers);
        props.trips["MT" + request_details.request_id].data.contract.length == 0 && navigateScreen("ViewOffers", { request_details });
    }

    const sendMyConfirmations = () => {
        // let myConfirmation_detail = props.tripDetails.myConfirmation.newMyConfirmation.concat(props.tripDetails.myConfirmation.allMyConfirmation);
        (props.trips["MT" + request_details.request_id].data.contract.length == 0) && navigateScreen("MyConfirmation", { request_details });
    }

    const sendDriverConfirmations = () => {
        // let driverConfirmation_detail = props.tripDetails.driverConfirmation.newDriverConfirmation.concat(props.tripDetails.driverConfirmation.allDriverConfirmation);
        // console.warn(driverConfirmation_detail)
        (props.trips["MT" + request_details.request_id].data.contract.length == 0) && navigateScreen("DriverConfirmation", { request_details });
    }

    const sendContract = () => {
        // let driverConfirmation_detail = props.tripDetails.driverConfirmation.newDriverConfirmation.concat(props.tripDetails.driverConfirmation.allDriverConfirmation);
        // console.warn(driverConfirmation_detail)
        props.trips["MT" + request_details.request_id].data.contract.length > 0 && navigateScreen("Contract", { request_details });
    }


    const filterData = (data) => {
        // let tempData = {
        //     new: [],
        //     all: [],
        // }
        // data.map(item => { item.isNew == true ? item.new : item.all; })
        // return tempData;
        let newData = data.filter(item => item.isNew == true)
        return newData.length;
    }

    // method to fit map screen according to no of markers
    const fitAllMarkers = async () => {
        const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
        let coordinates = [
            ...googlePath,
            { longitude: parseFloat(request_details.source_coordinate.split(',')[1]), latitude: parseFloat(request_details.source_coordinate.split(',')[0]) },
            { longitude: parseFloat(request_details.destination_coordinate.split(',')[1]), latitude: parseFloat(request_details.destination_coordinate.split(',')[0]) },
        ]
        mapRef.fitToCoordinates(coordinates, {
            edgePadding: DEFAULT_PADDING,
            animated: true
        });
    }

    const decodeGooglePath = async () => {
        let googleResponse = PolyUtil.decode(request_details.trip_path.replace('\\\\', '\\'))
        let finalSteps = []
        googleResponse.map(singleCoord => {
            finalSteps.push({ latitude: singleCoord.lat, longitude: singleCoord.lng })
        })
        setGooglePath([...finalSteps])
        setTimeout(() => { fitAllMarkers() }, 1000)
    }

    const DashboardRoute = () => {
        const tripData = props.trips["MT" + request_details.request_id].data;
        const newOffers = tripData.offers.length > 0 ? filterData(tripData.offers) : [];
        const newMyConfirmation = tripData.myConfirmation.length > 0 ? filterData(tripData.myConfirmation) : [];
        const newDriverConfirmation = tripData.driverConfirmation.length > 0 ? filterData(tripData.driverConfirmation) : [];

        return (
            <ScrollView style={{ flex: 1 }}
            // refreshControl={
            //     <RefreshControl refreshing={props.loading} onRefresh={() => didMount()} colors={[Theme.SECONDARY_COLOR,Theme.PRIMARY_COLOR]} />
            //     // <RefreshControl onRefresh={() => didMount()} colors={[Theme.SECONDARY_COLOR,Theme.PRIMARY_COLOR]} />
            // }
            >

                <View style={{ marginHorizontal: 15, marginTop: 15 }}>
                    {/* {request_details !== null && <View style={{ height: hp(15), justifyContent: "space-around" }}>
                        <View style={{ flex: 0.3, justifyContent: "flex-end" }}>
                            <Text style={{ color: Theme.BLUE_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{TripNameFormat(request_details.destination)}</Text>
                        </View>
                        <View style={{ flex: 0.3, justifyContent: "space-around" }}>
                            <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }}>JOB ID: {request_details.request_id}</Text>
                            <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }}>{formatDatetime(request_details.departure_date).datetime}</Text>
                        </View>
                    </View>} */}


                    <TripDetailItem
                        status={'Offers'} statusText={`Receive & view driver offers`}
                        newCount={newOffers} allCount={(tripData.offers.length - newOffers)}
                        isCompleted={tripData.contract.length > 0 || tripData.driverConfirmation.length > 0 || tripData.myConfirmation.length > 0}
                        onPress={() => sendOffers()}
                    />



                    {request_trip_timeDiff > 24 && <>
                        <TripDetailItem
                            status={'My Confirmation'} statusText={`View shortlisted offers`}
                            newCount={newMyConfirmation} allCount={(tripData.myConfirmation.length - newMyConfirmation)}
                            isCompleted={tripData.contract.length > 0 || tripData.driverConfirmation.length > 0}
                            onPress={() => (tripData.contract.length > 0 || tripData.driverConfirmation.length > 0 || tripData.myConfirmation.length > 0) && sendMyConfirmations()}
                        />
                        <TripDetailItem
                            status={'Driver Confirmation'} statusText={`12 hours to pay for reserved vans`}
                            newCount={newDriverConfirmation} allCount={(tripData.driverConfirmation.length - newDriverConfirmation)}
                            isCompleted={tripData.contract.length > 0}
                            onPress={() => (tripData.contract.length > 0 || tripData.driverConfirmation.length > 0) && sendDriverConfirmations()}
                        />
                    </>}
                    {/* </View> */}
                    {tripData.contract.length > 0 && <TripDetailItem
                        status={'Contract'} statusText={`View contract & final trip details`}
                        newCount={0} allCount={tripData.contract.length}
                        isCompleted={true}
                        onPress={() => sendContract()}
                    />}

                </View >
            </ScrollView>
        )
    };

    const ActivitiesRoute = () => (
        <View style={{ flex: 1, marginHorizontal: 15, flex: 1 }}>
            {/* {request_details !== null && <View style={{ height: hp(15), justifyContent: "space-around", borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, }}>
                <View style={{ flex: 0.3, justifyContent: "flex-end" }}>
                    <Text style={{ color: Theme.BLUE_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{TripNameFormat(request_details.destination)}</Text>
                </View>
                <View style={{ flex: 0.3, justifyContent: "space-around" }}>
                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }}>JOB ID: {request_details.request_id}</Text>
                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }}>{formatDatetime(request_details.departure_date).datetime}</Text>
                </View>
            </View>} */}

            <View style={{ alignItems: 'center', flex: 1, marginTop: 15 }}>
                <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.SECONDARY_COLOR }}>{request_details.trip_time} estimated time</Text>
                <Text style={{ marginTop: 5, fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.SECONDARY_COLOR }}>{request_details.trip_distance} approx</Text>


                <View style={{ width: '100%', height: 220, marginTop: 15 }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{ latitude: parseFloat(request_details.source_coordinate.split(',')[0]), longitude: parseFloat(request_details.source_coordinate.split(',')[1]), latitudeDelta: 0.08, longitudeDelta: 0.08, }}
                        ref={(ref) => { mapRef = ref; }}
                        zoomEnabled={false}
                        zoomTapEnabled={false}
                        rotateEnabled={false}
                        scrollEnabled={false}
                    >
                        {googlePath.length > 1 && <Polyline
                            coordinates={[...googlePath]}
                            strokeWidth={2}
                            strokeColor={Theme.SECONDARY_COLOR}
                        />}
                        <Marker coordinate={{ longitude: parseFloat(request_details.source_coordinate.split(',')[1]), latitude: parseFloat(request_details.source_coordinate.split(',')[0]) }} >
                            <View>
                                <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../../../assets/passenger/pick_large.png')}></Image>
                            </View>
                        </Marker>

                        <Marker coordinate={{ longitude: parseFloat(request_details.destination_coordinate.split(',')[1]), latitude: parseFloat(request_details.destination_coordinate.split(',')[0]) }} >
                            <View>
                                <Image style={{ height: 30, width: 30, alignSelf: 'center' }} source={require('../../../assets/passenger/drop_large.png')}></Image>
                            </View>
                        </Marker>
                    </MapView>
                </View>
            </View>
        </View >
    );

    const initialLayout = { width: Dimensions.get('window').width };

    const renderScene = SceneMap({
        dashboard: DashboardRoute,
        activities: ActivitiesRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: Theme.SECONDARY_COLOR }}
            style={{ backgroundColor: Theme.WHITE_COLOR, color: Theme.SECONDARY_COLOR }}
            activeColor={Theme.SECONDARY_COLOR}
            inactiveColor={Theme.BORDER_COLOR}
        />
    );

    return (
        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
            {/* <LoaderModal modalVisible={props.loading} /> */}
            {/* TRIP DETAIL CARD */}
            {request_details !== null && <TripCard
                key={request_details.request_id}
                data={{ ...request_details }}
                showBlock={true}
                ContainerStyle={{ backgroundColor: Theme.BORDER_COLOR_OPACITY }}
            />}
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={SceneMap({
                    dashboard: DashboardRoute,
                    activities: ActivitiesRoute,
                })}
                onIndexChange={(index) => { setIndex(index); if (index === 1) decodeGooglePath() }}
                initialLayout={initialLayout}
            />

        </Fragment >

    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
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
});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        tripDetails: state.data.tripDetails,
        trips: state.data.trips,
        socket: state.socket.socket,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // getTripDetails: (request_id) => dispatch(getTripDetails(request_id)),
        // getRequestTripDetails: (request_id) => dispatch(getRequestTripDetails(request_id)),
        addMyTripDetails: (data) => dispatch(addMyTripDetails(data)),
        // connectSocket: (userId, dispatchFunc) => dispatch(connectSocket(userId, dispatchFunc)),
        // socketClose: () => dispatch(socketClose()),
        // resetTripDetails: () => dispatch(resetTripDetails()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTripDetail);