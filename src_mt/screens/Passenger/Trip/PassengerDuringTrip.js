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
    Dimensions,
    FlatList
} from 'react-native';
import React, { Fragment, useState, useEffect, Component } from 'react';
import { connect } from "react-redux";
import LoaderModal from '../../../components/modal/LoaderModal';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Theme from '../../../Theme/Theme';
import Text from '../../../components/text/TextWithStyle';
import OfferCard from '../../../components/card/OfferCard';
import TripCard from '../../../components/card/TripCard';
import Button from '../../../components/button/Button';
import { onTripStatusChange } from "../../../../store/actions/dataAction";
import { PolyUtil } from "node-geometry-library";

const { height, width } = Dimensions.get("window")

const PassengerDuringTrip = (props) => {
    const request_details = props.route.params?.request_details;
    const [contract_detail, setContract_detail] = React.useState(props.trips["MT" + request_details.request_id]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [googlePath, setGooglePath] = React.useState([]);
    const [trip_status, setTripStatus] = React.useState(contract_detail.trip_status);
    let mapRef = null

    useEffect(() => {
        // props.socket.off('onTripStatusChange').on('onTripStatusChange', (socketData) => {
        //     console.log(socketData.data)
        //     if(socketData.data.request_id == contract_detail.request_id){
        //         setTripStatus(socketData.data.trip_status)
        //         setContract_detail({...contract_detail, trip_status: socketData.data.trip_status})
        //         // if(socketData.data.trip_status === 'Completed')
        //         //     props.navigation.navigate('PassengerFeedback', {trip: socketData.data} )
        //     }         
        // })
        setTimeout(() => {
            fitAllMarkers()
        }, 1000);
    }, [])

    useEffect(() => {
        setContract_detail(props.trips["MT" + request_details.request_id]);
        setTripStatus(props.trips["MT" + request_details.request_id].trip_status)
    }, [props.trips])

    // method to fit map screen according to no of markers
    const fitAllMarkers = async () => {
        const DEFAULT_PADDING = { top: height, right: 50, bottom: height-500, left: 50 };
        let coordinates = [
            { longitude: parseFloat(contract_detail.source_coordinate.split(',')[1]), latitude: parseFloat(contract_detail.source_coordinate.split(',')[0]) },
            { longitude: parseFloat(contract_detail.destination_coordinate.split(',')[1]), latitude: parseFloat(contract_detail.destination_coordinate.split(',')[0]) }
        ]
        mapRef.fitToCoordinates(coordinates, {
            edgePadding: DEFAULT_PADDING,
            animated: true
        });

        decodeGooglePath()
    }

    const decodeGooglePath = async () => {
        let googleResponse = PolyUtil.decode(contract_detail.trip_path)
        let finalSteps = []
        googleResponse.map(singleCoord => {
            finalSteps.push({ latitude: singleCoord.lat, longitude: singleCoord.lng })
        })
        setGooglePath([...finalSteps])

    }

    // const onStatusChange = () => {
    //     let tempStatus = ''
    //     switch (trip_status){
    //         case null:
    //             setTripStatus('OnWay')
    //             tempStatus='OnWay'
    //             break;
    //         case 'OnWay':
    //             setTripStatus('Arrived')
    //             tempStatus='Arrived'
    //             break;
    //         case 'Arrived':
    //             setTripStatus('Picked')
    //             tempStatus='Picked'
    //             break;
    //         case 'Picked':
    //             setTripStatus('Completed')
    //             tempStatus='Completed'
    //             break;
    //         default:
    //             break;a
    //     }
    //     let data={
    //         request_id: contract_detail.request_id,
    //         trip_status: tempStatus,
    //         user_id: contract_detail.user_id
    //     }
    //     setIsLoading(true)
    //     props.onTripStatusChange(data).then(res => {
    //         if(tempStatus === 'Completed'){
    //             props.navigation.navigate('DriverHome')
    //         }
    //         setIsLoading(false)
    //     })
    // }

    return (
        <Fragment>
            {props.route.name === "PassengerDuringTrip" && <LoaderModal modalVisible={isLoading} />}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{ latitude: parseFloat(contract_detail.source_coordinate.split(',')[0]), longitude: parseFloat(contract_detail.source_coordinate.split(',')[1]), latitudeDelta: 0.005, longitudeDelta: 0.005, }}
                ref={(ref) => { mapRef = ref }}

            >
                {googlePath.length > 1 && <Polyline
                    coordinates={[...googlePath]}
                    strokeWidth={2}
                    strokeColor={Theme.SECONDARY_COLOR}
                />}
                <Marker coordinate={{ longitude: parseFloat(contract_detail.source_coordinate.split(',')[1]), latitude: parseFloat(contract_detail.source_coordinate.split(',')[0]) }} >
                    <View>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../../../../assets/passenger/pick_large.png')}></Image>
                    </View>
                </Marker>

                <Marker coordinate={{ longitude: parseFloat(contract_detail.destination_coordinate.split(',')[1]), latitude: parseFloat(contract_detail.destination_coordinate.split(',')[0]) }} >
                    <View>
                        <Image style={{ height: 30, width: 30, alignSelf: 'center' }} source={require('../../../../assets/passenger/drop_large.png')}></Image>
                    </View>
                </Marker>
            </MapView>

            <View style={{ marginTop: 10 }}>
                <TripCard data={{ ...contract_detail, upcomingTrip: request_details.upcomingTrip }} />
            </View>

            <View style={styles.bottomView}>
                {/* <Button onPress={onStatusChange}>
                    {trip_status === null ? "Start Trip" :
                    trip_status === 'OnWay' ? "Arrived" :
                    trip_status === 'Arrived' ? "Pick" :
                    trip_status === 'Picked' ? "Drop" : 'Completed'}
                </Button> */}
                <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'white' }}>
                    {trip_status === null ? "Trip not started yet" :
                        trip_status === 'OnWay' ? "On the way - Pickup" :
                            trip_status === 'Arrived' ? "Driver is waiting outside" :
                                trip_status === 'Picked' ? "On the way - Destination" : 'Trip completed'}
                    {/* trip_status === 'Picked' ? "Trip in progress" : 'Trip completed'} */}
                </Text>
            </View>

        </Fragment >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
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
    content: {
        flex: 0.45,
        backgroundColor: Theme.WHITE_COLOR,
        borderRadius: 10,
        marginHorizontal: 3
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: Theme.SECONDARY_COLOR,
        height: 50,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

const mapStateToProps = state => {
    return {
        // loading: state.ui.isLoading,
        // userData: state.user.userData,
        driverDetails: state.user.driverDetails,
        quotationList: state.data.quotationList,
        socket: state.socket.socket,
        trips: state.data.trips,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTripStatusChange: (data) => dispatch(onTripStatusChange(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PassengerDuringTrip);
