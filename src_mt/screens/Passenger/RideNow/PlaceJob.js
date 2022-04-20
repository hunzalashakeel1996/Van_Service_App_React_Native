import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, PermissionsAndroid, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Theme from '../../../Theme/Theme';
import ButtonBorder from '../../../components/button/ButtonBorder';
import Text from '../../../components/text/TextWithStyle';
import Button from '../../../components/button/Button';
import Segment from '../../../components/segment/Segment';
import LocationMapModal from '../../../components/modal/LocationMapModal';
import Geolocation from 'react-native-geolocation-service';
import { getVehicleTypes, rideNowTripRequest } from '../../../../store/actions/dataAction';
import { connect } from "react-redux";
import LoaderModal from '../../../components/modal/LoaderModal';
import AsyncStorage from '@react-native-community/async-storage';
// import  {startSocketIO}  from '../../../components/util/socket';
import Toast from 'react-native-simple-toast';

class PlaceJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            controls: {
                pickupLoc: {
                    value: '',
                    validationRules: [
                        Validators.required("Pickup Location is required")
                    ]
                },
                dropLoc: {
                    value: '',
                    validationRules: [
                        Validators.required("Dropoff Location is required")
                    ]
                },
            },
            selectedVehical: 'Car',
            modalVisible: false,
            currentLocation: null,
            locationType: "pickupLoc",
            vehicles: [],
            isLoading: true
        }
    }

    componentDidMount = () => {
        this.checkStatus();
        this.props.getVehicleTypes().then(vehicles => {
            this.setState({ vehicles, isLoading: false })
            // this.props.navigation.navigate('DriverList')
        })

    }

    onMarkerDrag = (location) => {
        this.tempLocation = { ...location };
        // this.setState({ coordinate: { ...location } }, () => {
        // })
    }

    setValue = (type, val) => {
        let cont = { ...this.state.controls }
        cont[type].value = val;
        this.setState({ controls: cont });
        // this.validateChk();
        Validators.validation([type], cont).then(validate => {
            if (validate.formValid) {
                this.setState({ controls: validate.controls })
            } else {
                this.setState({ controls: cont });
            }
        });
    }

    setLocation = (location, isMapDrag) => {
        if (isMapDrag) {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.tempLocation.latitude + ',' + this.tempLocation.longitude + '&location_type=' + 'ROOFTOP' + '&key=' + 'AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8')
                .then((response) => response.json())
                .then((responseJson) => {
                    let location = { name: responseJson.results[0].formatted_address, location: `${this.tempLocation.latitude}, ${this.tempLocation.longitude}` };
                    this.setValue(this.state.locationType, location)
                })
        } else if (location.location == this.state.currentLocation) {
            // only execute when current location is selected
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.currentLocation.latitude + ',' + this.state.currentLocation.longitude + '&location_type=' + 'ROOFTOP' + '&key=' + 'AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8')
                .then((response) => response.json())
                .then((responseJson) => {
                    let location = { name: responseJson.results[0].formatted_address, location: `${this.state.currentLocation.latitude}, ${this.state.currentLocation.longitude}` };
                    this.setValue(this.state.locationType, location)
                })
        }
        else {
            let loc = { name: location.name, location: `${location.location.latitude}, ${location.location.longitude}` };
            this.setValue(this.state.locationType, loc)
        }

        // setValue(locationType, tempLocation)
        // location get "currentLoc" when this screen render and get current location (to dont show toast) 
        if (location != "currentLoc") {
       
                Toast.show('Location Changed Successfully', Toast.LONG)
        }
        this.setState({ modalVisible: false });
    }

    checkStatus = async () => {
        if (this.props.platform === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                this.getCurrentLocation();
            }
            else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.getCurrentLocation();
                    } else {
                        console.log('Camera permission denied');
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

    navigateToDriverList = () => {
        this.setState({ isLoading: true })
        let _data = {
            user_id: this.props.userData.id,
            source: this.state.controls.pickupLoc.value,
            destination: this.state.controls.dropLoc.value,
            vehicle_type: this.state.selectedVehical,
            departure_date: new Date(),
            departure_time: new Date(),
            userData: this.props.userData
        }

        this.props.rideNowTripRequest(_data).then(data => {
            _data = { ..._data, request_id: data.res.insertId }
            AsyncStorage.setItem('RideNowData', JSON.stringify(_data))
            this.setState({ isLoading: false })
            this.props.navigation.navigate('DriverList', { data: _data })
        })
        // this.props.navigation.back('Home')
    }

    render() {
        const { modalVisible, currentLocation, locationType } = this.state;
        return (
            <View style={styles.container}>
           <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />

                {this.props.route.name === "PlaceJob" && <LoaderModal modalVisible={this.state.isLoading} />}

                {/* opens location modal to set location */}
                {modalVisible && (
                    <LocationMapModal
                        modalVisible={modalVisible}
                        setModalVisible={isVisible => this.setState({ modalVisible: isVisible })}
                        coordinate={currentLocation}
                        locationType={this.state.locationType}
                        selectedLocation={this.state.locationType == "pickupLoc" ?
                            this.state.controls.pickupLoc.value : this.state.controls.dropLoc.value}
                        onMarkerDrag={loc => this.onMarkerDrag(loc)}
                        setLocation={(loc, isMapDrag) => this.setLocation(loc, isMapDrag)}
                    />
                )}
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{ latitude: 24.9355, longitude: 67.0755, latitudeDelta: 0.005, longitudeDelta: 0.005, }}
                >
                </MapView>

                <View style={styles.containerView}>
                    <View style={{ height: 75, marginHorizontal: 20, marginTop: 20 }}>
                        {/* pickup location */}
                        <ButtonBorder
                            iconName={require('../../../../assets/passenger/dot.png')}
                            iconStyle={{ width: 18, height: 18 }}
                            text={this.state.controls.pickupLoc.value ? this.state.controls.pickupLoc.value.name : "Pickup Location"}
                            onPress={() => { this.setState({ modalVisible: true, locationType: 'pickupLoc' }); }}
                            error={this.state.controls.pickupLoc.error}
                        />
                    </View>
                    <View style={{ height: 80, marginHorizontal: 20, }}>
                        {/* Drop location */}
                        <ButtonBorder
                            iconName={require('../../../../assets/passenger/driver.png')}
                            iconStyle={{ width: 25, height: 25 }}
                            text={this.state.controls.dropLoc.value ? this.state.controls.dropLoc.value.name : "Drop Off Location"}
                            onPress={() => { this.setState({ modalVisible: true, locationType: 'dropLoc' }); }}
                            error={this.state.controls.dropLoc.error}
                        />
                    </View>


                    <View style={styles.typeView}>
                        <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR, }}>Type:</Text>
                        {this.state.vehicles.map(single => (
                            <TouchableOpacity onPress={() => this.setState({ selectedVehical: single.name })}>
                                <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, marginHorizontal: 12, color: this.state.selectedVehical == single.name ? Theme.SECONDARY_COLOR : null, borderBottomWidth: this.state.selectedVehical == single.name ? 1 : 0, borderBottomColor: this.state.selectedVehical == single.name ? Theme.SECONDARY_COLOR : null }}>{single.name}</Text>
                            </TouchableOpacity>
                        ))}
                        {/* <TouchableOpacity onPress={() => this.setState({ selectedVehical: 'Car' })}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, marginHorizontal: 12, color: this.state.selectedVehical == "Car" ? Theme.SECONDARY_COLOR : null, borderBottomWidth: this.state.selectedVehical == "Car" ? 1 : 0, borderBottomColor: this.state.selectedVehical == "Car" ? Theme.SECONDARY_COLOR : null }}>Car</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ selectedVehical: 'Taxi' })}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, marginHorizontal: 12, color: this.state.selectedVehical == "Taxi" ? Theme.SECONDARY_COLOR : null, borderBottomWidth: this.state.selectedVehical == "Taxi" ? 1 : 0, borderBottomColor: this.state.selectedVehical == "Taxi" ? Theme.SECONDARY_COLOR : null }}>Taxi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ selectedVehical: 'Tricycle' })}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, marginHorizontal: 12, color: this.state.selectedVehical == "Tricycle" ? Theme.SECONDARY_COLOR : null, borderBottomWidth: this.state.selectedVehical == "Tricycle" ? 1 : 0, borderBottomColor: this.state.selectedVehical == "Tricycle" ? Theme.SECONDARY_COLOR : null, }}>Tricycle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ selectedVehical: 'Car6' })}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, marginHorizontal: 12, color: this.state.selectedVehical == "Car6" ? Theme.SECONDARY_COLOR : null, borderBottomWidth: this.state.selectedVehical == "Car6" ? 1 : 0, borderBottomColor: this.state.selectedVehical == "Car6" ? Theme.SECONDARY_COLOR : null, }}>Car (6 seater)</Text>
                        </TouchableOpacity> */}
                    </View>

                    <View style={{ flex: 0.25, marginHorizontal: 20, }}>
                        <Button onPress={() => this.navigateToDriverList()} loading={(this.state.isLoading && this.state.controls.dropLoc.value !== "")} styleButton={{ height: 50, borderRadius: 10, }} styleText={{ fontSize: Theme.FONT_SIZE_XXLARGE }}>
                            {(this.state.isLoading && this.state.controls.dropLoc.value !== "") ?
                                <ActivityIndicator size={30} color="#fff" style={{ paddingVertical: 9 }} />
                                :
                                `Submit`}
                        </Button>
                    </View>

                </View>

            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        // borderWidth: 1
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
    containerView: {
        flex: 0.45,
        // borderWidth: 1,
        backgroundColor: Theme.WHITE_COLOR,
    },
    typeView: {
        flex: 0.45,
        flexDirection: 'row',
        marginHorizontal: 30
        // borderWidth:1
    },
    segment: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        borderColor: Theme.PRIMARY_COLOR,
        borderBottomWidth: 2,
    },
    title: {
        fontSize: Theme.FONT_SIZE_LARGE,
        color: Theme.BORDER_COLOR,
    },
});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        platform: state.util.platform
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getVehicleTypes: () => dispatch(getVehicleTypes()),
        rideNowTripRequest: (data) => dispatch(rideNowTripRequest(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceJob);
