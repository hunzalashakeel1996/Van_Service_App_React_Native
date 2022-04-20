import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import Theme from '../../../Theme/Theme';
import Rating from '../../rating/Rating';
import Button from '../../button/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { calcTimeDifference } from '../../time/datetimeConventer';
import TimerComponent from '../../time/TimerComponent';
import currencyFormat from '../../currency/currencyFormat';
import { uploadUrl } from '../../../../store/actions/dataAction';
import { connect } from 'react-redux';

const DriverConfirmationCard = (props) => {
    const data = props.data;

    return (
        <View style={{ flex: 1, }}>
            {props.platform === 'android' ? <TouchableNativeFeedback>
                <View style={[styles.container, data.isNew == 'true' ? styles.isNew : styles.borderShadow]}>
                    <View style={{ height: hp(12), flexDirection: "row", justifyContent: "center" }}>
                        <View style={{ flex: 0.95, flexDirection: "row", justifyContent: "center", marginVertical: 8 }}>
                            <View style={{ flex: 0.25, flexDirection: "row", justifyContent: "flex-start" }}>
                                <View style={{ flex: 0.9 }}>
                                    <Image style={{ width: 70, height: 70, borderRadius: 2 }} source={{ uri: `${uploadUrl}/${data.car_image1}` }} />
                                    {data.isNew == 'true' && <Text style={{ position: "absolute", alignSelf: "flex-end", backgroundColor: Theme.RED_COLOR, width: 30, fontSize: 8, color: Theme.WHITE_COLOR, textAlign: "center" }}>NEW</Text>}
                                </View>
                            </View>
                            <View style={{ flex: 0.45, flexDirection: "row", justifyContent: "flex-start" }}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }} numberOfLines={1}>{data.car_name}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{data.color} {data.year}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Seats ({data.no_of_seats})</Text>
                                    <View style={{ flex: 1, }}>
                                        <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>Php {currencyFormat(data.payment)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 0.3, justifyContent: "flex-start" }}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }} numberOfLines={1}>{data.name}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{data.trip_completed} {data.trip_completed < 2 ? "Trip" : "Trips"}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{data.reviews} {data.reviews < 2 ? "Review" : "Reviews"}</Text>
                                    <Rating starCount={5} starSize={18} disabled={true} rating={data.rated} />
                                </View>
                            </View>
                        </View>
                    </View>
                    {props.cardButton && <View style={{ height: hp(13), marginHorizontal: 10, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 0.6 }}>
                            <TimerComponent timer={props.customer_time_limit}
                                timeCompleted={() => { props.timeCompleted(false) }}
                                textStyle={{ fontSize: 30 }}
                                contentStyle={{ padding: 2 }}
                                animate={false} />
                            <Text style={{ color: Theme.RED_COLOR, fontSize: Theme.FONT_SIZE_SMALL, textAlign: "center" }}>{`You have ${data.customer_time_limit} hours to make payment for this trip`}</Text>
                        </View>
                        {props.cardButton && <View style={{ flex: 0.4 }}>
                            <Button onPress={() => props.cardButton()} styleButton={{ alignSelf: "flex-end", height: 35, width: 120 }} styleText={{ fontSize: Theme.FONT_SIZE_MEDIUM }} >{props.cardButtonText}</Button>
                        </View>}
                    </View>}
                </View>
            </TouchableNativeFeedback>
            :
            <TouchableOpacity>
                <View style={[styles.container, data.isNew == 'true' ? styles.isNew : styles.borderShadow]}>
                    <View style={{ height: hp(12), flexDirection: "row", justifyContent: "center" }}>
                        <View style={{ flex: 0.95, flexDirection: "row", justifyContent: "center", marginVertical: 8 }}>
                            <View style={{ flex: 0.25, flexDirection: "row", justifyContent: "flex-start" }}>
                                <View style={{ flex: 0.9 }}>
                                    <Image style={{ width: 70, height: 70, borderRadius: 2 }} source={{ uri: `${uploadUrl}/${data.car_image1}` }} />
                                    {data.isNew == 'true' && <Text style={{ position: "absolute", alignSelf: "flex-end", backgroundColor: Theme.RED_COLOR, width: 30, fontSize: 8, color: Theme.WHITE_COLOR, textAlign: "center" }}>NEW</Text>}
                                </View>
                            </View>
                            <View style={{ flex: 0.45, flexDirection: "row", justifyContent: "flex-start" }}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }} numberOfLines={1}>{data.car_name}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{data.color} {data.year}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Seats ({data.no_of_seats})</Text>
                                    <View style={{ flex: 1, }}>
                                        <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>Php {currencyFormat(data.payment)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 0.3, justifyContent: "flex-start" }}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }} numberOfLines={1}>{data.name}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{data.trip_completed} {data.trip_completed < 2 ? "Trip" : "Trips"}</Text>
                                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{data.reviews} {data.reviews < 2 ? "Review" : "Reviews"}</Text>
                                    <Rating starCount={5} starSize={18} disabled={true} rating={data.rated} />
                                </View>
                            </View>
                        </View>
                    </View>
                    {props.cardButton && <View style={{ height: hp(13), marginHorizontal: 10, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 0.6 }}>
                            <TimerComponent timer={props.customer_time_limit}
                                timeCompleted={() => { props.timeCompleted(false) }}
                                textStyle={{ fontSize: 30 }}
                                contentStyle={{ padding: 2 }}
                                animate={false} />
                            <Text style={{ color: Theme.RED_COLOR, fontSize: Theme.FONT_SIZE_SMALL, textAlign: "center" }}>{`You have ${data.customer_time_limit} hours to make payment for this trip`}</Text>
                        </View>
                        {props.cardButton && <View style={{ flex: 0.4 }}>
                            <Button onPress={() => props.cardButton()} styleButton={{ alignSelf: "flex-end", height: 35, width: 120 }} styleText={{ fontSize: Theme.FONT_SIZE_MEDIUM }} >{props.cardButtonText}</Button>
                        </View>}
                    </View>}
                </View>
            </TouchableOpacity>}
        </View>
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
  
  
  export default connect(mapStateToProps)(DriverConfirmationCard);

const styles = StyleSheet.create({
    container: {
        height: hp(25),
        justifyContent: "center",
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        zIndex: 1
    },
    isNew: {
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
        fontSize: Theme.FONT_SIZE_LARGE,
        color: Theme.WHITE_COLOR
    }
});
