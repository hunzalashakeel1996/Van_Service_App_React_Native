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

class Billing extends Component {
    state = {
        isLoading: true,
        trips: []
    }

    componentDidMount = () => {
        this.props.getBillingTrips(this.props.userData.id).then(trips => {
            this.setState({ trips, isLoading: false})
        })
    }

    navigateScreen = (screen, data={}) => {
        this.props.navigation.navigate(screen, data)
    }

    render() {
        const { userData } = this.props
        const {isLoading, trips} = this.state

        if(!isLoading){
            return (
                // <ScrollView>
                    <View style={{ flex: 1, marginHorizontal: 15 }}>
                   <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />

                        {/* <View style={{ marginTop: 20, flex: 0.15 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 0.7 }}>
                                    <Text style={{ }}>MyTsuper Cash</Text>
                                    <Text style={{ }}>0.00</Text>
                                </View>
                                <View style={{ flex: 0.3 }}>
                                    <Switch
                                        trackColor={{ false: "grey", true: Theme.SECONDARY_COLOR }}
                                        thumbColor={'white'}
                                        ios_backgroundColor="#3e3e3e"
                                        value={true}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 0.25 }}>
                            <Text style={{ color: Theme.BORDER_COLOR, marginBottom: 10 }}>Payment Method</Text>
                            <BillingCard
                                data={userData}
                                onPromoPress={() => { console.warn('add promo pressed') }}
                            />
                        </View> */}

                    <TouchableOpacity style={{ flex: 0.1, justifyContent: "center" }}>
                        <Text style={{  color: Theme.BLUE_COLOR }}>Add Payment Method</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={trips}
                            renderItem={(item) => (
                                <BillingCard
                                    data={userData}
                                    onTripPressed={() => { this.navigateScreen("BillingTripDetail", item) }}
                                    isTripDetails={true}
                                    trip={item.item}
                                />
                            )}
                             keyExtractor={item => item}
                        >
                        </FlatList>
                    </View>
                </View>
                // </ScrollView>
            )
        } else {
            return (
                this.props.route.name === "Billing" && <LoaderModal modalVisible={isLoading} />
            )
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Billing);