import React, { Component } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import Button from '../../../../src_mt/components/button/Button';

import { VWGeneralUpdateVacation, VWGeneralGetTrips } from '../../../../store/actions/dataAction';
import HeaderWithoutDrawer from '../../../components/Header/HeaderWithoutDrawer';
import Loader from '../../../components/Loader';
import ChildAbsent from '../../../components/modals/ChildAbsent';
import TextWithStyle from '../../../components/TextWithStyle';
import Theme from '../../../components/Theme';
import { formatDatetime } from '../../../../src_mt/components/time/datetimeConventer';
import ButtonBorder from '../../../../src_mt/components/button/ButtonBorder';
import DateTimePickerModal from "react-native-modal-datetime-picker";

class Vacation extends Component {
    state = {
        loader: false,
        trips: [],
        vacationStartDate: '',
        vacationEndDate: '',
        isModal: false,
        selectedItem: {},
        selectedOption: 'Both Way',
        showDate: false,
        refreshing: false
    }


    componentDidMount() {
        this.datetimeType = null;
        this.didMount()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.didMount()
        });

    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    didMount = (refresh) => {
        this.setState(refresh ? { refreshing: true } : { loader: true })
        // get all trips of current child
        this.props.VWGeneralGetTrips(this.props.userData.id)
            .then(trips => {
                // this.setState({ trips: trips })
                console.log(trips)
                this.combineArray(trips)
                this.setState({ loader: false, refreshing: false, vacationStartDate: '', vacationEndDate: '' })
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
        console.log('check', tempTrips[0])
        this.setState({ trips: [tempTrips[0]], loader: false })
    }

    // when user submit date for vacation
    submitVacation = (trip) => {
        const { vacationStartDate, vacationEndDate, selectedItem, selectedOption } = this.state;
        const { userData } = this.props;
        let shiftIds = '';
        if (selectedOption == 'Both Way') shiftIds = `${trip[0].shift_id},${trip[1].shift_id}`;
        if (selectedOption == 'Only Pick') shiftIds = `${trip[0].shift_id}`;
        if (selectedOption == 'Only Drop') shiftIds = `${trip[1].shift_id}`;

        this.setState({ isModal: false, loader: true })
        // if user select some date then run backend query else cancel the modal
        let data = {
            startDate: vacationStartDate,
            endDate: vacationEndDate,
            shiftIds,
            userId: userData.id
        }

        this.props.VWGeneralUpdateVacation(data).then(res => { this.didMount(); })
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

    getDatetime = () => {
        var now = new Date();
        now.setHours(8);
        now.setMinutes(0);
        now.setSeconds(0);
        return now;
    }

    openDatetime = (control_type, control_value) => {
        this.datetimeType = control_type;
        this.datetime = control_value !== "" ? control_value : this.getDatetime();

        this.setState({ showDate: true });
    }

    setDateTime = (DateTime) => {
        if (DateTime) {
            if (this.datetimeType == 'vacationStartDate') {
                this.setState({ showDate: false, [this.datetimeType]: new Date(DateTime) });
                if (this.state.vacationEndDate == '') {
                    this.datetimeType = 'vacationEndDate'
                    this.setState({ showDate: true });
                }
            } else {
                this.setState({ showDate: false, [this.datetimeType]: new Date(DateTime) });
            }
        }
        else {
            this.setState({ showDate: false });
        }
    }

    getMinimumDate = () => {
        const { vacationStartDate } = this.state;

        if (this.datetimeType == 'vacationStartDate') {
            return this.getDatetime();
        } else {
            if (vacationStartDate == '')
                return this.getDatetime();
            if (vacationStartDate !== '')
                return vacationStartDate;
        }
    }

    getMaximumDate = () => {
        const { vacationStartDate } = this.state;

        if (this.datetimeType == 'vacationStartDate') {
            if (vacationStartDate == '')
                return null;
            if (vacationStartDate !== '')
                return vacationStartDate;
        } else {
            return null;
        }
    }

    render() {
        const { userData } = this.props
        const { vacationStartDate, vacationEndDate, selectedOption, isModal, showDate, refreshing } = this.state;
        const pickImg = require('../../../../assets/icons/children_profile/onlyPickupSelected.png')
        const pickUnImg = require('../../../../assets/icons/children_profile/onlyPickupUnselected.png')
        const dropImg = require('../../../../assets/icons/children_profile/onlyDropSelected.png')
        const dropUnImg = require('../../../../assets/icons/children_profile/onlyDropUnselected.png')
        const bothImg = require('../../../../assets/icons/children_profile/bothwaySelected.png')
        const bothUnImg = require('../../../../assets/icons/children_profile/bothwayUnselected.png')
        const Options = ({ name, image, imageSelect }) => {
            return (
                <TouchableOpacity onPress={() => { this.setState({ selectedOption: name }) }} style={{ flex: 0.3, alignItems: 'center' }}>
                    {selectedOption === name ?
                        <Image source={image} style={styles.imageStyle} />
                        :
                        <Image source={imageSelect} style={styles.imageStyle} />}
                    <TextWithStyle style={{ color: selectedOption === name ? '#14345A' : '#ababab', marginTop: 5 }}>{name}</TextWithStyle>
                </TouchableOpacity>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={[styles.headerContainer]} >
                    <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText={`Leave/Off days`} />
                </View >
                {showDate && <DateTimePickerModal
                    isVisible={showDate}
                    mode={'date'}
                    locale="en_GB"
                    date={this.datetime}
                    minimumDate={this.getMinimumDate()}
                    maximumDate={this.getMaximumDate()}
                    onConfirm={(datetime) => { this.setDateTime(datetime) }}
                    onCancel={() => { this.setState({ showDate: false }) }}
                />}

                {this.state.loader === false ? <>
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => this.didMount(true)} colors={[Theme.SECONDARY_COLOR, Theme.PRIMARY_COLOR]} />
                        }
                        data={this.state.trips}
                        renderItem={({ item, index }) => {
                            const trip1 = item[0] // item[0] has trip details of subscription (same subscription_id)
                            const trip2 = item[1] // item[1] has trip details of subscription (same subscription_id)
                            return (<>
                                <View style={styles.container}>
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
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                            <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                            <View style={{ height: hp(0.2), width: wp(42), backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                            <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
                                    <View style={{ flex: 1, paddingTop: 8, justifyContent: 'space-around', alignItems: 'center', marginBottom: 8 }}>
                                        {(trip1.shift_id != null && trip1.shift_id != -1 && trip2.shift_id != null && trip2.shift_id != -1) ?
                                            trip1.vacation_end == null ? <>
                                                {/* <TouchableOpacity style={[styles.button, { backgroundColor: "#ee3d3c" }]} onPress={() => this.setState({ isModal: true, selectedItem: item })}>
                                                <TextWithStyle style={{ fontSize: wp('3.5%'), color: "#fff" }}> Vacation </TextWithStyle>
                                            </TouchableOpacity> */}
                                            </>
                                                // : <></>
                                                : <TextWithStyle style={{ color: Theme.RED_COLOR, fontSize: Theme.FONT_SIZE_SMALL, }}>{`You are on leave for today `}</TextWithStyle>
                                            : <TextWithStyle style={{ fontSize: wp('3%') }}>{`No driver assigned for this trip`}</TextWithStyle>}
                                    </View>

                                    {(trip1.vacation_end !== null || trip2.vacation_end !== null) &&
                                        <View style={{ flex: 1, padding: 10, backgroundColor: 'white', borderRadius: 8 }}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                                                    <TextWithStyle style={{ color: trip1.vacation_end !== null ? 'red' : 'black' }}>Pick Up</TextWithStyle>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                        <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: trip1.vacation_end !== null ? 'red' : 'black', alignSelf: 'center' }}></View>
                                                        <View style={{ height: hp(0.2), width: wp(42), backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                        <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: trip2.vacation_end !== null ? 'red' : 'black', alignSelf: 'center' }}></View>
                                                    </View>
                                                </View>

                                                <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                                                    <TextWithStyle style={{ color: trip2.vacation_end !== null ? 'red' : 'black' }}>Drop Up</TextWithStyle>
                                                </View>
                                            </View>

                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                                                    {trip1.vacation_end !== null && <TextWithStyle style={{ fontSize: 9, marginTop: 5, fontWeight: 'bold', color: '#14345A' }}>{trip1.vacation_start} - {trip1.vacation_end}</TextWithStyle>}
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                                                </View>

                                                {trip2.vacation_end !== null &&
                                                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                                                        <TextWithStyle style={{ fontSize: 9, marginTop: 5, fontWeight: 'bold', color: '#14345A' }}>{trip2.vacation_start} - {trip2.vacation_end}</TextWithStyle>
                                                    </View>}
                                            </View>
                                        </View>}

                                </View>

                                {
                                    <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
                                        <ButtonBorder
                                            iconName={require('../../../../assets/passenger/calendar.png')}
                                            iconStyle={{ width: 18, height: 18 }}
                                            defaultText={"Start Date"}
                                            text={vacationStartDate && formatDatetime(vacationStartDate).date}
                                            onPress={() => { this.openDatetime('vacationStartDate', vacationStartDate) }}
                                        />
                                        <ButtonBorder
                                            iconName={require('../../../../assets/passenger/calendar.png')}
                                            iconStyle={{ width: 18, height: 18 }}
                                            defaultText={"End Date"}
                                            text={vacationEndDate && formatDatetime(vacationEndDate).date}
                                            onPress={() => { this.openDatetime('vacationEndDate', vacationEndDate) }}
                                        />
                                        <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center' }}>
                                            <Options name={'Both Way'} image={bothImg} imageSelect={bothUnImg} />
                                            <Options name={'Only Pick'} image={pickImg} imageSelect={pickUnImg} />
                                            <Options name={'Only Drop'} image={dropImg} imageSelect={dropUnImg} />
                                        </View>
                                        <Button disabled={vacationStartDate == '' && vacationEndDate == ''} onPress={() => this.submitVacation(item)} styleButton={{ marginTop: 20 }} >Leave</Button>

                                    </View>
                                }
                            </>)
                        }
                        }
                        keyExtractor={(index) => JSON.stringify(index)}
                    />

                    {/* {isModal &&
                        <ChildAbsent
                            isModal={isModal}
                            modalClose={() => { this.setState({ isModal: false, vacationEndDate: '', vacationStartDate: '' }) }}
                            vacationStartDate={vacationStartDate}
                            vacationEndDate={vacationEndDate}
                            selectedOption={selectedOption}
                            optionSelected={(option) => { this.setState({ selectedOption: option }) }}
                            onSubmit={() => { this.submitDate() }}
                            openDate={(option) => { this.openDate(option) }}
                        />
                    } */}
                </> : <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader />
                </View>
                }
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        // marginHorizontal: 10,
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
    icon: {
        width: 20,
        height: 20
    },
    // upperPart: {
    //   flexDirection: 'row',
    //   flex: 1,
    //   borderTopStartRadius: 20,
    //   borderTopEndRadius: 20,
    //   paddingLeft: 20
    // },


    timeContainer: {
        flex: 0.5,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Theme.BORDER_COLOR_2,
        alignItems: 'flex-end',
        paddingBottom: 5
    },

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

    imageStyle: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 50
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
        VWGeneralUpdateVacation: (data) => dispatch(VWGeneralUpdateVacation(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vacation);