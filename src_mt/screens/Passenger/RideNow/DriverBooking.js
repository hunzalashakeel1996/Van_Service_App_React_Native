import React, { Component } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import ButtonBorder from '../../../components/button/ButtonBorder';
import Text from '../../../components/text/TextWithStyle';
import Theme from '../../../Theme/Theme';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../../components/button/Button';
import Rating from '../../../components/rating/Rating';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from "react-redux";
import LoaderModal from '../../../components/modal/LoaderModal';
import momentDate from '../../../components/time/momentDate';
import TimerComponent from '../../../components/time/TimerComponent';
import { rideNowBookTrip, uploadUrl } from '../../../../store/actions/dataAction';
import AsyncStorage from '@react-native-community/async-storage';
import { convertDatetime } from '../../../components/time/datetimeConventer';
import Slider from './../../../components/slider/Slider';
import { StackActions, CommonActions } from '@react-navigation/native'

class DriverBooking extends Component {
    state = {
        trip: null,
        isLoading: true,
        slides: null,
        activeSlide: 0,
    }

    componentDidMount = () => {
        let tripData = this.props.route.params?.trip;

        let tempSlides = [];
        for (let i = 1; i <= 8; i++) {
            if (tripData['car_image' + i] != null) {
                tempSlides.push(tripData['car_image' + i])
            }
        }
        // this.setState({ offer: this.props.route.params?.offer, trip:  this.props.route.params?.trip, isLoading: false })
        this.setState({ trip: tripData, slides: tempSlides, isLoading: false })
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{}}>
                <Image style={{ width: "100%", height: "100%", resizeMode: "contain", borderRadius: 2 }} source={{ uri: `${uploadUrl}/${item}` }} />
                {/* <Text style={styles.title}>{ item.title }</Text> */}
            </View>
        );
    }

    navigateToDriverOnRoute = () => {
        this.props.navigation.navigate('DriverOnRoute');
    }

    onBookTrip = () => {
        let temp = { ...this.state.trip, 'status': 'booked', 'user_id': this.props.userData.id, 'customer_name': this.props.userData.name }
        this.props.rideNowBookTrip(temp).then(res => {
            AsyncStorage.setItem('RideNowData', JSON.stringify(temp))

            const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: 'DriverOnRoute', params: { data: temp } }],
            });
              this.props.navigation.dispatch(resetAction);

            // this.props.navigation.navigate('DriverOnRoute', { data: temp });

        })
    }

    onRequestTimeout = (offer) => {
        this.props.navigation.goBack(null)
    }

    //@conf get selected bid driver time limit
    calcDriverTimeLimit = () => {
        return (this.state.trip.driver_time_limit * 60) - (convertDatetime(this.state.trip.quoted_at).diff);
    }

    render() {
        const {slides, activeSlide} = this.state;
        if (!this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <View style={{ height: 35, marginHorizontal: 20, marginTop: 20, flexDirection: 'row', }}>
                        <Image source={require('../../../../assets/passenger/dot.png')} style={{ width: 20, height: 20 }}></Image>
                        <Text style={{ color: Theme.BORDER_COLOR, marginLeft: 10, marginTop: 3 }}>{`From`}</Text>
                        <Text numberOfLines={1} style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginLeft: 10, marginTop: 3, width: '80%' }}>{this.state.trip.source.name}</Text>
                    </View>
                    <View style={{ height: 35, marginHorizontal: 20, flexDirection: 'row' }}>
                        <Image source={require('../../../../assets/passenger/driver.png')} style={{ width: 20, height: 20 }}></Image>
                        <Text style={{ color: Theme.BORDER_COLOR, marginLeft: 10, marginTop: 3 }}>To</Text>
                        <Text numberOfLines={1} style={{ fontFamily: Theme.FONT_FAMILY_BOLD, marginLeft: 10, marginTop: 3, width: '80%' }}>{this.state.trip.destination.name}</Text>
                    </View>

                    <View style={{ height: 20, marginHorizontal: 20 }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_LARGE }}>{this.state.trip.vehicle_name}</Text>
                    </View>

                    <View style={{ height: 30, flexDirection: 'row' }}>
                        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                            <Text style={{ color: Theme.BORDER_COLOR }}>Year: </Text>
                            <Text>{this.state.trip.year}</Text>
                        </View>
                        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                            <Text style={{ color: Theme.BORDER_COLOR }}>Color: </Text>
                            <Text>{this.state.trip.color}</Text>
                        </View>
                        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                            <Text style={{ color: Theme.BORDER_COLOR }}>Plate No: </Text>
                            <Text>{this.state.trip.registration_number}</Text>
                        </View>
                    </View>
                    <View style={{ height: 30, flexDirection: 'row' }}>
                        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                            <Image source={require('../../../../assets/passenger/seats.png')} style={{ width: 20, height: 20, }}></Image>
                            <Text style={{ marginLeft: 10, color: Theme.BORDER_COLOR }}>Seats ({this.state.trip.vehicle_no_of_seats})</Text>
                        </View>
                        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                            <Image source={require('../../../../assets/passenger/ac.png')} style={{ width: 20, height: 20 }}></Image>
                            <Text style={{ marginLeft: 10, color: Theme.BORDER_COLOR }}>A/C {this.state.trip.aircon}</Text>
                        </View>
                    </View>

                    {/* <View style={{ height: '35%', flexDirection: 'row', marginLeft: 20, marginRight: 20, marginBottom: 10 }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../../../../assets/car/2019.jpg')} />
                    </View> */}
                    <View style={{ height: hp(25), marginVertical: 10 }}>
                        {slides != null && <Slider
                            data={slides}
                            renderItem={this._renderItem}
                            activeSlide={activeSlide}
                            setActiveSlide={(item) => { this.setState({ activeSlide: item }) }} />}
                    </View>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginHorizontal: 50 }}>
                        <Image style={{ width: 100, height: 100, borderRadius: 100 / 2, }} source={require('../../../../assets/passenger/banda.jpg')}></Image>
                    </View>

                    <View style={{ justifyContent: 'flex-start', flexDirection: 'column', marginTop: -87 }}>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_LARGE, marginBottom: 5 }}>{this.state.trip.name}</Text>
                        </View>
                        <View style={{ marginLeft: 20, flexDirection: 'row' }}>
                            <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD }}>{this.state.trip.rated} </Text>
                            <Rating starCount={5} starSize={Theme.FONT_SIZE_MEDIUM} disabled={true} rating={this.state.trip.rated} />
                            <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, }}>  ({this.state.trip.reviews})</Text>
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BLUE_COLOR }}>Joined: {momentDate(this.state.trip.created_at)}</Text>
                        </View>
                    </View>

                    <View style={{ height: 45, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                            <Text style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5, paddingBottom: 5, backgroundColor: Theme.GREEN_COLOR, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.WHITE_COLOR }}>Completed: {this.state.trip.trip_completed}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 30 }}>
                            <Text style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5, paddingBottom: 5, backgroundColor: Theme.RED_COLOR, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.WHITE_COLOR }}>Cancelled: {this.state.trip.trip_canceled}</Text>
                        </View>
                    </View>

                    <View style={{ height: 38, marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: Theme.SECONDARY_COLOR, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, }}>
                            <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{`You have`}</Text>
                            <TimerComponent timer={this.calcDriverTimeLimit()}
                                timeCompleted={() => { this.onRequestTimeout() }}
                                textStyle={{ fontSize: 17 }}
                                animate={false} />
                            <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{`to accept this offers`}</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: Theme.SECONDARY_COLOR, height: 50, marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', }}>
                        <Button onPress={this.onBookTrip} styleButton={{ height: 50, borderRadius: 10, }} loading={this.props.loading} styleText={{ fontSize: Theme.FONT_SIZE_LARGE }}>
                            {!this.props.loading ?
                                `BOOK NOW FOR Php ${this.state.trip.payment} `
                                :
                                <ActivityIndicator size={30} color="#fff" style={{ paddingVertical: 9 }} />}
                        </Button>
                    </View>

                </View>
            )
        }
        else {
            return (
                this.props.route.name === "DriverBooking" && <LoaderModal modalVisible={this.state.isLoading} />
            )
        }
    }
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
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
        rideNowBookTrip: (data) => dispatch(rideNowBookTrip(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverBooking);