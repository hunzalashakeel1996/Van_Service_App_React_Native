import React, { Fragment, useState, useEffect, Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    ToastAndroid,
    TouchableNativeFeedback,
    Alert
} from 'react-native';
import Theme from '../../Theme/Theme';
import ButtonBorder from '../../components/button/ButtonBorder';
import RadioBox from '../../components/Radio/RadioBox';
import Button from '../../components/button/Button';
import Segment from '../../components/segment/Segment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Text from '../../components/text/TextWithStyle';
import timeConverter from '../../components/time/timeConverter';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputWithIcon from '../../components/input/InputWithIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createWallet, logout } from '../../../store/actions/dataAction';
import { connect } from "react-redux";
import LoaderModal from './../../components/modal/LoaderModal';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import momentDate from '../../components/time/momentDate';
import UserProfileCard from './../../components/card/UserProfileCard';
import { setUserLogout, setWalletData } from '../../../store/actions/userAction';
import currencyFormat from '../../components/currency/currencyFormat';


const Account = (props) => {
    // const [index, setIndex] = React.useState(0);
    const [loader, setLoader] = React.useState(false);

    useEffect(() => {
        // console.warn(props.walletData)
        return () => {
            // console.warn("ScheduleTrip unMount")
        };
    }, [])

    const navigateScreen = (screen, params) => {
        props.navigation.navigate(screen, params)
    }

    const chkLogout = () => {
        Alert.alert(
            'Log Out',
            'Do you want to logout?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                { text: 'Confirm', onPress: () => logout() },
            ],
            { cancelable: false }
        )
    }

    const logout = () => {
        setLoader(true);
        props.logout(props.userData.id).then(() => {
            // AsyncStorage.clear();
            props.navigation.navigate("LoginApp");
            props.setUserLogout();
            setLoader(false);
        });
    }
    const activateWallet = () => {
        setLoader(true);
        props.createWallet(props.userData.id).then((res) => {
            // AsyncStorage.clear();
            console.log(res)
            props.setWalletData(res)
            navigateScreen('DepositPayment')
            setLoader(false);
        });
    }
    
    const settings = [
        {
            name: 'My Profile',
            onPress: null,
        }, {
            name: 'Notification Settings',
            onPress: null,
        }, {
            name: 'Privacy Settings',
            onPress: null,
        }, {
            name: 'Reward Points',
            onPress: null,
        }, {
            name: 'Billing',
            onPress: () => navigateScreen('Billing'),
        }, {
            name: 'Help Center',
            onPress: null,
        }, {
            name: 'Request Account Deletion',
            onPress: null,
        }, {
            name: 'Log Out',
            onPress: () => chkLogout(),
        },
    ]

    return (
        <Fragment>
            <StatusBar barStyle="light-content" />
            {/* show a loader when any activity in process */}
            <LoaderModal modalVisible={loader} />


            <ScrollView style={{ flex: 1, marginBottom: 15 }}>
                <UserProfileCard data={props.userData} editProfilePic={props.userData.role == "P"} />
                {props.walletData.status == 'active' ? <TouchableOpacity onPress={() => navigateScreen('Wallet')} style={{ height: wp(15), width: wp(95), flexDirection: 'row', alignSelf: 'center', borderRadius: 10, alignItems: "center", backgroundColor: Theme.WHITE_COLOR }}>
                    <View style={{ flex: 0.6 }}>
                        <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_SMALL, marginLeft: 20 }}>Wallet Balance:</Text>
                        <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE, marginLeft: 20 }}>Php {currencyFormat(props.walletData.amount)}</Text>
                    </View>
                    <View style={{ flex: 0.3, alignItems: "center" }}>
                        <Button onPress={() => navigateScreen('DepositPayment')} styleButton={{ height: 30, width: '80%', borderRadius: 0 }} styleText={{ fontSize: Theme.FONT_SIZE_SMALL }}>DEPOSIT</Button>
                    </View>
                    <Ionicons style={{ flex: 0.1, }} name={'chevron-forward'} size={25} color={Theme.SECONDARY_COLOR} />
                </TouchableOpacity> :
                    <TouchableOpacity onPress={() => activateWallet()} style={{ height: wp(15), width: wp(95), flexDirection: 'row', alignSelf: 'center', borderRadius: 10, alignItems: "center", backgroundColor: Theme.WHITE_COLOR }}>
                        <View style={{ flex: 0.9 }}>
                            <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_LARGE, marginLeft: 20 }}>Activate Your Wallet</Text>
                        </View>
                        <Ionicons style={{ flex: 0.1, }} name={'chevron-forward'} size={25} color={Theme.SECONDARY_COLOR} />
                    </TouchableOpacity>}
                {settings.map(item => (<TouchableOpacity disabled={item.onPress == null} onPress={item.onPress} style={[styles.itemView]}>
                    <View style={{ flex: 0.9, justifyContent: "center" }}>
                        <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_LARGE, marginLeft: 20 }}>{item.name}</Text>
                    </View>
                    <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                        <Ionicons name={'chevron-forward'} size={25} color={Theme.SECONDARY_COLOR} />
                    </View>
                </TouchableOpacity>))}
                <View style={{ height: wp(10), justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE, marginLeft: 20 }}>Happy with MyTsuper? Rate Us!</Text>
                </View>
            </ScrollView>
        </Fragment >
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    itemView: {
        // flex: 0.1,
        height: wp(15),
        borderBottomColor: Theme.BORDER_COLOR,
        borderBottomWidth: 1,
        flexDirection: "row",
        marginHorizontal: 20
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR
    },
});


const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        walletData: state.user.walletData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: (user_id) => dispatch(logout(user_id)),
        createWallet: (user_id) => dispatch(createWallet(user_id)),
        setUserLogout: () => dispatch(setUserLogout()),
        setWalletData: data => dispatch(setWalletData(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);