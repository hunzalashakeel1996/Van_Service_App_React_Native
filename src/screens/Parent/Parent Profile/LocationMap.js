// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Geolocation from 'react-native-geolocation-service';
import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { setHomeLocation } from '../../../../store/actions/dataAction';
import Header from './Header';
import TextWithStyle from '../../../components/TextWithStyle';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderWithoutDrawer from '../../../components/Header/HeaderWithoutDrawer';
import Toast from 'react-native-simple-toast';

class LocationMap extends Component {
    state = {
        coordinate: { latitude: 24.9355, longitude: 67.0755, latitudeDelta: 0.005, longitudeDelta: 0.005, }
    }

    static navigationOptions = {
        headerShown: false,
    };

    componentWillMount = async () => {
        this.token = this.props.route.params.token
        if (this.token)
            this.decoded = jwtDecode(this.token);
        else
            this.decoded = this.props.userData
    };


    componentDidMount = () => {
        Geolocation.getCurrentPosition(
            (position) => {
              console.log('position', position);
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        // // configuration for geolocation package
        // BackgroundGeolocation.configure({
        //     stopOnTerminate: false,
        //     distanceFilter: 1,
        //     interval: 2000,
        //     fastestInterval: 1000
        // });

        // BackgroundGeolocation.getCurrentLocation(async location => {
        //     this.setState({ coordinate: { ...location, latitudeDelta: 0.002, longitudeDelta: 0.002, } })
        // });
    };


    onNavigateProfileParent = () => {
        if (this.token) {
            AsyncStorage.setItem('jwt', this.token, () => {
                this.props.navigation.navigate('Home', { id: this.decoded.id })
            });
        }
        else
            this.props.navigation.navigate('ParentProfile')
    }

    onMarkerDrag = (location) => {
        this.setState({ coordinate: { ...location } }, () => {
        })
    }

    setLocation = () => {
        let address = `${this.state.coordinate.latitude},${this.state.coordinate.longitude}`;
        console.warn(address)
        this.props.onSetHomeLocation(this.decoded.id, address)
        Toast.show('New Home Location Set', Toast.LONG);
        this.onNavigateProfileParent()
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer} >
                    <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText='Home Location' />
                </View >

                <MapView
                    style={styles.map}
                    initialRegion={this.state.coordinate}
                    region={this.state.coordinate}
                    moveOnMarkerPress={true}
                    showsUserLocation={true}
                    // scrollEnabled={true}
                    // onPanDrag={(e) => {this.onMarkerDrag(e.nativeEvent.coordinate)}}
                    onRegionChangeComplete={(e) => { this.onMarkerDrag(e) }}
                // onMarkerDragEnd={(e) => {this.onMarkerDrag(e.nativeEvent.coordinate)}}
                // onPress={(e) => {console.warn(e.nativeEvent.coordinate)}}
                >
                    {/* <Marker coordinate={this.state.coordinate} draggable onDragEnd={(e) => {this.onMarkerDrag(e.nativeEvent.coordinate)}}>
          
          </Marker> */}
                </MapView>

                {/* <Image source={require('../../../../assets/icons/home.png')} style={{ width: 25, height: 25, position:'absolute', bottom: '50%', left: '50%' }} /> */}
                <Ionicons name="md-pin" style={{ position: 'absolute', bottom: '50%', left: '47%' }} size={40} color="#143459" />

                <View style={[styles.button]}>
                    <TouchableOpacity style={{ width: '100%' }} onPress={this.setLocation}>
                        <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                            <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Set Location</TextWithStyle>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
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

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        bottom: 10,
        alignSelf: 'center',
        width: '50%'
    },

    nextButton: {
        alignItems: 'center',
        padding: 10,
        width: '100%',
        // backgroundColor: "#143459",
        borderRadius: 8,
    },
})

mapStateToProps = (state) => {
    return {
        url: state.data.url,
        userData: state.user.userData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSetHomeLocation: (id, address) => dispatch(setHomeLocation(id, address)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationMap);
