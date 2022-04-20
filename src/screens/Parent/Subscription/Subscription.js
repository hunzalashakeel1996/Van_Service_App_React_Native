import DateTimePicker from '@react-native-community/datetimepicker';
import React, { Component } from 'react';
import { Image, PermissionsAndroid, ScrollView, StyleSheet, TouchableOpacity, View, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { connect } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';

import { VWGeneralInsertTrip, getSubscriptionFee } from '../../../../store/actions/dataAction';
import FullLengthButton from '../../../components/FullLengthButton';
import TextWithStyle from '../../../components/TextWithStyle';
import timeConverter from '../../../components/timeConverter';
import Theme from '../../../Theme/Theme';
import Header from '../Parent Profile/Header';
import Loader from './../../../components/Loader';
import LocationMapModal from './../../../../src_mt/components/modal/LocationMapModal';
// import ButtonBorder from './../../../../src_mt/components/button/ButtonBorder';
import LocationButtonBorder from './../../../../src_mt/components/button/LocationButtonBorder';
import Validators from './../../../../src_mt/components/validator/Validators';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";

class Subscription extends Component {
    static navigationOptions = {
        header: null,

    };

    state = {
        timeType: null,
        modalVisible: null,
        loader: true,
        tripSelected: 'OneWay',
        is_five_days: true,
        fees: 0,
        // days: [{ abbrevation: "M", value: true, name: "Monday" }, { abbrevation: "T", value: false, name: "Tuesday" }, { abbrevation: "W", value: false, name: "Wednesday" },
        // { abbrevation: "T", value: false, name: "Thursday" }, { abbrevation: "F", value: false, name: "Friday" }, { abbrevation: "S", value: false, name: "Saturday" }, { abbrevation: "S", value: false, name: "Sunday" }],
        packageName: 'monthly',
        controls: {
            pickTime: {
                value: '',
                validationRules: [
                    Validators.required("Pickup Time is required"),
                ]
            },
            dropTime: {
                value: '',
                validationRules: [
                    Validators.required("Drop Time is required"),
                ]
            },
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
        },
        currentLocation: null
    }

    componentDidMount = () => {
        // this.setState({ loader: true })
        // this.props.getSubscriptionFee()
        //     .then(res => {
        //         console.log('dssd', res)
        //         this.checkStatus();
        //         this.setState({ fees: res.fee })
        //     })
        this.checkStatus();
    }


    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    DayPressed = (index) => {
        let temp = [...this.state.days]
        temp[index].value = !temp[index].value
        this.setState({ days: temp })
    }

    onChangePackage = (packageName) => {
        let temp = [...this.state.packageName]
        temp = packageName
        this.setState({ package: temp })
    }

    setTime = (time) => {
        time = new Date(time)
        let temp = { ...this.state.controls }
        temp[this.state.timeType].value = `${time.getHours()}:${time.getMinutes()}`
        this.setState({ controls: temp, timeType: null })
    }

    onSave = () => {
        this.setState({ loader: true })
        const { tripSelected, controls, days, packageName, is_five_days } = this.state
        // let keys = tripSelected === 'OneWay' ? ['pickTime', 'pickupLoc', 'dropLoc']
        //         : ['pickTime', 'dropTime', 'pickupLoc', 'dropLoc']
        let keys = ['pickTime', 'dropTime', 'pickupLoc', 'dropLoc']
        Validators.validation(keys, { ...controls }).then(validate => {
            if (validate.formValid) {
                let data = {
                    pickTime: controls.pickTime.value,
                    dropTime: controls.dropTime.value,
                    pickLocation: controls.pickupLoc.value,
                    dropLocation: controls.dropLoc.value,
                    is_five_days,
                    user_id: this.props.userData.id,
                    packageName,
                    tripSelected
                }
                this.props.VWGeneralInsertTrip(data).then(res => {
                    console.log('res', res)
                    this.setState({ loader: false })
                    Toast.show(`Your trip has been created successfully`, Toast.LONG);
                    this.props.navigation.navigate('Auth')
                })
            }
            else {
                this.setState({ controls: validate.controls, loader: false })
            }
        })
    }

    setLocation = (location, isMapDrag, stateName) => {
        if (isMapDrag) {
            let data = {
                latitude: this.tempLocation.latitude,
                longitude: this.tempLocation.longitude,
            }
            this.getLocationFromCoordinates(data, stateName)
        } else if (location.location == this.state.currentLocation) {
            // only execute when current location is selected
            let data = {
                latitude: this.state.currentLocation.latitude,
                longitude: this.state.currentLocation.longitude,
            }
            this.getLocationFromCoordinates(data, stateName);
        }
        else {
            let loc = { name: `${location.name}`, detailName: location.detailName, location: `${location.location.latitude}, ${location.location.longitude}` };
            let temp = { ...this.state.controls }
            temp[stateName].value = loc
            this.setState({ controls: temp })
        }

        // setValue(locationType, tempLocation)
        // location get "currentLoc" when this screen render and get current location (to dont show toast) 
        if (location != "currentLoc") {
            // this.props.platform === 'android' ?
            Toast.show('Location Changed Successfully', Toast.LONG)
            // :
            // ToastIOS.show('Location Changed Successfully', ToastIOS.LONG)
        }
        this.setState({ modalVisible: null });
    }

    checkStatus = async () => {
        if (Platform.OS == 'ios') {
            this.getCurrentLocation();
        }
        else {
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
                        console.warn('aaa')
                    }
                    this.setState({ loader: false })
                } catch (err) {
                    console.warn('errerr');
                }
            }
        }

    }

    getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                let cord = Object.assign(position.coords, { latitudeDelta: 0.005, longitudeDelta: 0.005, });
                this.setState({ currentLocation: cord, loader: false });
                this.tempLocation = cord;
                this.setLocation("currentLoc", true, 'pickupLoc')
            },
            (error) => {
                // See error code charts below.
                console.warn(error.code, error.message);
                this.getCurrentLocation()
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    getLocationFromCoordinates = (data, stateName) => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + data.latitude + ',' + data.longitude + '&location_type=' + 'ROOFTOP' + '&key=' + 'AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8')
            .then((response) => response.json())
            .then((responseJson) => {
                // format string with first occurence comma
                const s = responseJson.results[0].formatted_address.split(",");
                const name = s[0];
                const detailName = s.slice(1).join().trim();
                console.warn(detailName)

                // format end
                let location = { name: `${name}`, detailName, location: `${data.latitude}, ${data.longitude}` };
                let temp = { ...this.state.controls }
                temp[stateName].value = location
                this.setState({ controls: temp, loader: false })
            })
    }

    onMarkerDrag = (location) => {
        this.tempLocation = { ...location };
    }

    render() {
        const { tripSelected, days, packageName, timeType, modalVisible, currentLocation, loader, is_five_days } = this.state
        const { pickTime, dropTime, pickupLoc, dropLoc } = this.state.controls
        if (!loader) {
            return (
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.headerContainer} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText='Schedule your trip' />
                    </View >

                    {modalVisible !== null && (
                        <LocationMapModal
                            modalVisible={true}
                            setModalVisible={isVisible => this.setState({ modalVisible: null })}
                            coordinate={currentLocation}
                            locationType={modalVisible}
                            selectedLocation={modalVisible == "pickupLoc" ?
                                pickupLoc.value : dropLoc.value}
                            onMarkerDrag={loc => this.onMarkerDrag(loc)}
                            setLocation={(loc, isMapDrag) => this.setLocation(loc, isMapDrag, modalVisible)}
                        />
                    )}

                    <View style={{}}>
                        {/* <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { this.setState({ tripSelected: 'OneWay' }) }} style={[styles.tripSelectView, { borderBottomColor: tripSelected == 'OneWay' ? Theme.PRIMARY_COLOR : Theme.BORDER_COLOR_2 }]}>
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: tripSelected == 'OneWay' ? Theme.PRIMARY_COLOR : Theme.BORDER_COLOR }}>One Way</TextWithStyle>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { this.setState({ tripSelected: 'RoundTrip' }) }} style={[styles.tripSelectView, { borderBottomColor: tripSelected == 'RoundTrip' ? Theme.PRIMARY_COLOR : Theme.BORDER_COLOR_2 }]}>
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: tripSelected == 'RoundTrip' ? Theme.PRIMARY_COLOR : Theme.BORDER_COLOR }}>Round Trip</TextWithStyle>
                        </TouchableOpacity>
                    </View> */}

                        {/* body  */}
                        <View style={{ marginTop: 10, flex: 1, marginHorizontal: 15 }}>
                            {console.log('bccc', pickupLoc)}
                            <LocationButtonBorder
                                iconName={require('../../../../assets/passenger/dot1.png')}
                                iconStyle={{ width: 18, height: 18 }}
                                text={pickupLoc.value}
                                defaultText={"Pickup Location"}
                                onPress={() => { this.setState({ modalVisible: 'pickupLoc' }) }}
                                error={pickupLoc.error ? 'Pickup location is required' : false}
                            />

                            <LocationButtonBorder
                                iconName={require('../../../../assets/passenger/driver1.png')}
                                iconStyle={{ width: 18, height: 18 }}
                                defaultText={"Drop Off Location"}
                                text={dropLoc.value}
                                onPress={() => { this.setState({ modalVisible: 'dropLoc' }) }}
                                error={dropLoc.error ? 'Drop location is required' : false}
                            />

                            <View style={{ flexDirection: 'row', height: 40, marginTop: 10 }}>
                                <TouchableOpacity onPress={() => { this.setState({ timeType: 'pickTime' }) }} activeOpacity={0.6} style={styles.timeContainer}>
                                    <View style={{ flex: 0.5, alignItems: 'center' }}><Image style={styles.icon} source={require('../../../../assets/passenger/calendar.png')} /></View>
                                    <TextWithStyle>{pickTime.value !== '' ? timeConverter(`${pickTime.value.split(':')[0] < 10 ? '0' + pickTime.value.split(':')[0] : pickTime.value.split(':')[0]}:${pickTime.value.split(':')[1] < 10 ? '0' + pickTime.value.split(':')[1] : pickTime.value.split(':')[1]}:00`) : 'Start Time'}</TextWithStyle>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { this.setState({ timeType: 'dropTime' }) }} activeOpacity={0.6} style={[styles.timeContainer, { marginLeft: 20 }]}>
                                    <View style={{ flex: 0.5, alignItems: 'center' }}><Image style={styles.icon} source={require('../../../../assets/passenger/calendar.png')} /></View>
                                    <TextWithStyle>{dropTime.value !== '' ? timeConverter(`${dropTime.value.split(':')[0] < 10 ? '0' + dropTime.value.split(':')[0] : dropTime.value.split(':')[0]}:${dropTime.value.split(':')[1] < 10 ? '0' + dropTime.value.split(':')[1] : dropTime.value.split(':')[1]}:00`) : 'Off Time'}</TextWithStyle>
                                </TouchableOpacity>
                                {timeType !== null &&
                                    <DateTimePickerModal
                                        isVisible={timeType !== null}
                                        mode="time"
                                        onConfirm={(time) => { this.setTime(time) }}
                                        onCancel={() => { this.setState({ timeType: null }) }}
                                    />}
                            </View>
                            {/* {timeType !== null && <DateTimePicker 
                                style={{width: 200, height: 200, flex: 1,}} //add this
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                textColor='black'
                                mode={'time'} 
                                value={new Date()} 
                                is24Hour={false} 
                                onChange={(event, datetime) => { this.setTime(event, datetime) }} />} */}
                            {(pickTime.error || dropTime.error) && <View style={{ flexDirection: 'row' }}>
                                <TextWithStyle style={{ flex: 0.5, color: 'red' }}>{pickTime.error ? 'Pickup Time Required' : null}</TextWithStyle>
                                <TextWithStyle style={{ flex: 0.5, marginLeft: 20, color: 'red' }}>{dropTime.error ? 'Drop Time Required' : null}</TextWithStyle>
                            </View>}
                            <View style={{ height: 50, marginTop: 20, }}>
                                <TextWithStyle style={{ marginLeft: 5 }}>Days:</TextWithStyle>
                                {/* {days.map((day, i) => (
                                    <TouchableOpacity onPress={() => { this.DayPressed(i) }} activeOpacity={0.6} style={{ borderWidth: 1, height: 40, width: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: days[i].value ? Theme.PRIMARY_COLOR : null }}>
                                        <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: days[i].value ? 'white' : 'black' }}>{day.abbrevation}</TextWithStyle>
                                    </TouchableOpacity>
                                ))} */}

                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            style={{ marginRight: Platform.OS == 'ios' ? 5 : 0 }}
                                            value={is_five_days ? true : false}
                                            onValueChange={() => { this.setState({ is_five_days: !is_five_days }) }}
                                            tintColors={{ true: Theme.PRIMARY_COLOR }}
                                        />
                                        <TextWithStyle style={styles.label}>5 days a week</TextWithStyle>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            style={{ marginRight: Platform.OS == 'ios' ? 5 : 0 }}
                                            value={is_five_days ? false : true}
                                            onValueChange={() => { this.setState({ is_five_days: !is_five_days }) }}
                                            tintColors={{ true: Theme.PRIMARY_COLOR }}
                                        />
                                        <TextWithStyle style={styles.label}>6 days a week</TextWithStyle>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{ marginTop: 40, marginBottom: 20 }}>
                        <FullLengthButton onPress={this.onSave}>Save</FullLengthButton>
                    </View>
                </ScrollView>
            )
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
    headerContainer: {
        width: '100%',
        marginBottom: 5,
        top: 0,
        left: 0,
        zIndex: 100,
        justifyContent: 'center'
    },

    tripSelectView: {
        paddingVertical: 15,
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
    },

    timeContainer: {
        flex: 0.5,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: Theme.BORDER_COLOR_2,
        alignItems: 'flex-end',
        paddingBottom: 5
    },

    packageContainer: {
        flex: 0.8,
        borderWidth: 2,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
        height: 130,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderColor: '#14345A'
    },

    icon: {
        width: 20,
        height: 20
    },

    locationContainer: {
        borderWidth: 2,
        borderColor: Theme.BORDER_COLOR_2,
        height: 45,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },

    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: 'center',
        flex: 0.5
    },
})


mapStateToProps = (state) => {
    return {
        uploadUrl: state.data.uploadUrl,
        userData: state.user.userData,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSetChilds: (childs) => dispatch(setChilds(childs)),
        VWGeneralInsertTrip: (data) => dispatch(VWGeneralInsertTrip(data)),
        getSubscriptionFee: () => dispatch(getSubscriptionFee()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);