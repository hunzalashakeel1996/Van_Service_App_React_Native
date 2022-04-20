import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../../../components/text/TextWithStyle';
import Theme from '../../../Theme/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Rating from '../../../components/rating/Rating';
import { getTripDetails, url } from '../../../../store/actions/dataAction';
import { connect } from "react-redux";
import LoaderModal from '../../../components/modal/LoaderModal';
import TimerComponent from '../../../components/time/TimerComponent';
import { convertDatetime } from '../../../components/time/datetimeConventer';
// import io from 'socket.io-client';
// import  {socket}  from '../../../components/util/socket';

class DriverList extends Component {
  state = {
    offers: [],
    tripData: this.props.route.params?.data,
    isLoading: true,
    refreshing: false
  }

  componentDidMount = () => {
    // socket.on('rideNowAvailableQuotes', (data => {
    //   data.passengerData.quoted_at = new Date().toUTCString()
    //   let temp = [...this.state.offers]
    //   temp.splice(0, 0, data.passengerData)
    //   this.setState({ offers: temp })
    // }))

    this.getAvailableTrips()
    // let tripData = this.props.route.params?.data
    // this.props.getTripDetails(tripData.request_id).then(offers => {
    //   offers = offers.filter(offer => {return offer.status !== 'booking_decline'})
    //   this.setState({ offers, tripData, isLoading: false })
    // })
  }

  getAvailableTrips = () => {
    this.setState({refreshing: true})
    this.props.getTripDetails(this.state.tripData.request_id).then(offers => {
      offers = offers.filter(offer => { return (offer.status !== 'booking_decline' || offer.status !== 'booked_decline')})
      this.setState({ offers, refreshing: false, isLoading: false })
    })
  }

  navigateToDriverBooking = (item) => {
    let data = Object.assign(item, this.state.tripData)
    this.props.navigation.navigate('DriverBooking', { trip: data })
  }

  onRequestTimeout = (offer) => {
    let temp = [...this.state.offers]
    temp = temp.filter((data) => { return data.quote_id !== offer.quote_id })
    this.setState({ offers: temp })
  }

  //@conf get selected bid driver time limit
  calcDriverTimeLimit = (offer) => {
    return ((offer.driver_time_limit * 60) - (convertDatetime(offer.quoted_at).diff));
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={{ flex: 1, }}>
          <View style={{ flex: 0.05, marginHorizontal: 20, marginTop: 22 }}>
            <Text style={{ fontSize: Theme.FONT_SIZE_XXLARGE, fontFamily: Theme.FONT_FAMILY_BOLD }}>Available Rides :</Text>
          </View>

          <FlatList data={this.state.offers} style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.getAvailableTrips()} />
            }
            renderItem={({ item, index }) => (
              <>
                <TouchableOpacity onPress={() => this.navigateToDriverBooking(item)}>
                  <View style={styles.content}>
                    <View style={{ justifyContent: 'space-evenly' }}>
                      <Image style={{ width: 70, height: 70 }} source={require('../../../../assets/car/toyota.jpg')} />
                      {/* <Text style={{fontFamily: Theme.FONT_FAMILY_LATO,color: Theme.SECONDARY_COLOR,justifyContent: 'space-between', marginTop:10}}></Text> */}
                      <Rating starCount={5} starSize={Theme.FONT_SIZE_XLARGE} disabled={true} rating={item.rated} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                      <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM, }}>{item.vehicle_name}</Text>
                      <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>{item.color} {item.year}</Text>
                      <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Seats ({item.vehicle_no_of_seats})</Text>
                      <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, color: Theme.SECONDARY_COLOR, color: Theme.BORDER_COLOR, marginTop: 5 }}> {item.reviews} Review </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
                      <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_LARGE, color: Theme.SECONDARY_COLOR, }}>Php {item.payment}</Text>
                      {/* <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.BORDER_COLOR, borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: Theme.BORDER_COLOR_OPACITY, borderBottomColor: Theme.BORDER_COLOR_OPACITY, padding: 5, }}>{`making one stop`}</Text> */}
                      <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_MEDIUM, color: Theme.RED_COLOR, }}>{'5 mint away'}</Text>
                    </View>
                  </View>

                  <View style={[styles.contentAnotherBox]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, }}>
                      <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{`You have`}</Text>
                      <TimerComponent timer={this.calcDriverTimeLimit(item)}
                        timeCompleted={() => { this.onRequestTimeout(item) }}
                        textStyle={{ fontSize: 17 }}
                        animate={false} />
                      <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{`to accept this offers`}</Text>
                    </View>
                  </View>

                </TouchableOpacity>
              </>
            )}
            keyExtractor={(item, index) => index.toString()}
          />


        </View>
      )
    }
    else {
      return (
        this.props.route.name === "DriverList" && <LoaderModal modalVisible={this.state.isLoading} />
      )

    }
  }
};

const styles = StyleSheet.create({
  content: {
    // flex:1,
    height: hp(17),
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    // borderRadius: 5,
    backgroundColor: '#ffff',
    // elevation: 2,
    borderWidth: 1,
    borderColor: Theme.BORDER_COLOR_OPACITY,
    // marginBottom:10
  },
  contentAnotherBox: {
    flex: 1,
    // marginTop:10,
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#ffff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderRightColor: Theme.BORDER_COLOR_OPACITY,
    borderLeftColor: Theme.BORDER_COLOR_OPACITY,
    borderBottomColor: Theme.BORDER_COLOR_OPACITY,
    marginBottom: 10
  },
  imageView: {
    // marginTop: 10,
    // marginLeft: 10,
    // marginBottom: 10,
    // borderWidth:1,
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
    getTripDetails: (request_id) => dispatch(getTripDetails(request_id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverList);