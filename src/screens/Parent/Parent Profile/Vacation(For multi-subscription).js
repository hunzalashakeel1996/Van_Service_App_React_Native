import React, { Component } from 'react';
import { DatePickerAndroid, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import { getTrips, updateVacation, VWGeneralGetTrips } from '../../../../store/actions/dataAction';
import HeaderWithoutDrawer from '../../../components/Header/HeaderWithoutDrawer';
import Loader from '../../../components/Loader';
import ChildAbsent from '../../../components/modals/ChildAbsent';
import TextWithStyle from '../../../components/TextWithStyle';

class Vacation extends Component {
    state = {
        loader: false,
        trips: [],
        vacationStartDate: '',
        vacationEndDate: '',
        isModal: false,
        selectedItem: {},
        selectedOption: 'Both Way',
        months: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    }

    static navigationOptions = {
        headerShown: false,
    };

    componentDidMount() {
        this.didMount()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.didMount()
        });

    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    didMount = () => {
        this.setState({ loader: true })
        // get all trips of current child
        this.props.VWGeneralGetTrips(this.props.userData.id)
            .then(trips => {
                // this.setState({ trips: trips })
                this.combineArray(trips)
                this.setState({ loader: false })
            })
    }

    // combine both completed and remaining trips return from backend
    combineArray = (trips) => {
        let tempTrips = {};

        trips.map(trip => {
            if (tempTrips.hasOwnProperty(`VW-${trip.subscription_id}`))
                tempTrips[`VW-${trip.subscription_id}`].push(trip)
            else
                tempTrips[`VW-${trip.subscription_id}`] = [trip];
        })

        tempTrips = Object.values(tempTrips)
        console.log(tempTrips)
        this.setState({ trips: tempTrips, loader: false })
    }

    // open date picker to select start and end date for vacation
    openDate = async (dateType) => {
        try {
            // open date picker to select starting date
            let { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                month++;
                if (dateType === 'start')
                    this.setState({ vacationStartDate: `${year}-${month}-${day}` })
                else
                    this.setState({ vacationEndDate: `${year}-${month}-${day}` })


                //again open date apicker after start date picked to select end date
                // endDate = await DatePickerAndroid.open({
                //   date: new Date(),
                // });

                // if (action !== DatePickerAndroid.dismissedAction) {
                //   endDate.month++;
                //   this.setState({ vacationEndDate: `${endDate.year}-${endDate.month}-${endDate.day}` })
                // }
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    // when user submit date for vacation
    submitDate = () => {
        this.setState({ isModal: false, loader: true })
        // if user select some date then run backend query else cancel the modal
        if (this.state.vacationEndDate !== '' && this.state.vacationStartDate !== '') {
            this.props.updateVacation(this.state.selectedItem, this.state.selectedOption, this.state.vacationStartDate, this.state.vacationEndDate)
                .then(res => {
                    this.props.VWGeneralGetTrips(this.props.userData.id)
                        .then(trips => {
                            this.setState({ trips: trips }, () => {
                                this.setState({ loader: false, trips: this.state.trips, vacationStartDate: '', vacationEndDate: '' })
                            })
                        })
                })
        }
        else
            this.setState({ loader: false })
    }

    tConvert = (time) => {
        if (time !== null && time !== undefined) {
            time = time.slice(0, -3)
            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
            if (time.length > 1) { // If time format correct
                time = time.slice(1);  // Remove full string match value
                time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return (time.join('')); // return adjusted time or original string
        }
    }

    getMonth = (date) => {
        if (date[5] === '0')
            return this.state.months[JSON.parse(date[6]) - 1]
        else
            return this.state.months[JSON.parse(date[5] + date[6]) - 1]

    }


    render() {
        const { userData } = this.props
        return (
            <View style={{ flex: 1 }}>
                <View style={[styles.headerContainer]} >
                    <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText={`Leave/Off days`} />
                </View >

                {this.state.loader === false ? <>
                    <FlatList
                        data={this.state.trips}
                        contentContainerStyle={{ paddingTop: 10 }}
                        renderItem={({ item, index }) => {
                            const trip1 = item[0] // item[0] has trip details of subscription (same subscription_id)
                            const trip2 = item[1] // item[1] has trip details of subscription (same subscription_id)
                            return (<View style={styles.container}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40, backgroundColor: '#143459', borderRadius: 50 }}>
                                        <Image source={require('../../../../assets/icons/gender_free.png')} style={{ width: 25, height: 25 }} />
                                    </View>

                                    {/* user name  */}
                                    <View style={{ marginLeft: 15, justifyContent: 'center', flex: 1 }}>
                                        <TextWithStyle numberOfLines={1} style={[styles.headerText]}>{userData.name}</TextWithStyle>
                                        <View style={{ flex: 1, paddingTop: 3 }}>
                                            <TextWithStyle numberOfLines={1} style={[styles.bodyText]}>Source: {trip1.source}</TextWithStyle>
                                            <TextWithStyle numberOfLines={1} style={[styles.bodyText]}>Destination: {trip1.destination}</TextWithStyle>
                                        </View>
                                    </View>

                                </View>
                                <View>
                                    <View style={{ marginTop: 15, flex: 1 }}>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                                <View style={{ flex: 0.4, alignItems: 'flex-start', paddingVertical: 3 }}><TextWithStyle style={{ fontSize: wp(3), }}>{this.tConvert(trip1.pick_time)}</TextWithStyle></View>
                                                <View style={{ flex: 0.4, alignItems: 'flex-end', paddingVertical: 3 }}><TextWithStyle style={{ fontSize: wp(3), }}>{this.tConvert(trip1.drop_time)}</TextWithStyle></View>
                                            </View>

                                            {/*Line image of school and home row */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                                <View style={{ alignItems: 'flex-start', marginLeft: 20 }}><Image source={require('../../../../assets/icons/house.png')} style={{ width: 30, height: 25 }} /></View>
                                                <View style={{ flex: 0.8, justifyContent: 'space-evenly' }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                        <View style={{ height: hp(0.2), width: wp(42), backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                        <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
                                                        <View style={{ height: hp(0.2), width: wp(42), backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                        <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                    </View>
                                                </View>

                                                <View style={{ alignItems: 'flex-end', marginRight: 20 }}><Image source={require('../../../../assets/icons/school3d.png')} style={{ width: 30, height: 25 }} /></View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                                <View style={{ flex: 0.4, alignItems: 'flex-start', paddingVertical: 3 }}><TextWithStyle style={{ fontSize: wp(3), }}>{this.tConvert(trip2.drop_time)}</TextWithStyle></View>
                                                <View style={{ flex: 0.4, alignItems: 'flex-end', paddingVertical: 3 }}><TextWithStyle style={{ fontSize: wp(3), }}>{this.tConvert(trip2.pick_time)}</TextWithStyle></View>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                                <View style={{ flex: 1, paddingTop: 8, justifyContent: 'space-around', alignItems: 'center' }}>
                                    {(trip1.shift_id != null && trip1.shift_id != -1 && trip2.shift_id != null && trip2.shift_id != -1) ?
                                        trip1.vacation_end == null ?
                                            <TouchableOpacity style={[styles.button, { backgroundColor: "#ee3d3c" }]} onPress={() => this.setState({ isModal: true, selectedItem: item })}>
                                                <TextWithStyle style={{ fontSize: wp('3.5%'), color: "#fff" }}> Vacation </TextWithStyle>
                                            </TouchableOpacity>
                                            : <TextWithStyle style={{ fontSize: wp('3%'), }}>{`${trip1.vacation_start.substring(8, 10)} ${this.getMonth(trip1.vacation_start)} Till ${trip1.vacation_end.substring(8, 10)} ${this.getMonth(trip1.vacation_end)}`}</TextWithStyle>
                                        : <TextWithStyle style={{ fontSize: wp('3%'), }}>{`No driver assigned for this trip`}</TextWithStyle>}
                                </View>
                            </View>)
                        }
                        }
                        keyExtractor={(index) => JSON.stringify(index)}
                    />


                    {this.state.isModal &&
                        <ChildAbsent
                            isModal={this.state.isModal}
                            modalClose={() => { this.setState({ isModal: false, vacationEndDate: '', vacationStartDate: '' }) }}
                            vacationStartDate={this.state.vacationStartDate}
                            vacationEndDate={this.state.vacationEndDate}
                            selectedOption={this.state.selectedOption}
                            optionSelected={(option) => { this.setState({ selectedOption: option }) }}
                            onSubmit={() => { this.submitDate() }}
                            openDate={(option) => { this.openDate(option) }}
                        />
                    }
                </> : <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader />
                </View>}
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        backgroundColor: '#ececec',
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: 'black',
        elevation: 8,
        // borderWidth: 0.3
    },

    headerContainer: {
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
    },

    button: {
        alignItems: "center",
        width: '50%',
        // marginTop: 10,
        paddingVertical: RF(0.4),
        paddingHorizontal: RF(2),
        borderRadius: 5
    },

    headerText: {
        fontSize: wp('4.5%'),
        color: 'black'
    },

    // upperPart: {
    //   flexDirection: 'row',
    //   flex: 1,
    //   borderTopStartRadius: 20,
    //   borderTopEndRadius: 20,
    //   paddingLeft: 20
    // },

    bodyText: {
        fontSize: 10,
    },

    date: {
        flex: 0.5,
        borderColor: '#ababab',
        borderWidth: 1,
        height: 50,
        borderRadius: 8
    },

    // footerButton: {
    //   flex: 0.7,
    //   paddingVertical: 10,
    //   borderBottomStartRadius: 20,
    //   borderBottomEndRadius: 20
    // },
    floaterButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 10,
        bottom: 30,
    },
})

mapStateToProps = (state) => {
    return {
        childs: state.map.childs,
        userData: state.user.userData,
        drivers: state.map.drivers,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        VWGeneralGetTrips: (id) => dispatch(VWGeneralGetTrips(id)),
        updateVacation: (item, option, startDate, endDate) => dispatch(updateVacation(item, option, startDate, endDate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vacation);