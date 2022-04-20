import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { phonecall } from 'react-native-communications';

import TextWithStyle from '../../components/TextWithStyle';

const VWTripCard = ({ item }) => {

    // method to convert time into AM PM format
    const tConvert = (time) => {
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

    const timeRemain = (pick_time) => {
        pick_time.split(' ')[1] !== undefined ? pick_time = pick_time.split(' ')[1] : null
        let now = new Date().getTime()
        let databaseTime = new Date(`${new Date().getFullYear()}`, `${new Date().getMonth()}`, `${new Date().getDate()}`, `${pick_time.split(':')[0]}`, `${pick_time.split(':')[1]}`, `${pick_time.split(':')[2]}`).getTime();
        let minutes = Math.floor(((databaseTime - now) / (1000 * 60)) % 60);
        let hours = Math.floor(((databaseTime - now) / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        return (hours + " hr : " + minutes + " mins")
    }

    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row' }}>

                    <View style={{ padding: 12, backgroundColor: '#143459', borderRadius: 50 }}>
                        <Image source={require('../../../assets/icons/gender_free.png')} style={{ width: 30, height: 30 }} />
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
                            <View style={{ alignItems: 'flex-start', marginLeft: 20 }}><Image source={require('../../../assets/icons/house.png')} style={{ width: 30, height: 25 }} /></View>
                            <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
                                <View style={{ height: hp(0.2), width: wp(45), backgroundColor: 'red', alignSelf: 'center' }}></View>
                                <View style={{ height: hp(0.7), paddingHorizontal: 2, borderRadius: 100, backgroundColor: 'red', alignSelf: 'center' }}></View>
                            </View>
                            <View style={{ alignItems: 'flex-end', marginRight: 10 }}><Image source={require('../../../assets/icons/school3d.png')} style={{ width: 30, height: 25 }} /></View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                            <View style={{ flex: item.shift_end_time ? 0.4 : 1 }}>
                                <TextWithStyle style={[styles.bodyText, { fontSize: wp(3.5), color: item.shift_end_time ? '#143459' : '#ee3d3c', alignSelf: item.shift_end_time ? null : 'center' }]}>
                                    {/* pickup time */}
                                    {// condition to check if trip is in completed mode or in remaining mode
                                        item.shift_end_time ?
                                            ['Left', 'ParentLeft'].includes(item.status.split('-vw-')[0]) ? 'Absent' : tConvert(item.pick_time) // condition to check if user was absent or not
                                            :
                                            [timeRemain(item.pick_time.split('-vw-')[0]).split('-')[1] === undefined ? // condition to check if current shift started or not for that day
                                                `Shift Start after ${timeRemain(item.pick_time.split('-vw-')[0])}`
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
                                        tConvert(item.drop_time)
                                    }
                                </TextWithStyle>
                            </View>}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )

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

    bodyText: {
        fontSize: wp('3%'),
        fontFamily: 'Lato-Regular',
    },

    iconContainer: {
        backgroundColor: "#14345A",
        // elevation: 5,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 100,
        marginRight: 10
    },
})

export default VWTripCard;