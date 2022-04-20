import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    RefreshControl, Alert,
    Image, FlatList, ToastAndroid,
    TouchableNativeFeedback
} from 'react-native';
import Theme from '../../Theme/Theme';
import timeConverter from '../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../time/datetimeConventer';
import Button from '../button/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import currencyFormat from '../currency/currencyFormat';
import TripNameFormat from '../util/TripNameFormat';
import Rating from '../rating/Rating';
import momentDate from '../time/momentDate';
import Text from './../../components/text/TextWithStyle';
import { uploadUrl } from '../../../store/actions/dataAction';
import { connect } from 'react-redux';

const VehicleList = (props) => {
    const data = props.data;
    return (
        <View>
        {props.platform === 'android' ? <TouchableNativeFeedback onPress={props.onPress} >
        <View style={[styles.content, props.index == 0 && { marginTop: 10}]}>
            <View style={{ flex: 0.3, justifyContent: 'space-evenly', alignItems: "center" }}>
                <Image style={{ width: 80, height: 80 }} source={{ uri: `${uploadUrl}/${data.car_image1}` }} />
                {/* <Text style={{fontFamily: Theme.FONT_FAMILY_LATO,color: Theme.SECONDARY_COLOR,justifyContent: 'space-between', marginTop:10}}></Text> */}
            </View>
            <View style={{ flex: 0.7, justifyContent: 'space-evenly', marginLeft: 5 }}>
                <View>
                    <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM, }}>{data.vehicle_name}</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Year: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}> {data.year}</Text>
                    </View>
                    <View style={{ flex: 0.7, alignItems: 'center' }}>
                        <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }} numberOfLines={1}>Color: <Text style={{ color: Theme.BLACK_COLOR, fontFamily: Theme.FONT_FAMILY_BOLD }}>{data.color}</Text></Text>  
                    </View>
                    {/* <View style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Plate No: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}>{data.registration_number}</Text>
                    </View> */}
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {/* <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Type: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}>{data.vehicle_type}</Text>
                    </View> */}
                    <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Plate No: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}>{data.registration_number}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 15, height: 15, marginRight: 5 }} source={require('../../../assets/passenger/seats.png')} />
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Seats ({data.vehicle_no_of_seats})</Text>
                    </View>
                    <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 15, height: 15, marginRight: 5 }} source={require('../../../assets/passenger/ac.png')} />
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>A/C {data.opt_1_val === 0 ? 'No' : 'Yes'}</Text>
                    </View>
                </View>
            </View>
        </View>
        </TouchableNativeFeedback>
         :
         <TouchableOpacity onPress={props.onPress}>
        <View style={[styles.content, props.index == 0 && { marginTop: 10}, props.platform === 'ios' && { zIndex: 100, shadowOffset: { width: 0, height: 2 }, shadowColor: 'black', shadowOpacity: 0.5, }]}>
            {/* {console.warn(props.platform)} */}
            <View style={{ flex: 0.3, justifyContent: 'space-evenly', alignItems: "center" }}>
                <Image style={{ width: 80, height: 80 }} source={{ uri: `${uploadUrl}/${data.car_image1}` }} />
                {/* <Text style={{fontFamily: Theme.FONT_FAMILY_LATO,color: Theme.SECONDARY_COLOR,justifyContent: 'space-between', marginTop:10}}></Text> */}
            </View>
            <View style={{ flex: 0.7, justifyContent: 'space-evenly', marginLeft: 5 }}>
                <View>
                    <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM, }}>{data.vehicle_name}</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Year: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}> {data.year}</Text>
                    </View>
                    <View style={{ flex: 0.7, alignItems: 'center' }}>
                        <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }} numberOfLines={1}>Color: <Text style={{ color: Theme.BLACK_COLOR, fontFamily: Theme.FONT_FAMILY_BOLD }}>{data.color}</Text></Text>  
                    </View>
                    {/* <View style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Plate No: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}>{data.registration_number}</Text>
                    </View> */}
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {/* <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Type: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}>{data.vehicle_type}</Text>
                    </View> */}
                    <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Plate No: </Text>
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BLACK_COLOR, fontWeight: 'bold' }}>{data.registration_number}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 15, height: 15, marginRight: 5 }} source={require('../../../assets/passenger/seats.png')} />
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>Seats ({data.vehicle_no_of_seats})</Text>
                    </View>
                    <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 15, height: 15, marginRight: 5 }} source={require('../../../assets/passenger/ac.png')} />
                        <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: Theme.BORDER_COLOR, }}>A/C {data.opt_1_val === 0 ? 'No' : 'Yes'}</Text>
                    </View>
                </View>
            </View>
        </View>
        </TouchableOpacity>
        }
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
  
  
  export default connect(mapStateToProps)(VehicleList);

const styles = StyleSheet.create({
    content: {
        // flex: 1,
        height: hp(15),
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 5,
        // paddingHorizontal: 10,
        // borderRadius: 5,
        backgroundColor: '#ffff',
        elevation: 5,
        // borderWidth: 1,
        borderRadius: 10,
        // borderColor: Theme.BORDER_COLOR_OPACITY,
        // marginBottom:10
    },
    contentAnotherBox: {
        flex: 1,
        // marginTop:10,
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: '#ffff',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderRightColor: Theme.BORDER_COLOR_OPACITY,
        borderLeftColor: Theme.BORDER_COLOR_OPACITY,
        borderBottomColor: Theme.BORDER_COLOR_OPACITY,
        marginBottom: 10
    },
});
