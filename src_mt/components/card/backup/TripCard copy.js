import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import Theme from '../../../Theme/Theme';
import timeConverter from '../../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../../time/datetimeConventer';
import Text from '../../text/TextWithStyle';
import TripNameFormat from '../../util/TripNameFormat';

const TripCard = (props) => {
    const data = props.data;
    const index = props.index;
    const isExpired = props.isExpired;

    const getBlockStyle = () => {
        return !props.showBlock ? styles.containerRadius : null;
    }

    // const getStatusStyle = () => {
    //     // handle status style like isNew, isBooked etc
    //     if ((data.isBooked == true || isExpired == true)) {
    //         return <View style={{ width: "100%", height: "100%", borderRadius: 10, position: "absolute", backgroundColor: Theme.BORDER_COLOR, opacity: 0.2, justifyContent: "center", alignItems: "center" }}>
    //             <Text style={{ fontSize: 40, color: Theme.WHITE_COLOR }}>{isExpired == true ? "Expired" : "Booked"}</Text>
    //         </View>
    //     }
    //     else if (data.isNew == true) {
    //         return <View style={{ width: "100%", height: "100%", borderRadius: 10, position: "absolute", backgroundColor: Theme.BORDER_COLOR_OPACITY, justifyContent: "center", alignItems: "center" }}>
    //         </View>
    //     }
    // }
    const getStatusStyle = () => {
        // handle status style like isNew, isBooked etc
        if ((data.isBooked == true || isExpired == true)) {
            return <View style={{ width: "100%", height: "100%", zIndex: 1, borderRadius: 10, position: "absolute", backgroundColor: Theme.BORDER_COLOR, opacity: 0.6, justifyContent: "center", alignItems: "center" }}>
                {/* <Text style={{ fontSize: 40, color: Theme.WHITE_COLOR }}>{isExpired == true ? "Expired" : "Booked"}</Text> */}
            </View>
        }
        else if (data.isNew == true) {
            return <View style={{ width: "100%", height: "100%", borderRadius: 10, position: "absolute", backgroundColor: Theme.BORDER_COLOR_OPACITY, justifyContent: "center", alignItems: "center" }}>
            </View>
        }
    }

    return (
        <View style={{ flex: 1, marginTop: index == 0 ? 15 : 0 }}>
            <TouchableNativeFeedback onPress={data.isBooked == true ? null : props.onPress}>
                <View style={[styles.container, getBlockStyle(),  props.ContainerStyle]}>
                    
                    {getStatusStyle()}
                    <View style={{ flex: 0.95, justifyContent: "center", marginVertical: 8, marginHorizontal: 5 }}>
                        <View style={{ height: 30, flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                            <Text style={{ flex: 0.6, color: Theme.BLUE_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{TripNameFormat(data.destination)}</Text>
                            <View style={{ flex: 0.4 }}>
                                <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, textAlign: "right" }}>JOB ID: {data.request_id}</Text>
                                {props.datetime && <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL, textAlign: "right", color: Theme.SECONDARY_COLOR }}>
                                    {formatDatetimeAgo(props.datetime)}
                                </Text>}
                            </View>
                        </View>
                        <View style={{ height: 80, justifyContent: "space-evenly" }}>
                            <View style={[styles.iconTextContainer, { flex: 1 }]}>
                                <View style={{ flex: 0.07 }}>
                                    <Image style={styles.icon} source={require('../../../assets/passenger/dot.png')} />
                                </View>
                                <Text style={[styles.text, { flex: 0.93 }]} numberOfLines={1}>From: <Text style={styles.boldText}>{data.source}</Text></Text>
                            </View>
                            <View style={[styles.iconTextContainer, { flex: 1 }]}>
                                <View style={{ flex: 0.07 }}>
                                    <Image style={[styles.icon]} source={require('../../../assets/passenger/driver.png')} />
                                </View>
                                <Text style={[styles.text, { flex: 0.93 }]} numberOfLines={1}>To: <Text style={styles.boldText}>{data.destination}</Text></Text>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1 }}>
                                <View style={[styles.iconTextContainer, { flex: 0.4 }]}>
                                    <View style={{ flex: 0.15 }}>
                                        <Image style={styles.icon} source={require('../../../assets/passenger/date.png')} />
                                    </View>
                                    <Text style={[styles.textSmall, { flex: 0.85 }]}>Date: <Text style={styles.boldTextSmall}>{formatDatetime(data.departure_date).date}</Text></Text>
                                </View>
                                <View style={[styles.iconTextContainer, { flex: 0.35 }]}>
                                    <View style={{ flex: 0.15 }}>
                                        <Image style={styles.icon} source={require('../../../assets/passenger/time.png')} />
                                    </View>
                                    <Text style={[styles.textSmall, { flex: 0.85 }]} >Time: <Text style={styles.boldTextSmall}>{formatDatetime(data.departure_date).time}</Text></Text>
                                </View>
                                <View style={[styles.iconTextContainer, { flex: 0.25 }]}>
                                    <View style={{ flex: 0.2 }}>
                                        <Image style={styles.icon} source={require('../../../assets/passenger/seats(grey).png')} />
                                    </View>
                                    <Text style={[styles.textSmall, { flex: 0.8 }]}>Seats: <Text style={styles.boldTextSmall}>{data.no_of_seats}</Text></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
};


export default TripCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: Theme.WHITE_COLOR,
        elevation: 5,
        // zIndex: 1
    },
    containerRadius: {
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 5,
    },
    isNew: {
        backgroundColor: "#e4e4e4"
    },
    isBooked: {
        backgroundColor: "#e4e4e4"
    },
    button: {
        width: '100%',
        // height: 45,
        flex: 0.7,
        backgroundColor: Theme.RED_COLOR,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    borderShadow: {
        backgroundColor: Theme.WHITE_COLOR,
        elevation: 5,
    },

    text: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_MEDIUM,
    },
    textSmall: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_SMALL,
    },
    icon: {
        width: 15,
        height: 15
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_MEDIUM,

    },
    boldTextSmall: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_SMALL,

    },
    blackText: {
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_MEDIUM,
    },
    iconTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
