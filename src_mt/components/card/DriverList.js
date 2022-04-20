import React from 'react';
import { Image, StyleSheet, View,  TouchableNativeFeedback, TouchableOpacity} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Theme from '../../Theme/Theme';
import Rating from '../rating/Rating';
import Text from './../../components/text/TextWithStyle';
import { uploadUrl } from '../../../store/actions/dataAction';
import { connect } from 'react-redux';

const VehicleList = (props) => {
  const data = props.data;
  return (
    <View>

    {props.platform === 'android' ? <TouchableNativeFeedback onPress={props.onPress}>
      <View style={[styles.content]}>
        <View style={{ justifyContent: 'space-evenly' }}>
          <Image style={{ width: 80, height: 80 }} source={{ uri: `${uploadUrl}/${data.profile_picture}` }} />
          {/* <Text style={{fontFamily: Theme.FONT_FAMILY_LATO,color: Theme.SECONDARY_COLOR,justifyContent: 'space-between', marginTop:10}}></Text> */}
        </View>
        <View style={{ flex: 1, justifyContent: 'space-evenly', marginLeft: 10 }}>

          <View>
            <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM, }}>{data.name}</Text>
            <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: 'grey' }}>{data.trip_completed > 0 ? data.trip_completed : "No"} {data.trip_completed < 2 ? "Trip" : "Trips"}</Text>
          </View>

          <View>
            <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: 'grey' }}>{data.reviews > 0 ? data.reviews : "No"} {data.reviews < 2 ? "Review" : "Reviews"}</Text>
            <Rating starCount={5} starSize={Theme.FONT_SIZE_XLARGE} disabled={true} rating={data.rated} />
          </View>

        </View>
      </View>
    </TouchableNativeFeedback>
    :
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.content, , props.platform === 'ios' && { zIndex: 100, shadowOffset: { width: 0, height: 2 }, shadowColor: 'black', shadowOpacity: 0.5, }]}>
        <View style={{ justifyContent: 'space-evenly' }}>
          <Image style={{ width: 80, height: 80 }} source={{ uri: `${uploadUrl}/${data.profile_picture}` }} />
          {/* <Text style={{fontFamily: Theme.FONT_FAMILY_LATO,color: Theme.SECONDARY_COLOR,justifyContent: 'space-between', marginTop:10}}></Text> */}
        </View>
        <View style={{ flex: 1, justifyContent: 'space-evenly', marginLeft: 10 }}>

          <View>
            <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM, }}>{data.name}</Text>
            <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: 'grey' }}>{data.trip_completed > 0 ? data.trip_completed : "No"} {data.trip_completed < 2 ? "Trip" : "Trips"}</Text>
          </View>

          <View>
            <Text style={{ fontFamily: Theme.FONT_FAMILY_LATO, fontSize: Theme.FONT_SIZE_SMALL, color: 'grey' }}>{data.reviews > 0 ? data.reviews : "No"} {data.reviews < 2 ? "Review" : "Reviews"}</Text>
            <Rating starCount={5} starSize={Theme.FONT_SIZE_XLARGE} disabled={true} rating={data.rated} />
          </View>

        </View>
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


export default connect(mapStateToProps)(VehicleList);

const styles = StyleSheet.create({
  content: {
    // flex: 1,
    height: hp(15),
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingHorizontal: 10,
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
