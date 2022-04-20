import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native';
import Theme from '../../Theme/Theme';
import timeConverter from '../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../time/datetimeConventer';
import Button from '../button/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import currencyFormat from '../currency/currencyFormat';
import TripNameFormat from '../util/TripNameFormat';
import Rating from '../rating/Rating';
import momentDate from '../time/momentDate';
import { uploadUrl } from '../../../store/actions/dataAction';

const UserInfoCard = (props) => {
    const data = props.data;
    const showPicture = props.showPicture == false ? false : true;
    console.log(`${uploadUrl}/${data.profile_picture}`)
    // console.log(data.rated)
    return (
        showPicture ? <View style={{ height: 80, flexDirection: "row", marginHorizontal: 15, marginVertical: 5 }} >
            <View style={{ flex: 0.6, justifyContent: 'space-evenly' }}>
                <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}><Text style={styles.boldText}>{data.name}</Text>
                    {/* <Text style={{ color: Theme.RED_COLOR }}> (Top Rated)</Text> */}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <Text style={[{ color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_SMALL }, styles.boldTextSmall]}>{Math.trunc(data.rated) > 0 ? `${Math.trunc(data.rated)}.0` : ""} </Text>
                    <Rating starCount={5} disabled={true} rating={data.rated} />
                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}> ({data.reviews > 0 ? data.reviews : "No"} {data.reviews < 2 ? 'Review' : 'Reviews'})</Text>
                </View>
                <Text style={{ color: Theme.BLUE_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Joined: {momentDate(data.created_at)}</Text>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, height: 20, backgroundColor: Theme.GREEN_COLOR, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL, color: Theme.WHITE_COLOR }} numberOfLines={1}>Completed: {data.trip_completed}</Text>
                    </View>
                    <View style={{ flex: 1, height: 20, backgroundColor: Theme.RED_COLOR, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL, color: Theme.WHITE_COLOR }} numberOfLines={1}>Canceled: {data.trip_canceled}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 0.4, justifyContent: "space-evenly", alignItems: "flex-end", marginHorizontal: 10 }}>
                <Image style={{ width: 75, height: 75, borderRadius: 75 / 2 }} source={{ uri: `${uploadUrl}/${data.profile_picture}` }} />
            </View>
        </View>
            :
            <View style={{ height: 50, flexDirection: "row", marginHorizontal: 15, marginVertical: 5 }}>
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }}><Text style={styles.boldText}>{data.name}</Text>
                        {/* <Text style={{ color: Theme.RED_COLOR }}> (Top Rated)</Text> */}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={[{ color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_SMALL }, styles.boldTextSmall]}>{data.rated > 0 ? `${data.rated}.0` : ""} </Text>
                        <Rating starCount={5} disabled={true} rating={data.rated} />
                        <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}> ({data.reviews > 0 ? data.reviews : "No"} {data.reviews < 2 ? 'Review' : 'Reviews'})</Text>
                    </View>

                </View>
                <View style={{ flex: 1, justifyContent: "space-evenly" }}>
                    <Text style={{ color: Theme.BLUE_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Joined: {momentDate(data.created_at)}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, height: 20, backgroundColor: Theme.GREEN_COLOR, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL, color: Theme.WHITE_COLOR }} numberOfLines={1}>Completed: {data.trip_completed}</Text>
                        </View>
                        <View style={{ flex: 1, height: 20, backgroundColor: Theme.RED_COLOR, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_XSMALL, color: Theme.WHITE_COLOR }} numberOfLines={1}>Canceled: {data.trip_canceled}</Text>
                        </View>
                    </View>
                </View>
            </View>
    );
};


export default UserInfoCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        zIndex: 1
    },
    containerRadius: {
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 5,
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
