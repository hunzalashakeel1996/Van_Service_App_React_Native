import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    FlatList,
    PermissionsAndroid,
    ToastAndroid,
    TouchableNativeFeedback,
    Switch
} from 'react-native';
import { connect } from "react-redux";
import Text from './../../../components/text/TextWithStyle';
import Theme from '../../../Theme/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { uploadUrl, getBillingTrips } from '../../../../store/actions/dataAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BillingCard from './../../../components/card/BillingCard';
import LoaderModal from './../../../components/modal/LoaderModal';
import TripCard from './../../../components/card/TripCard';

class BillingTripDetail extends Component {
    state = {
        isLoading: false,
        trips: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11,]
    }

    componentDidMount = () => {
        // this.props.getBillingTrips(this.props.userData.id).then(trips => {
        //     this.setState({ trips, isLoading: false})
        // })
    }

    navigateScreen = (screen, data = {}) => {
        props.navigation.navigate(screen, data)
    }

    render() {
        const trip = this.props.route.params?.item
        const { isLoading, trips } = this.state
        return (
            <View style={{ flex: 1}}>
                <TripCard data={{ ...trip }} showBlock={true} ContainerStyle={{ backgroundColor: Theme.BORDER_COLOR_OPACITY }} />
                <View style={{ flex: 1, marginHorizontal: 15, marginTop: 20 }}>
                    <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 0.9 }}>Ride Fare</Text>
                        <Text>Php </Text>
                        <Text style={{ fontWeight: Theme.FONT_WEIGHT_BOLD, fontSize: Theme.FONT_SIZE_LARGE }}>{trip.payment}</Text>
                    </View>

                    <View style={{ flex: 0.25, justifyContent: 'center', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ flex: 0.9 }}>Trip Fare</Text>
                            <Text>Php </Text>
                            <Text style={{}}>162.64</Text>
                        </View>
                        <View style={{ flex: 0.4, flexDirection: 'row' }}>
                            <Text style={{ flex: 0.9 }}>Service Fee</Text>
                            <Text>Php </Text>
                            <Text style={{}}>162.64</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.25, justifyContent: 'center', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ flex: 0.9 }}>Subtotal</Text>
                            <Text>Php </Text>
                            <Text style={{}}>162.64</Text>
                        </View>
                        <View style={{ flex: 0.4, flexDirection: 'row' }}>
                            <Text style={{ flex: 0.9 }}>VAT</Text>
                            <Text>Php </Text>
                            <Text style={{}}>162.64</Text>
                        </View>
                    </View>

                    <View style={{ flex: 0.2, flexDirection: 'row', marginTop: 15 }}>
                        <Text style={{ flex: 0.9, fontWeight: Theme.FONT_WEIGHT_BOLD, fontSize: Theme.FONT_SIZE_LARGE  }}>Total Amount</Text>
                        <Text style={{fontWeight: Theme.FONT_WEIGHT_BOLD, fontSize: Theme.FONT_SIZE_LARGE }}>Php </Text>
                        <Text style={{ fontWeight: Theme.FONT_WEIGHT_BOLD, fontSize: Theme.FONT_SIZE_LARGE }}>{trip.payment}</Text>
                    </View>

                </View>

            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        // flex: 1,
        height: hp(10),
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
})


const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getBillingTrips: (user_id) => dispatch(getBillingTrips(user_id)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingTripDetail);