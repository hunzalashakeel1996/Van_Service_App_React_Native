import React, { Fragment, useState, } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Alert, Pressable
} from 'react-native';
import Theme from '../../Theme/Theme';
import Button from '../../components/button/Button';
import Text from '../../components/text/TextWithStyle';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from "react-redux";
import LoaderModal from '../../components/modal/LoaderModal';
import currencyFormat from '../../components/currency/currencyFormat';
import { transaction } from '../../../store/actions/dataAction';
import { setWalletData } from '../../../store/actions/userAction';


const DepositPayment = (props) => {

    const navigateScreen = (screen, params) => {
        props.navigation.navigate(screen, params)
    }

    const paymentMethods = [
        { name: 'GCash' },
        { name: 'Paypal' },
        { name: 'InstaPay' },
    ]

    const initControls = {
        payment: {
            value: '',
            validationRules: [
                Validators.required("Deposit Amount is required"),
            ]
        },
        selectedMethod: {
            value: '',
            validationRules: [
                Validators.required("Please select Payment Method"),
            ]
        }
    };

    const keys = ['payment', 'selectedMethod'];

    const [controls, setControls] = useState(initControls)

    const setValue = (type, val) => {
        let cont = { ...controls }
        cont[type].value = val;
        setControls(cont);
        if (cont[type].validationRules) {
            Validators.validation([type], cont).then(validate => {
                setControls(validate.controls)
            });
        }
    }


    const depositAmount = () => {

        Validators.validation(keys, { ...controls }).then(validate => {
            const { selectedMethod, payment } = validate.controls
            // if all validation feilds are valid
            if (validate.formValid) {
                let data = {
                    userId: props.userData.id,
                    receiverWalletId: props.walletData.id,
                    walletType: selectedMethod.value,
                    method: 'DEPOSIT',
                    sender: selectedMethod.value,
                    receiver: props.userData.name,
                    amount: payment.value,
                    status: 'Success',
                    // status: 'In_Process',
                }
                props.transaction(data).then((res) => {
                    props.setWalletData(res)
                    Alert.alert("Payment Success", 'Amount is succesfully credited to your wallet',
                        [
                            {
                                text: "OK",
                                onPress: () => navigateScreen('Account'),
                            }
                        ])
                })

            } else {
                setControls(validate.controls)
            }
        })
    }


    return (
        <Fragment>
            <StatusBar barStyle="light-content" />
            {/* show a loader when any activity in process */}
            {props.route.name === "DepositPayment" && <LoaderModal modalVisible={props.loading} />}

            <ScrollView style={{ flex: 1, marginHorizontal: 15, }}>
                <View style={{ height: hp(15), justifyContent: "space-evenly", marginTop: 5 }}>
                    <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM }}>Enter Deposit Amount</Text>
                    <View style={{ flexDirection: "row", elevation: 5, marginHorizontal: 5, borderRadius: 5, backgroundColor: Theme.WHITE_COLOR, alignItems: "center", paddingHorizontal: 10 }}>
                        <Text style={{ flex: 0.3, fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR }}>Php</Text>
                        <TextInput
                            style={{ flex: 0.7, textAlign: "right", height: 50, fontSize: Theme.FONT_SIZE_LARGE, }}
                            onChangeText={text => setValue('payment', text.replace(/[^0-9]/g, ""))}
                            value={currencyFormat(controls.payment.value)}
                            keyboardType={Platform.OS === 'android' && "numeric"}
                            maxLength={10}
                            autoFocus
                        />
                    </View>
                    {controls.payment.error && <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, color: Theme.RED_COLOR }}>{controls.payment.error}</Text>}
                </View>
                <View style={{ height: hp(54) }}>
                    <Text style={{ fontFamily: Theme.FONT_FAMILY_BOLD, fontSize: Theme.FONT_SIZE_MEDIUM, marginVertical: 10 }}>Select Payment Method</Text>
                    {paymentMethods.map((item, index) =>
                        <Pressable android_ripple={{ radius: 1000 }} key={index} onPress={() => setValue('selectedMethod', item.name)} style={{ height: hp(7), flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: controls.selectedMethod.value == item.name ? Theme.SECONDARY_COLOR : Theme.BORDER_COLOR_OPACITY, borderRadius: 5, margin: 5 }}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: controls.selectedMethod.value == item.name ? Theme.SECONDARY_COLOR : Theme.BLACK_COLOR }} >{item.name}</Text>
                        </Pressable>
                        // <TouchableOpacity onPress={()=>setValue('selectedMethod', item.name)} style={{ height: hp(7), flexDirection: "row", alignItems: "center", justifyContent: "center", elevation: 1, backgroundColor: controls.selectedMethod.value == item.name ? Theme.SECONDARY_COLOR : Theme.WHITE_COLOR, borderRadius: 5, margin: 5 }}>
                        //     <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: controls.selectedMethod.value == item.name ? Theme.WHITE_COLOR : Theme.BLACK_COLOR }} >{item.name}</Text>
                        // </TouchableOpacity>
                    )}
                </View>
                {controls.selectedMethod.value != "" && <View style={{ height: hp(10), justifyContent: "center" }}>
                    <Button disabled={props.loading} styleButton={{ width: "90%", alignSelf: 'center' }} onPress={() => depositAmount()}>Confirm</Button>
                </View>}
            </ScrollView>
        </Fragment >
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    itemView: {
        flex: 0.1,
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
        transaction: (data) => dispatch(transaction(data)),
        setWalletData: (data) => dispatch(setWalletData(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DepositPayment);