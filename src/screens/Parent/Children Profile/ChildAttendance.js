import React, { Component } from 'react';
import { DatePickerAndroid, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import { getTrips, updateVacation } from '../../../../store/actions/dataAction';
import Loader from '../../../components/Loader';
import ChildAbsent from '../../../components/modals/ChildAbsent';
import TextWithStyle from '../../../components/TextWithStyle';
import Header from '../Parent Profile/Header';

class ChildAttendance extends Component {
    state = {
        loader: true,
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
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
           this.didMount()
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
      }

    didMount = () => {
        this.name = this.props.route.params.name.charAt(0).toUpperCase() + this.props.route.params.name.slice(1);
        // get all trips of current child
        this.props.getTrips(this.props.route.params.id)
            .then(trips => {
                this.setState({ trips: trips })
                this.shortDateFormat()
                this.setState({ loader: false })
            })
    }

    // method to remove date part from time
    shortDateFormat = () => {
        this.state.trips.map(trip => {
            // format date and remove timezone
            trip.vacation_end1 ? trip.vacation_end1 = trip.vacation_end1.split('T')[0] : null
            trip.vacation_start1 ? trip.vacation_start1 = trip.vacation_start1.split('T')[0] : null
            trip.vacation_end2 ? trip.vacation_end2 = trip.vacation_end2.split('T')[0] : null
            trip.vacation_start2 ? trip.vacation_start2 = trip.vacation_start2.split('T')[0] : null
        })
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
                    this.props.getTrips(this.props.route.params.id)
                        .then(trips => {
                            this.setState({ trips: trips }, () => {
                                this.shortDateFormat()
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

        if (this.state.loader === false) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={[styles.headerContainer, { marginBottom: 20 }]} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText={`${this.name} Details`} />
                    </View >

                    <FlatList
                        data={this.state.trips}
                        renderItem={({ item, index }) =>
                            <View style={styles.container}>
                                <View style={{ marginHorizontal: 15 }}>
                                    <View style={{ flexDirection: 'row' }}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../../../../assets/icons/school.png')} style={{ width: 50, height: 50, backgroundColor: '#143459', borderRadius: 50 }} />
                                        </View>

                                        {/* school name  */}
                                        <View style={{ marginLeft: 15, justifyContent: 'center', flex: 1 }}>
                                            <TextWithStyle numberOfLines={1} style={[styles.headerText]}>{item.school_name}</TextWithStyle>

                                            {/* class  */}
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <TextWithStyle style={[styles.bodyText, { fontSize: wp(3), flex: 0.5 }]}>Class {item.class}</TextWithStyle>

                                                {/* vacation button with date */}
                                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                    {item.drop_time1 !== null && item.drop_time2 !== null ?
                                                        <TouchableOpacity style={[styles.button, { backgroundColor: "#ee3d3c" }]} onPress={() => this.setState({ isModal: true, selectedItem: item })}>
                                                            <TextWithStyle style={{ fontSize: wp('3.5%'), color: "#fff" }}> Vacation </TextWithStyle>
                                                        </TouchableOpacity>
                                                        : null}

                                                    {item.vacation_end1 ?
                                                        <TextWithStyle style={{ fontSize: wp('3%'), }}>{`${item.vacation_start1.substring(8, 10)} ${this.getMonth(item.vacation_start1)} Till ${item.vacation_end1.substring(8, 10)} ${this.getMonth(item.vacation_end1)}`}</TextWithStyle>
                                                        : item.vacation_end2 ?
                                                            <TextWithStyle style={{ fontSize: wp('3%'), }}>{`${item.vacation_start2.substring(8, 1000)} ${this.getMonth(item.vacation_start2)} Till ${item.vacation_end2.substring(8, 10)} ${this.getMonth(item.vacation_end2)}`}</TextWithStyle>
                                                            : null}
                                                </View>
                                            </View>
                                        </View>

                                    </View>
                                    {item.drop_time1 !== null && item.drop_time2 !== null ?
                                        <View>
                                            <View style={{ marginTop: 15, flex: 1 }}>
                                                <View>
                                                    {/* pick up and drop off row */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                                        <View style={{ flex: 0.4, alignItems: 'flex-start' }}><TextWithStyle style={{ fontSize: wp(3), }}>Pick up</TextWithStyle></View>
                                                        <View style={{ flex: 0.4, alignItems: 'flex-end' }}><TextWithStyle style={{ fontSize: wp(3), }}>Drop off</TextWithStyle></View>
                                                    </View>

                                                    {/* image of school and home row */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                                        <View style={{ alignItems: 'flex-start', marginLeft: 20 }}><Image source={require('../../../../assets/icons/house.png')} style={{ width: 30, height: 25 }} /></View>
                                                        <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                            <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                            <View style={{ height: hp(0.2), width: wp(42), backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                            <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                        </View>
                                                        <View style={{ alignItems: 'flex-end', marginRight: 20 }}><Image source={require('../../../../assets/icons/school3d.png')} style={{ width: 30, height: 25 }} /></View>
                                                    </View>

                                                    {/* first trip time pickup and dropoff */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                                        <View style={{ flex: 0.4 }}>
                                                            {/* <TextWithStyle style={[styles.bodyText, {color: '#ee3d3c'}]}>{item.source2}</TextWithStyle> */}
                                                            <TextWithStyle style={[styles.bodyText, { color: '#ee3d3c', fontSize: wp(4) }]}>{this.tConvert(item.pick_time2)}</TextWithStyle>
                                                        </View>

                                                        <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                                            {/* <TextWithStyle  style={styles.bodyText}>{item.destination2}</TextWithStyle> */}
                                                            <TextWithStyle style={[styles.bodyText, , { color: '#ee3d3c', fontSize: wp(4) }]}>{this.tConvert(item.drop_time2)}</TextWithStyle>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>

                                            <View style={{ marginTop: 10 }}>
                                                <View>
                                                    {/* secind trip pickup and dropoff text */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                                        <View style={{ flex: 0.4, alignItems: 'flex-start' }}><TextWithStyle style={{ fontSize: wp(3), }}>Pick up</TextWithStyle></View>
                                                        <View style={{ flex: 0.4, alignItems: 'flex-end' }}><TextWithStyle style={{ fontSize: wp(3), }}>Drop off</TextWithStyle></View>
                                                    </View>

                                                    {/* second trip images */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                                        <View style={{ alignItems: 'flex-start', marginLeft: 20 }}><Image source={require('../../../../assets/icons/school3d.png')} style={{ width: 30, height: 25 }} /></View>
                                                        <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                            <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                            <View style={{ height: hp(0.2), width: wp(42), backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                            <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'black', alignSelf: 'center' }}></View>
                                                        </View>
                                                        <View style={{ alignItems: 'flex-end', marginRight: 20 }}><Image source={require('../../../../assets/icons/house.png')} style={{ width: 30, height: 25 }} /></View>
                                                    </View>

                                                    {/* second trip dropoff and poickup time */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                                        <View style={{ flex: 0.4 }}>
                                                            {/* <TextWithStyle style={[styles.bodyText, {color: '#ee3d3c'}]}>{item.source2}</TextWithStyle> */}
                                                            {<TextWithStyle style={[styles.bodyText, { color: '#ee3d3c', fontSize: wp(4) }]}>{this.tConvert(item.pick_time1)}</TextWithStyle>}
                                                        </View>

                                                        <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                                            {/* <TextWithStyle  style={styles.bodyText}>{item.destination2}</TextWithStyle> */}
                                                            <TextWithStyle style={[styles.bodyText, , { color: '#ee3d3c', fontSize: wp(4) }]}>{this.tConvert(item.drop_time1)}</TextWithStyle>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15, marginHorizontal: 20 }}>
                                            <TextWithStyle style={{ fontSize: wp('4%'), color: 'green' }}>Your request is pending to add new trip</TextWithStyle>
                                        </View>
                                    }
                                </View>
                            </View>
                        }
                        keyExtractor={(index) => JSON.stringify(index)}
                    />

                    {/* floater button */}
                    {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('NewTrip', { id: this.props.route.params.id, name: this.name }) }} style={[styles.floaterButton, { borderRadius: 50, backgroundColor: '#143459', justifyContent: 'center', alignItems: 'center' }]}>
            <TextWithStyle style={{ fontSize: RF(5), color: 'white', }}>+</TextWithStyle>
          </TouchableOpacity> */}

                    {this.state.isModal &&
                        <ChildAbsent
                            isModal={this.state.isModal}
                            modalClose={() => { this.setState({ isModal: false, vacationEndDate: '', vacationStartDate: '' }) }}
                            vacationStartDate={this.state.vacationStartDate}
                            vacationEndDate={this.state.vacationEndDate}
                            selectedOption = {this.state.selectedOption}
                            optionSelected={(option) => { this.setState({ selectedOption: option }) }}
                            onSubmit={() => { this.submitDate() }}
                            openDate={(option) => { this.openDate(option) }}
                        />
                    }
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.headerContainer, { flex: 1 }]} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText={`${this.name ? this.name : ''} Details`} />
                    </View>
                    <Loader />

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        marginHorizontal: 10,
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
        fontSize: wp('4%'),
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

const mapDispatchToProps = (dispatch) => {
    return {
        getTrips: (id) => dispatch(getTrips(id)),
        updateVacation: (item, option, startDate, endDate) => dispatch(updateVacation(item, option, startDate, endDate))
    }
}

export default connect(null, mapDispatchToProps)(ChildAttendance);


// <Modal
//                         animationType="slide"
//                         transparent={true}
//                         visible={this.state.isModal}
//                         onRequestClose={() => { this.setState({ isModal: false, vacationEndDate: '', vacationStartDate: '' }) }}
//                     >

//                         <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                             <View style={{ backgroundColor: 'white', marginHorizontal: 20, height: RF(50), borderRadius: 20, padding: 10 }}>
//                                 <View style={{ margin: 10 }}>
//                                     <TextWithStyle style={{ paddingBottom: 5, borderBottomWidth: 1, color: '#143459', fontSize: RF(3), fontWeight: 'bold' }}>Select Date</TextWithStyle>

//                                     <View style={{ flexDirection: 'row', marginTop: 15 }}>
//                                         <TouchableOpacity onPress={() => { this.openDate('start') }} style={styles.date}>
//                                             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                                                 <TextWithStyle style={{ fontSize: 13 }}>Start Date</TextWithStyle>
//                                                 {this.state.vacationStartDate ? <TextWithStyle style={{ color: '#14345A' }}>{this.state.vacationStartDate}</TextWithStyle> : null}
//                                             </View>
//                                         </TouchableOpacity>

//                                         <TouchableOpacity onPress={() => { this.openDate('end') }} style={styles.date}>
//                                             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                                                 <TextWithStyle style={{ fontSize: 13 }}>End Date</TextWithStyle>
//                                                 {this.state.vacationEndDate ? <TextWithStyle style={{ color: '#14345A' }}>{this.state.vacationEndDate}</TextWithStyle> : null}
//                                             </View>
//                                         </TouchableOpacity>
//                                     </View>

//                                     <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'center' }}>
//                                         <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'Only Pick' }) }} style={{ flex: 0.3, alignItems: 'center' }}>
//                                             {this.state.selectedOption === 'Only Pick' ?
//                                                 <Image source={require('../../../../assets/icons/school.png')} style={{ width: 40, height: 40, backgroundColor: '#143459', borderRadius: 50 }} />
//                                                 :
//                                                 <Image source={require('../../../../assets/icons/school.png')} style={{ width: 40, height: 40, backgroundColor: '#143459', borderRadius: 50 }} />}
//                                             <TextWithStyle style={{ color: this.state.selectedOption === 'Only Pick' ? '#14345A' : '#ababab', marginTop: 5 }}>Only Pickup</TextWithStyle>
//                                         </TouchableOpacity>

//                                         <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'Only Drop' }) }} style={{ flex: 0.3, alignItems: 'center' }}>
//                                             {this.state.selectedOption === 'Only Drop' ?
//                                                 <Image source={require('../../../../assets/icons/school.png')} style={{ width: 40, height: 40, backgroundColor: '#143459', borderRadius: 50 }} />
//                                                 :
//                                                 <Image source={require('../../../../assets/icons/school.png')} style={{ width: 40, height: 40, backgroundColor: '#143459', borderRadius: 50 }} />}
//                                             <TextWithStyle style={{ color: this.state.selectedOption === 'Only Drop' ? '#14345A' : '#ababab', marginTop: 5 }}>Only Drop</TextWithStyle>
//                                         </TouchableOpacity>

//                                         <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'Both Way' }) }} style={{ flex: 0.3, alignItems: 'center' }}>
//                                             {this.state.selectedOption === 'Both Way' ?
//                                                 <Image source={require('../../../../assets/icons/school.png')} style={{ width: 40, height: 40, backgroundColor: '#143459', borderRadius: 50 }} />
//                                                 :
//                                                 <Image source={require('../../../../assets/icons/school.png')} style={{ width: 40, height: 40, backgroundColor: '#143459', borderRadius: 50 }} />}
//                                             <TextWithStyle style={{ color: this.state.selectedOption === 'Both Way' ? '#14345A' : '#ababab', marginTop: 5 }}>Both Way</TextWithStyle>
//                                         </TouchableOpacity>
//                                     </View>

//                                     <View style={{ marginTop: 30, alignItems: 'center' }}>
//                                         <TouchableOpacity onPress={this.submitDate} style={{ backgroundColor: '#143459', paddingHorizontal: RF(10), paddingVertical: RF(1.5), borderRadius: 8 }} >
//                                             <TextWithStyle style={{ fontSize: RF(3), color: 'white' }}>{this.state.vacationEndDate && this.state.vacationStartDate ? 'Save' : 'Cancel'}</TextWithStyle>
//                                         </TouchableOpacity>
//                                     </View>
//                                     {/* <View>
//                     {this.state.vacationStartDate && this.state.vacationEndDate ?
//                       <TouchableOpacity onPress={this.openDate} style={{ marginTop: 20, flexDirection: 'row' }}>
//                         <TextWithStyle style={{ marginLeft: 10, fontSize: RF(3.5) }}>{this.state.vacationStartDate}  Till  {this.state.vacationEndDate}</TextWithStyle>
//                       </TouchableOpacity>
//                       :
//                       <TouchableOpacity onPress={this.openDate} style={{ marginTop: 20, flexDirection: 'row' }}>
//                         <Ionicons name="md-calendar" size={20} color="#143459" />

//                         <TextWithStyle style={{ marginLeft: 10, fontSize: RF(3) }}>Select Date</TextWithStyle>
//                       </TouchableOpacity>
//                     }
//                   </View>

//                   <View style={{ marginTop: RF(10), flexDirection: 'row', borderRadius: 10, borderWidth: 2, justifyContent: 'center' }}>
//                     <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'Only Pick' }) }} style={{ flex: 0.33, fontSize: RF(2.3), padding: 5, backgroundColor: this.state.selectedOption === 'Only Pick' ? '#143459' : null, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, alignItems: 'center' }}>
//                       <TextWithStyle style={{ color: this.state.selectedOption === 'Only Pick' ? 'white' : '#143459' }}>Only Pickup</TextWithStyle>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'Only Drop' }) }} style={{ flex: 0.34, borderLeftWidth: 2, backgroundColor: this.state.selectedOption === 'Only Drop' ? '#143459' : null, borderRightWidth: 2, fontSize: RF(2.3), padding: 5, alignItems: 'center' }}>
//                       <TextWithStyle style={{ color: this.state.selectedOption === 'Only Drop' ? 'white' : '#143459' }}>Only Drop</TextWithStyle>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'Both Way' }) }} style={{ flex: 0.33, fontSize: RF(2.3), padding: 5, backgroundColor: this.state.selectedOption === 'Both Way' ? '#143459' : null, borderTopRightRadius: 8, borderBottomRightRadius: 8, alignItems: 'center' }}>
//                       <TextWithStyle style={{ color: this.state.selectedOption === 'Both Way' ? 'white' : '#143459' }}>Both Way</TextWithStyle>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={{ marginTop: RF(8), alignItems: 'center' }}>
//                     <TouchableOpacity onPress={this.submitDate} style={{ backgroundColor: '#143459', paddingHorizontal: RF(10), paddingVertical: RF(1.5), borderRadius: 10 }} >
//                       <TextWithStyle style={{ fontSize: RF(3), color: 'white' }}>{this.state.vacationEndDate ? 'Save' : 'Cancel'}</TextWithStyle>
//                     </TouchableOpacity>
//                   </View> */}

//                                 </View>
//                             </View>
//                         </View>
//                     </Modal>