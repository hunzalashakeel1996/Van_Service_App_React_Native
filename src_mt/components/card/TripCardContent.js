import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import Theme from '../../Theme/Theme';
import timeConverter from '../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../time/datetimeConventer';
import Text from '../text/TextWithStyle';
import TripNameFormat from '../util/TripNameFormat';
import { connect } from 'react-redux';

const TripCardContent = (props) => {
    const data = props.data;
    const notAvailable = props.notAvailable;
    const [tripStatus, setTripStatus] = useState({ status: "Pending", color: Theme.BLACK_COLOR })

    useEffect(() => {
        props.showStatus && getTripStatus(data.data);
    }, [props.data])

    const getStatusStyle = () => {
        // handle status style like isNew, isBooked etc
        const isShowBlock = props.notShowBlock ? 10 : 0;
        if (notAvailable) {
            return { backgroundColor: Theme.BORDER_COLOR, opacity: 0.3, borderBottomRightRadius: isShowBlock, borderBottomLeftRadius: isShowBlock }
        }
        else if (data.isNew == true) {
            return { backgroundColor: Theme.BORDER_COLOR_OPACITY, borderBottomRightRadius: isShowBlock, borderBottomLeftRadius: isShowBlock }
        }
    }

    const getTopRadius = { borderTopRightRadius: 10, borderTopLeftRadius: 10 }

    const getTripStatus = (statusData) => {
        let status = "";
        if (statusData.contract.length > 0) {
            status = { status: "Contract", color: Theme.WHITE_COLOR, bgColor: Theme.SECONDARY_COLOR };
        }
        else if (statusData.driverConfirmation.length > 0) {
            // status = "DRIVER CONFIRMATION";
            status = { status: "In Process", color: Theme.BLACK_COLOR, bgColor: Theme.BORDER_COLOR_2 };
        } else if (statusData.myConfirmation.length > 0) {
            // status = "MY CONFIRMATION";
            status = { status: "In Process", color: Theme.BLACK_COLOR, bgColor: Theme.BORDER_COLOR_2 };
        }
        else if (statusData.offers.length > 0) {
            status = { status: "In Process", color: Theme.BLACK_COLOR, bgColor: Theme.BORDER_COLOR_2 };
        } else {
            status = { status: "Pending", color: Theme.BORDER_COLOR, bgColor: Theme.BORDER_COLOR_2 };
        }
        setTripStatus(status)

    }


    return (
        <>
            {notAvailable && <View style={{ position: "absolute", alignSelf: "center", zIndex: 1, }}>
                <Text style={{ fontSize: 35, color: Theme.WHITE_COLOR }}>{props.isBooked == true ? "BOOKED" : "NOT AVAILABLE"}</Text>
            </View>}
            {data.upcomingTrip && <View style={[{
                height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Theme.SECONDARY_COLOR
            }, getTopRadius]}>
                <Text style={{ color: Theme.WHITE_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{data.trip_status != null ? data.trip_status.toUpperCase() : "UPCOMING TRIP"}</Text>
            </View>}
            {(props.showStatus) && <View style={[styles.container, { backgroundColor: tripStatus.bgColor }, !data.upcomingTrip && getTopRadius]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 2 }}>
                    <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, color: tripStatus.color }}>JOB ID: {data.request_id}</Text>
                    <Text style={[{ fontSize: Theme.FONT_SIZE_SMALL, color: tripStatus.color, borderRadius: 50 }]}>Status: {tripStatus.status}</Text>
                    {/* <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, borderWidth: 1, borderColor: tripStatus.color, color: tripStatus.color,borderRadius:50, paddingHorizontal: 8, paddingVertical: 1 }}>Status: {tripStatus.status}</Text> */}
                </View>
                {(tripStatus.status !== "Contract" && (data.allOffers > 0 || data.newOffers > 0 || data.allDriverConfirmation > 0 || data.newDriverConfirmation > 0)) &&
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 3, borderTopWidth: 0.5, borderTopColor: Theme.BORDER_COLOR_OPACITY }}>
                        {(data.allOffers > 0 || data.newOffers > 0) && <Text style={{ fontSize: Theme.FONT_SIZE_SMALL }}>Offer: {data.allOffers > 0 && data.allOffers}   {data.newOffers > 0 && <Text style={{ color: Theme.WHITE_COLOR, backgroundColor: Theme.RED_COLOR, borderRadius: 10 }}>{`  ${data.newOffers} New  `}</Text>}</Text>}
                        {(data.allDriverConfirmation > 0 || data.newDriverConfirmation > 0) && <Text style={{ fontSize: Theme.FONT_SIZE_SMALL }}>Driver Confirm: {data.allDriverConfirmation > 0 && data.allDriverConfirmation}   {data.newDriverConfirmation > 0 && <Text style={{ color: Theme.WHITE_COLOR, backgroundColor: Theme.RED_COLOR, borderRadius: 10 }}>{`  ${data.newDriverConfirmation} New  `}</Text>}</Text>}
                    </View>}
            </View >}
            <View style={[styles.container, props.ContainerStyle, getStatusStyle()]}>
                {props.quote_datetime && <View style={{ height: 20, flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Bid Date: {formatDatetimeAgo(props.quote_datetime)}</Text>
                </View>}
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                    <Text style={{ flex: 0.6, color: Theme.BLUE_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{TripNameFormat(data.destination)}</Text>
                    <View style={{ flex: 0.4 }}>
                        {!props.showStatus && <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, textAlign: "right" }}>JOB ID: {data.request_id}</Text>}
                        {props.datetime && <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL, textAlign: "right", color: Theme.SECONDARY_COLOR }}>
                            {formatDatetimeAgo(props.datetime)}
                        </Text>}
                    </View>
                </View>
                <View style={{ height: 70, justifyContent: "space-evenly" }}>
                    <View style={[styles.iconTextContainer, {}]}>
                        <View style={{ flex: 0.07 }}>
                            <Image style={styles.icon} source={require('../../../assets/passenger/dot.png')} />
                        </View>
                        <Text style={[styles.text, { flex: 0.15 }]}>From: </Text>
                        <View style={{ flex: 0.78, flexDirection: "column" }}>
                            <Text style={styles.boldText} numberOfLines={1}>{data.source}</Text>
                            {data.source_detail && <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL }} numberOfLines={1}>{data.source_detail}</Text>}
                        </View>
                    </View>
                    <View style={[styles.iconTextContainer, {}]}>
                        <View style={{ flex: 0.07 }}>
                            <Image style={[styles.icon]} source={require('../../../assets/passenger/driver.png')} />
                        </View>
                        <Text style={[styles.text, { flex: 0.15 }]} numberOfLines={1}>To: </Text>
                        <View style={{ flex: 0.78, flexDirection: "column" }}>
                            <Text style={styles.boldText} numberOfLines={1}>{data.destination}</Text>
                            {data.destination_detail && <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL }} numberOfLines={1}>{data.destination_detail}</Text>}
                        </View>
                    </View>
                </View>
                <View style={{ height: 25, flexDirection: "row", justifyContent: "center" }}>
                    <View style={[styles.iconTextContainer, { flex: 0.2, justifyContent: "center" }]}>
                        <Text style={[styles.boldTextSmall, { fontSize: Theme.FONT_SIZE_MEDIUM }]}>Depart</Text>
                    </View>
                    <View style={[styles.iconTextContainer, { flex: 0.4, justifyContent: "center" }]}>
                        <Text style={[styles.textSmall, {}]}>Date: <Text style={styles.boldTextSmall}>{formatDatetime(data.departure_date).date}</Text></Text>
                    </View>
                    <View style={[styles.iconTextContainer, { flex: 0.4, justifyContent: "center" }]}>
                        <Text style={[styles.textSmall, {}]} >Time: <Text style={styles.boldTextSmall}>{formatDatetime(data.departure_date).time}</Text></Text>
                    </View>
                </View>
                {data.type !== "One Way" && <View style={{ height: 25, flexDirection: "row", justifyContent: "center" }}>
                    <View style={[styles.iconTextContainer, { flex: 0.2, justifyContent: "center" }]}>
                        <Text style={[styles.boldTextSmall, { fontSize: Theme.FONT_SIZE_MEDIUM }]}>Return</Text>
                    </View>
                    <View style={[styles.iconTextContainer, { flex: 0.4, justifyContent: "center" }]}>
                        <Text style={[styles.textSmall, {}]}>Date: <Text style={styles.boldTextSmall}>{formatDatetime(data.return_date).date}</Text></Text>
                    </View>
                    <View style={[styles.iconTextContainer, { flex: 0.4, justifyContent: "center" }]}>
                        <Text style={[styles.textSmall, {}]} >Time: <Text style={styles.boldTextSmall}>{formatDatetime(data.return_date).time}</Text></Text>
                    </View>
                </View>}
                <View style={{ height: 30, flexDirection: "row", marginTop: 10, borderTopWidth: 1, borderTopColor: Theme.BORDER_COLOR_OPACITY }}>
                    <View style={[styles.iconTextContainer, { flex: 1, justifyContent: "center" }]}>
                        <Text style={[styles.textSmall]}>Type: <Text style={styles.boldTextSmall}>{data.type}</Text></Text>
                    </View>
                    <View style={[styles.iconTextContainer, { flex: 1, justifyContent: "center" }]}>
                        <View style={{ paddingRight: 5 }}>
                            <Image style={styles.icon} source={require('../../../assets/passenger/seats(grey).png')} />
                        </View>
                        <Text style={[styles.textSmall, {}]}>Seats: <Text style={styles.boldTextSmall}>{data.no_of_seats}</Text></Text>
                    </View>
                </View>

                {/* if you want to add addtional data (button or View) */}
                {props.AdditionalData}

            </View>
        </>
    );
};

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        driverDetails: state.user.driverDetails,
        platform: state.util.platform
    };
};


export default connect(mapStateToProps)(TripCardContent);

const styles = StyleSheet.create({
    container: {
        // flex: 1,
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
