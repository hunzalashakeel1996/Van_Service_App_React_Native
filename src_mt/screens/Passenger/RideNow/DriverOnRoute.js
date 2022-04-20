import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Theme from '../../../Theme/Theme';
import Text from '../../../components/text/TextWithStyle';
import Rating from '../../../components/rating/Rating';
import Icon from 'react-native-vector-icons/Ionicons';
import { rideNowGetBookedTrip, uploadUrl, url } from '../../../../store/actions/dataAction';
import { connect } from "react-redux";
import LoaderModal from './../../../components/modal/LoaderModal';
import AsyncStorage from '@react-native-community/async-storage';
// import io from 'socket.io-client';
// import  {socket}  from '../../../components/util/socket';

class DriverOnRoute extends Component {
  state = {
    trip: this.props.route.params?.data,
    isLoading: true
  }

  componentDidMount = () => {
  //   socket.on('rideNowStatusChange', (data => {
  //     data.status && this.onStatusChange(data.status)
  // }))

    this.props.rideNowGetBookedTrip(this.state.trip).then(tripData => {
      this.onStatusChange(tripData[0].status)
    })

  }

  onStatusChange = (status) => {
    let temp = { ...this.state.trip }
    temp.status = status

    this.setState({ trip: temp, isLoading: false }, () => {
      if (temp.status === 'payment_received') {
        AsyncStorage.removeItem("RideNowData")
        this.props.navigation.navigate("PlaceJob")
      } else {
        setTimeout(() => {
          this.fitAllMarkers()
        }, 1000);
      }
    })
  }

  // method to fit map screen according to no of markers
  fitAllMarkers = () => {
    const DEFAULT_PADDING = { top: 150, right: 40, bottom: 600, left: 40 };
    let coordinates = [
      { longitude: parseFloat(this.state.trip.source.location.split(',')[1]), latitude: parseFloat(this.state.trip.source.location.split(',')[0]) },
      { longitude: parseFloat(this.state.trip.destination.location.split(',')[1]), latitude: parseFloat(this.state.trip.destination.location.split(',')[0]) }
    ]
    this.mapRef.fitToCoordinates(coordinates, {
      edgePadding: DEFAULT_PADDING,
      animated: true
    });
  }

  render() {
    if(!this.state.isLoading){
    return (
      <View style={[styles.container]}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{ latitude: 24.9355, longitude: 67.0755, latitudeDelta: 0.005, longitudeDelta: 0.005, }}
          ref={(ref) => { this.mapRef = ref }}
        >
          <Marker coordinate={{ longitude: parseFloat(this.state.trip.source.location.split(',')[1]), latitude: parseFloat(this.state.trip.source.location.split(',')[0]) }} >
            <View>
              <Image style={{ height: 40, width: 40, alignSelf: 'center' }} source={require('../../../../assets/passenger/pick_large.png')}></Image>
            </View>
          </Marker>

          <Marker coordinate={{ longitude: parseFloat(this.state.trip.destination.location.split(',')[1]), latitude: parseFloat(this.state.trip.destination.location.split(',')[0]) }} >
            <View>
              <Image style={{ height: 40, width: 40, alignSelf: 'center' }} source={require('../../../../assets/passenger/drop_large.png')}></Image>
            </View>
          </Marker>
        </MapView>

        {this.state.trip.status === 'booked' && <View style={[styles.containerView]}>
          <Text style={{ fontSize: Theme.FONT_SIZE_XLARGE, textAlign: 'center' }}>Driver is <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, }}>12</Text> min away</Text>
        </View>}

        <View style={[styles.contentView]}>
          <View style={{ flex: 1, flexDirection: 'row-reverse', }}>

            <View style={{ flex: 1, marginRight: 10, marginTop: 15, flexDirection: 'column', alignSelf: 'flex-end', }}>
              <View style={{ flex: 0.2, marginLeft: 60 }}>
                <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_XXLARGE, color: Theme.SECONDARY_COLOR }}> Php {this.state.trip.payment} </Text>
              </View>
              <View style={{ flex: 0.3, marginLeft: 15, flexDirection: 'column', justifyContent: 'center', backgroundColor: Theme.BLACK_COLOR }}>
                <Text style={{ alignSelf: 'center', fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_XXLARGE, color: Theme.WHITE_COLOR }}> {this.state.trip.registration_number} </Text>
              </View>
              <View style={{ flex: 0.42, marginTop: 10, marginLeft: 15 }}>
                <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, fontFamily: Theme.FONT_FAMILY_BOLD }}>Color: {this.state.trip.color} </Text>
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 15, marginTop: 15, flexDirection: 'column', alignSelf: 'flex-start', }}>
              <View style={{ flex: 0.1, }}>
                <Text style={{ marginLeft: 20, fontFamily: Theme.FONT_FAMILY_BOLD }}> {this.state.trip.name} </Text>
              </View>
              <View style={{ flex: 0.16, marginLeft: 20, flexDirection: 'row', }}>
                <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, paddingTop: 10 }}>{this.state.trip.rated} </Text>
                <Rating starCount={5} starSize={Theme.FONT_SIZE_MEDIUM} disabled={true} rating={this.state.trip.rated} />
                <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_LARGE, marginBottom: 5, paddingTop: 8 }}>  ({this.state.trip.reviews} Review)</Text>
              </View>
              <View style={{ flex: 0.54, marginLeft: 20, }}>
                <Image style={{ width: 110, height: 110, borderRadius: 2, }} source={{ uri: `${uploadUrl}/${this.state.trip.car_image1}` }} />
              </View>
              <View style={{ flex: 0.15, marginLeft: 20, flexDirection: 'row', }}>
                <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD }}> {this.state.trip.vehicle_name} </Text>
                <Text style={{ color: Theme.BORDER_COLOR }}> {this.state.trip.vehicle_no_of_seats} seats </Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 0.52, justifyContent: 'center', }}>

            <View style={{ flex: 0.12, marginBottom: 20, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: Theme.FONT_SIZE_XLARGE, fontFamily: Theme.FONT_FAMILY_BOLD }}>{`Estimated Drop Off:`} <Text style={{ color: Theme.RED_COLOR }}> {`12 Min`} </Text></Text>
            </View>

            <View style={{ flex: 1, marginBottom: 10, marginTop: 25, borderWidth: 1, borderColor: Theme.SECONDARY_COLOR, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
              <TouchableOpacity style={{ flex: 0.48, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: Theme.SECONDARY_COLOR, flexDirection: 'row' }}>
                <Text style={{ fontSize: Theme.FONT_SIZE_XLARGE, fontFamily: Theme.FONT_FAMILY_BOLD, color: Theme.SECONDARY_COLOR }}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 0.48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ fontSize: Theme.FONT_SIZE_XLARGE, fontFamily: Theme.FONT_FAMILY_BOLD, color: Theme.SECONDARY_COLOR, }}>Text</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </View>
    )}
    else {
      return (
        this.props.route.name === "DriverOnRoute" && <LoaderModal modalVisible={this.state.isLoading} />
      )

    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
    flex: 0.05,
    backgroundColor: Theme.WHITE_COLOR,
    marginHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Theme.BORDER_COLOR_OPACITY
  },
  contentView: {
    flex: 0.5,
    // borderWidth: 1,
    backgroundColor: Theme.WHITE_COLOR,
  },
});

const mapStateToProps = state => {
  return {
    loading: state.ui.isLoading,
    userData: state.user.userData,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    rideNowGetBookedTrip: (data) => dispatch(rideNowGetBookedTrip(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverOnRoute);