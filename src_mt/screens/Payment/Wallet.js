import React, { Fragment, useState, useEffect, Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import Theme from '../../Theme/Theme';
import Button from '../../components/button/Button';
import Text from '../../components/text/TextWithStyle';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from "react-redux";
import { CommonActions, StackActions } from '@react-navigation/native';
import LoaderModal from '../../components/modal/LoaderModal';
import currencyFormat from '../../components/currency/currencyFormat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserProfileCard from '../../components/card/UserProfileCard';


const Wallet = (props) => {

    const navigateScreen = (screen, params) => {
        props.navigation.navigate(screen, params)
    }


    const settings = [
        {
            name: props.userData.role == "P" ? 'Deposit' : 'Withdraw',
            onPress: () => props.userData.role == "P" ? navigateScreen('DepositPayment'): null,
        }, {
            name: 'Summary',
            onPress: null,
            // onPress: () => navigateScreen('WalletSummary'),
        }, {
            name: 'Wallet FAQs',
            onPress: null,
            // onPress: () => navigateScreen('WalletFAQs'),
        }
    ]

    return (
        <Fragment>
            <StatusBar barStyle="light-content" />
            {/* show a loader when any activity in process */}
            {props.route.name === "Wallet" && <LoaderModal modalVisible={props.loading} />}

            <ScrollView style={{ flex: 1 }}>
                <UserProfileCard data={props.userData} editProfilePic={props.userData.role == "P"} />
                <TouchableOpacity onPress={() => navigateScreen('Wallet')} style={{ height: wp(15), marginBottom: 10, width: wp(95), flexDirection: 'row', alignSelf: 'center', borderRadius: 10, alignItems: "center", backgroundColor: Theme.WHITE_COLOR }}>
                    <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, marginLeft: 20 }}>Available Balance:</Text>
                    <Text style={{ color: Theme.SECONDARY_COLOR, fontSize: Theme.FONT_SIZE_LARGE, marginLeft: 20 }}>Php {currencyFormat(props.walletData.amount ? props.walletData.amount : '0')}</Text>
                </TouchableOpacity>
                {settings.map(item => (<TouchableOpacity disabled={item.onPress == null} onPress={item.onPress} style={[styles.itemView]}>
                    <View style={{ flex: 0.9, justifyContent: "center" }}>
                        <Text style={{ color: Theme.BORDER_COLOR, fontSize: Theme.FONT_SIZE_LARGE, marginLeft: 20 }}>{item.name}</Text>
                    </View>
                    <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                        <Ionicons name={'chevron-forward'} size={25} color={Theme.SECONDARY_COLOR} />
                    </View>
                </TouchableOpacity>))}
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
        contractTrip: (data) => dispatch(contractTrip(data)),
    };
};

export default connect(mapStateToProps)(Wallet);