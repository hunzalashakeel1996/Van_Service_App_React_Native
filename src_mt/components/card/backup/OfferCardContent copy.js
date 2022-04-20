import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import Theme from '../../../Theme/Theme';
import Rating from '../../rating/Rating';
import datetimeConventer from '../../time/datetimeConventer';
import currencyFormat from '../../currency/currencyFormat';
import { uploadUrl } from '../../../../store/actions/dataAction';


const OfferCardContent = (props) => {
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
            <Text style={{ fontSize: 35, color: "rgba(255,255,255,1)" }}>{"NOT AVAILABLE"}</Text>
        </View>}
        <View style={[styles.container, getStatusStyle(), props.ContainerStyle]}>
            {/* <View style={[styles.container, data.isNew == 'true' ? styles.isNew : styles.borderShadow, props.containerStyle]}> */}
            {/* <View style={{ flex: 0.95, flexDirection: "row", justifyContent: "center", marginVertical: 8 }}> */}
                <View style={{ flex: 0.25, flexDirection: "row", justifyContent: "flex-start" }}>
                    <View style={{ flex: 0.9 }}>
                        <Image style={{ width: 70, height: 70, borderRadius: 2 }} source={{ uri: `${uploadUrl}/${data.car_image1}` }} />
                        {data.isNew == true && <Text style={{ position: "absolute", alignSelf: "flex-end", backgroundColor: Theme.RED_COLOR, paddingHorizontal: 8, fontSize: 8, color: Theme.WHITE_COLOR, textAlign: "center" }}>NEW</Text>}
                    </View>
                </View>
                <View style={{ flex: 0.45, flexDirection: "row", justifyContent: "flex-start" }}>
                    <View style={{ flex: 0.9 }}>
                        <Text style={{ color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }} numberOfLines={1}>{data.vehicle_name}</Text>
                        <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{data.color} {data.year}</Text>
                        <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>Seats ({data.vehicle_no_of_seats})</Text>
                        <View style={{ flex: 1, justifyContent: "flex-end", }}>
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

            {/* if you want to add addtional data (button or View) */}
            {props.AdditionalData}
            
        {/* </View> */}
    </>
    );
};


export default OfferCardContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        // backgroundColor: Theme.WHITE_COLOR,
        // elevation: 5
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
    isNew: {
        backgroundColor: "#e4e4e4"
    },
    text: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_LARGE,
        color: Theme.WHITE_COLOR
    }
});
