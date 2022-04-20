import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import Theme from '../../../Theme/Theme';
import timeConverter from '../../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../../time/datetimeConventer';
import Text from '../../text/TextWithStyle';
import TripNameFormat from '../../util/TripNameFormat';

const TripCardContent = (props) => {
    const data = props.data;
    // const isExpired = props.isExpired;
    const notAvailable = props.notAvailable;

    const getStatusStyle = () => {
        // handle status style like isNew, isBooked etc
        const isShowBlock = props.notShowBlock ? 10 : 0;
        if (notAvailable) {
            return { backgroundColor: Theme.BORDER_COLOR, opacity: 0.3, borderRadius: isShowBlock }
        }
        else if (data.isNew == true) {
            return { backgroundColor: Theme.BORDER_COLOR_OPACITY, borderRadius: isShowBlock }
        }
    }

    return (
        <>
            {notAvailable && <View style={{ position: "absolute", alignSelf: "center", zIndex: 1, }}>
                <Text style={{ fontSize: 35, color: "rgba(255,255,255,1)" }}>{props.isBooked == true ? "BOOKED" : "NOT AVAILABLE"}</Text>
            </View>}
            <View style={[styles.container, getStatusStyle(), props.ContainerStyle]}>
                <View style={{ height: 30, flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
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
        </>
    );
};


export default TripCardContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        // backgroundColor: Theme.WHITE_COLOR,
        // elevation: 5
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
