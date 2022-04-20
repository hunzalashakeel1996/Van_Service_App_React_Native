import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, ActivityIndicator,Alert } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { phonecall } from 'react-native-communications';
import jwtDecode from 'jwt-decode';

import { getTodayTrips } from '../../../../store/actions/dataAction';
import Header from '../Parent Profile/Header';
import TextWithStyle from '../../../components/TextWithStyle';

class TodayTrips extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    };

    state = {
        trips: null,
        loader: false,
        isCompleted: false
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({ headerShown: false })
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.didMount()
        });

        this.decoded = this.props.userData
        // condition to check if user navigate this screen thorugh draggable view or after shift complete
        if (this.props.trips) {
            this.setState({ trips: this.props.trips.filter(trip => { return trip.shift_id !== null }) })
        }


    }

    // componentWillUnmount() {
    //     this._unsubscribe();
    // }

    didMount = async () => {
        // when user navigate this screen after shift compelte
        // get all trips
        // if (this.props.trip)
        //     this.setState({ trips: this.props.trips })
        // else
        //     this.props.getTodayTrips(this.decoded.id)
        //         .then(trips => {
        //             console.log('123123123', trips)
        //             this.combineArray(trips)
        //         })
    }

    // combine both completed and remaining trips return from backend
    combineArray = (trips) => {
        let joined = trips ? trips['remaining'].concat(trips['completed']) : this.state.trips['remaining'].concat(this.state.trips['completed'])
        let mergeShifts = []

        joined.map(shift => {
            if (mergeShifts.hasOwnProperty(shift.title + shift.user_id))
                mergeShifts[shift.title + shift.user_id].push(shift)
            else
                mergeShifts[shift.title + shift.user_id] = [shift];
        })

        mergeShifts = Object.values(mergeShifts)
        this.setState({ trips: mergeShifts, loader: false })
    }

    // method to convert time into AM PM format
    tConvert = (time) => {
        if (time !== undefined && time !== null) {
            time.split(' ')[1] !== undefined ? time = time.split(' ')[1] : null
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

    timeRemain = (pick_time) => {
        pick_time.split(' ')[1] !== undefined ? pick_time = pick_time.split(' ')[1] : null
        let now = new Date().getTime()
        let databaseTime = new Date(`${new Date().getFullYear()}`, `${new Date().getMonth()}`, `${new Date().getDate()}`, `${pick_time.split(':')[0]}`, `${pick_time.split(':')[1]}`, `${pick_time.split(':')[2]}`).getTime();
        let minutes = Math.floor(((databaseTime - now) / (1000 * 60)) % 60);
        let hours = Math.floor(((databaseTime - now) / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        return (hours + " hr : " + minutes + " mins")
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>

                <View style={[styles.headerContainer]} >
                    <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText={`Today's Trip History`} />
                </View >

                {!this.state.loader ?
                    <FlatList
                        data={this.state.trips}
                        renderItem={({ item, index }) =>
                            <View style={styles.container}>

                                <View style={{ marginHorizontal: 15 }}>
                                    <View style={{ flexDirection: 'row' }}>

                                        <View style={{ padding: 12, backgroundColor: '#143459', borderRadius: 50 }}>
                                            <Image source={require('../../../../assets/icons/gender_free.png')} style={{ width: 30, height: 30 }} />
                                        </View>

                                        <View style={{ marginLeft: 15, flex: 1, flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <TextWithStyle style={[styles.bodyText, { fontSize: wp(4), flex: 0.9 }]}>{item.name}</TextWithStyle>
                                                </View>
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <TextWithStyle numberOfLines={1} style={[styles.bodyText, { fontSize: 10, flex: 0.9, }]}>Source: {item.source}</TextWithStyle>
                                                </View>
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <TextWithStyle numberOfLines={1} style={[styles.bodyText, { fontSize: 10, flex: 0.9 }]}>Destination: {item.destination}</TextWithStyle>
                                                </View>

                                            </View>
                                            <View>
                                                <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                                                    <TextWithStyle style={[styles.bodyText, { alignSelf: 'center', }]}>{item.driver_name}</TextWithStyle>
                                                    <View style={[styles.iconContainer, { marginLeft: 5 }]}>
                                                        <TouchableOpacity onPress={() => { phonecall(item.driver_mobile_number, true) }}>
                                                            <Ionicons name="md-call" size={20} color="white" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20, flex: 1 }}>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                                <View style={{ flex: 0.4, alignItems: 'flex-start' }}><TextWithStyle style={{ fontSize: wp('3%') }}>Pick up</TextWithStyle></View>
                                                <View style={{ flex: 0.4, alignItems: 'flex-end' }}><TextWithStyle style={{ fontSize: wp('3%') }}>Drop off</TextWithStyle></View>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                                <View style={{ alignItems: 'flex-start', marginLeft: 20 }}><Image source={require('../../../../assets/icons/house.png')} style={{ width: 30, height: 25 }} /></View>
                                                <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                    <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
                                                    <View style={{ height: hp(0.2), width: wp(45), backgroundColor: 'red', alignSelf: 'center' }}></View>
                                                    <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
                                                </View>
                                                <View style={{ alignItems: 'flex-end', marginRight: 10 }}><Image source={require('../../../../assets/icons/school3d.png')} style={{ width: 30, height: 25 }} /></View>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                                                <View style={{ flex: item.shift_end_time ? 0.4 : 1 }}>
                                                    <TextWithStyle style={[styles.bodyText, { fontSize: wp(3.5), color: item.shift_end_time ? '#143459' : '#ee3d3c', alignSelf: item.shift_end_time ? null : 'center' }]}>
                                                        {/* pickup time */}
                                                        {// condition to check if trip is in completed mode or in remaining mode
                                                            (item.shift_end_time || (item.status&&item.status.split('-vw-')[0] == 'Absent')) ?
                                                                ['Left', 'ParentLeft', 'Absent'].includes(item.status.split('-vw-')[0]) ? 'Absent' : this.tConvert(item.pick_time) // condition to check if user was absent or not
                                                                :
                                                                [this.timeRemain(item.pick_time.split('-vw-')[0]).split('-')[1] === undefined ? // condition to check if current shift started or not for that day
                                                                    `Shift Start after ${this.timeRemain(item.pick_time.split('-vw-')[0])}`
                                                                    :
                                                                    `This shift was not started`
                                                                ]

                                                        }
                                                    </TextWithStyle>
                                                </View>
                                                {(item.shift_end_time || (item.status && !['Left', 'ParentLeft'].includes(item.status.split('-vw-')[0]))) && <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                                    <TextWithStyle style={[styles.bodyText, { fontSize: wp(3.5), color: item.shift_end_time ? '#143459' : '#ee3d3c', alignSelf: item.shift_end_time ? null : 'center' }]}>
                                                        {/* drop Time time */}
                                                        {
                                                            this.tConvert(item.drop_time)
                                                        }
                                                    </TextWithStyle>
                                                </View>}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }

                        keyExtractor={(index) => JSON.stringify(index)}
                    />
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>}

                {/* <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity onPress={() => { this.setState({ isCompleted: false }) }} style={[styles.button, { borderBottomWidth: !this.state.isCompleted ? 2 : 0 }]}>
              <TextWithStyle style={[styles.headerText, { color: 'white' }]}>Upcoming</TextWithStyle>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { this.setState({ isCompleted: true }) }} style={[styles.button, { borderBottomWidth: this.state.isCompleted ? 2 : 0 }]}>
              <TextWithStyle style={[styles.headerText, { color: 'white' }]}>Completed</TextWithStyle>
            </TouchableOpacity>
          </View> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        marginHorizontal: 10,
        backgroundColor: '#edecec',
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: 'black',
        elevation: 8,
        // borderWidth: 0.3,
    },

    headerContainer: {
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
    },

    // listContainer: {
    //   paddingHorizontal: 20,
    //   paddingVertical: 10,
    //   marginBottom: 20,
    //   backgroundColor: "#eee",
    //   borderRadius: 20
    // },

    // button: {
    //   width: '50%',
    //   backgroundColor: '#143459',
    //   paddingVertical: 12,
    //   alignItems: 'center',
    //   borderColor: 'white',
    // },


    // headerText: {
    //   fontSize: wp('5%'),
    //   fontFamily: 'Lato-Regular',
    //   fontWeight: 'bold',
    // },

    // upperPart: {
    //   flexDirection: 'row',
    //   flex: 1,
    //   backgroundColor: '#eee',
    //   borderTopStartRadius: 20,
    //   borderTopEndRadius: 20,
    //   paddingLeft: 20,
    //   borderBottomWidth: 1,
    // },

    bodyText: {
        fontSize: wp('3%'),
        fontFamily: 'Lato-Regular',
    },

    // bodyContainer: {
    //   flexDirection: 'row',
    //   flex: 1,
    //   alignItems: 'center',
    //   backgroundColor: "#eee",
    // },

    iconContainer: {
        backgroundColor: "#14345A",
        // elevation: 5,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 100,
        marginRight: 10
    },
})

mapStateToProps = (state) => {
    return {
        userData: state.user.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getTodayTrips: (parent_id) => dispatch(getTodayTrips(parent_id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodayTrips);




//                   </View >


// {
//   item.pick_times.split(',')[1] !== undefined ?
//   <View style={{ marginTop: 10, flex: 1 }}>
//     <View>
//       <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
//         <View style={{ flex: 0.4, alignItems: 'flex-start' }}><TextWithStyle style={{ fontSize: wp('3%') }}>Pick up</TextWithStyle></View>
//         <View style={{ flex: 0.4, alignItems: 'flex-end' }}><TextWithStyle style={{ fontSize: wp('3%') }}>Drop off</TextWithStyle></View>
//       </View>

//       <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
//         <View style={{ alignItems: 'flex-start', marginLeft: 20 }}><Image source={item.sources.split(',')[1] === 'home' ? require('../../../../assets/icons/house.png') : require('../../../../assets/icons/school3d.png')} style={{ width: 30, height: 25 }} /></View>
//         <View style={{ flex: 0.8, flexDirection: 'row' }}>
//           <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
//           <View style={{ height: hp(0.2), width: wp(45), backgroundColor: 'red', alignSelf: 'center' }}></View>
//           <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
//         </View>
//         <View style={{ alignItems: 'flex-end', marginRight: 10 }}><Image source={item.destinations.split(',')[1] === 'home' ? require('../../../../assets/icons/house.png') : require('../../../../assets/icons/school3d.png')} style={{ width: 30, height: 25 }} /></View>
//       </View>

//       <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
//         <View style={{ flex: 0.4 }}>
//           {/* <TextWithStyle style={[styles.bodyText, {color: '#ee3d3c'}]}>{item.source2}</TextWithStyle> */}
//           <TextWithStyle style={[styles.bodyText, { fontSize: wp(3.5), color: this.state.isCompleted === true ? '#143459' : '#ee3d3c', alignSelf: this.state.isCompleted === true ? null : 'center' }]}>{this.state.isCompleted === true ? this.tConvert(item.pick_times.split(',')[1]) : `${this.timeRemain(item.pick_times.split(',')[1])} Remain`}</TextWithStyle>
//         </View>

//         <View style={{ flex: this.state.isCompleted === true ? 0.4 : 0, alignItems: 'flex-end' }}>
//           {/* <TextWithStyle  style={styles.bodyText}>{item.destination2}</TextWithStyle> */}
//           <TextWithStyle style={[styles.bodyText, , { fontSize: wp(3.5), color: this.state.isCompleted === true ? '#143459' : '#ee3d3c' }]}>{this.state.isCompleted === true ? this.tConvert(item.drop_times.split(',')[1]) : null}</TextWithStyle>
//         </View>
//       </View>
//     </View>

//   </View>
//   : null
// }







// 0:
//   class: "Nursery"
//   destinations: "coaching"
//   gender: "Female"
//   ids: "8"
//   name: "Abeer"
//   pick_times: "22:00:00"
//   school_name: null
//   shift_start_times: null
//   shifts: "3"
//   sources: "home"
//   title: "Coaching"
//   user_id: 4

// 0:
//   class: "Nursery"
//   destinations: "coaching"
//   gender: "Male"
//   ids: "11"
//   name: "Ali"
//   pick_times: "18:30:00"
//   school_name: null
//   shift_start_times: null
//   shifts: "49"
//   sources: "home"
//   title: "Coaching"
//   user_id: 5

// 0:
//   class: "Nursery"
//   destinations: "home"
//   gender: "Male"
//   ids: "3"
//   name: "Balaaj"
//   pick_times: "17:00:00"
//   school_name: "Seven Oaks High School"
//   shift_start_times: null
//   shifts: "2"
//   sources: "school"
//   title: "School"
//   user_id: 2
//   __proto__: Object
// 1:
//   class: "Nursery"
//   destinations: "home"
//   drop_times: "2019-07-25 15:35:33"
//   gender: "Male"
//   ids: "2112"
//   name: "Balaaj"
//   pick_times: "2019-07-25 15:35:33"
//   school_name: "Seven Oaks High School"
//   shift_start_times: "2019-07-25 15:35:18"
//   shifts: "2"
//   sources: "school"
//   statuses: "A"
//   title: "School"
//   user_id: 2

// 0:
//   class: null
//   destinations: "school"
//   drop_times: "2019-07-25 15:35:33"
//   gender: "Male"
//   ids: "2110"
//   name: "Abeer bhai"
//   pick_times: "2019-07-25 15:35:33"
//   school_name: null
//   shift_start_times: "2019-07-25 15:35:18"
//   shifts: "2"
//   sources: "home"
//   statuses: "P"
//   title: "School"
//   user_id: 82

// 0:
//   class: "Nursery"
//   destinations: "home"
//   drop_times: "2019-07-25 15:35:33"
//   gender: "Male"
//   ids: "2111"
//   name: "Ali"
//   pick_times: "2019-07-25 15:35:33"
//   school_name: null
//   shift_start_times: "2019-07-25 15:35:18"
//   shifts: "2"
//   sources: "school"
//   statuses: "P"
//   title: "School"
//   user_id: 5

// 0:
//   class: null
//   destinations: "school"
//   drop_times: "2019-07-25 15:35:33"
//   gender: "Female"
//   ids: "2108"
//   name: "Balaaj bhai"
//   pick_times: "2019-07-25 15:35:33"
//   school_name: null
//   shift_start_times: "2019-07-25 15:35:18"
//   shifts: "2"
//   sources: "home"
//   statuses: "P"
//   title: "School"
//   user_id: 81