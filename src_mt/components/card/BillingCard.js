import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import Theme from '../../Theme/Theme';
import timeConverter from '../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../time/datetimeConventer';
import Text from '../text/TextWithStyle';
import TripCard from './TripCard';
import OfferCard from './OfferCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OutlineButton from './../button/OutlineButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

const BilingCard = (props) => {
    const {data, isTripDetails, trip} = props;
    return (
        <View>

            {isTripDetails ?
                <TouchableOpacity onPress={props.onTripPressed} style={[style.content, {marginVertical: 8,marginHorizontal: 2,  height: hp(10)}, props.platform === 'ios' && { zIndex: 100, shadowOffset: { width: 0, height: 2 }, shadowColor: 'black', shadowOpacity: 0.5, }]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: Theme.BORDER_COLOR_OPACITY, marginVertical: 5 }}>
                            <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL, marginBottom: 5 }}>Trip ID</Text>
                            <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.request_id}</Text>
                        </View>
                        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                            <Text style={{ color:  Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL, marginBottom: 5 }}>Trip</Text>
                            <Text numberOfLines={1} style={{ fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.destination} Trip</Text>
                        </View>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: Theme.BORDER_COLOR_OPACITY, marginVertical: 5 }}>
                            <Text style={{ color:  Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL, marginBottom: 5 }}>Amount</Text>
                            <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM }}>Php {trip.payment}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                :
                <View style={style.content}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name={'ios-wallet'} size={25} color={Theme.SECONDARY_COLOR} />
                        </View>
                        <View style={{ flex: 0.6, justifyContent: 'center', marginLeft: 5 }}>
                            <Text style={{ fontWeight: Theme.FONT_WEIGHT_BOLD }}>Cash</Text>
                        </View>
                        <TouchableOpacity onPress={props.onPromoPress} style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: Theme.BORDER_COLOR_OPACITY, marginVertical: 5 }}>
                            <Text style={{ color: 'grey', fontSize: Theme.FONT_SIZE_SMALL }}>+PROMO</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
        </View>
    );
};

const mapStateToProps = state => {
    return {
      platform: state.util.platform
    };
  };
  
  
  export default connect(mapStateToProps)(BilingCard);
  
const style = StyleSheet.create({
    content: {
        // flex: 1,
        height: hp(8),
        flexDirection: 'row',
        paddingHorizontal: 10,
        // borderRadius: 5,
        backgroundColor: '#ffff',
        elevation: 5,
        // borderWidth: 1,
        borderRadius: 10,
        // borderColor: Theme.BORDER_COLOR_OPACITY,
        // marginBottom:10
      },
});
