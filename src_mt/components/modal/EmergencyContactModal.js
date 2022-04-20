import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    ActivityIndicator,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import Theme from '../../Theme/Theme';
import Text from './../text/TextWithStyle';
import InputWithIcon from './../input/InputWithIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaskInputWithIcon from './../input/MaskInputWithIcon';
import Button from './../button/Button';
import Validators from './../validator/Validators';
import { connect } from "react-redux";
import { Picker } from '@react-native-picker/picker';

const EmergencyContactModal = (props) => {
    const [countryCode, setCountryCode] = useState("+63");

    const initControls = {
        name: {
            value: '',
            validationRules: [
                Validators.required("Full Name is required")
            ]
        },
        // relation: {
        //     value: '',
        //     validationRules: [
        //         Validators.required("Relationship is required")
        //     ]
        // },
        number: {
            value: '',
            validationRules: [
                Validators.required("Contact Number are required"),
                Validators.minLength("Please enter valid Contact Number", 11),
                Validators.compareValues("Emergency Contact cannot be same as Registered Number", props.userContact.replace(`${countryCode}-`, ""))
            ]
        },
    }

    const [controls, setControls] = useState(initControls);
    const relationList = ["Father", "Mother", "Brother", "Sister"];


    useEffect(() => {
        if (props.emergencyContact != "") {
            let tempControls = { ...controls };
            tempControls.name.value = props.emergencyContact.name;
            tempControls.number.value = props.emergencyContact.number;

            setControls(tempControls)

        }
    }, [])

    const sendEmergencyContact = () => {
        let keys = Object.keys(controls);
        Validators.validation(keys, { ...controls }).then(validate => {
            if (validate.formValid) {
                let data = {
                    name: controls.name.value,
                    relation: null,
                    number: countryCode + "-" + controls.number.value
                }
                props.setEmergencyContact(data);
            }
            else {
                setControls(validate.controls)
            }

        })
    }

    const setValue = (type, val) => {
        let cont = { ...controls }
        cont[type].value = val;

        if (cont[type].validationRules) {
            Validators.validation([type], cont).then(validate => {
                setControls(validate.controls)
            });
        } else {
            setControls(cont)
        }
    }

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => props.setModalVisible(false)}
            >
                <View style={[styles.container, {marginTop: props.platform === 'ios' ? 20 : null}]}>
                    {/* {console.warn('11')} */}
                    {/* <View style={styles.containerView}> */}
                    <View style={{ height: hp(8), backgroundColor: Theme.SECONDARY_COLOR, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                        <Text style={{ flex: props.platform === 'ios' ? 0.8 : 0.9, color: Theme.WHITE_COLOR }}>Add Emergency Contact</Text>
                        <TouchableOpacity onPress={() => props.setModalVisible(false)} style={props.platform === 'ios' && {flex: 0.2, alignItems: 'center'}}>
                            <Ionicons name={'close-circle'} size={30} color={Theme.WHITE_COLOR} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 15, marginTop: 20 }}>

                        {/* Full Name */}
                        <InputWithIcon
                            placeholder={`Full Name`}
                            value={controls.name.value}
                            // inputText={{ fontSize: 17 }}
                            onChangeText={(val) => setValue('name', val)}
                            error={controls.name.error}
                        />

                        {/* relation */}
                        {/* <View style={{ marginBottom: 5 }}>
                            <View style={[styles.input, controls.relation.error && styles.inputErr]}>
                                <View style={{ flex: 1 }}>
                                    <Picker
                                        style={{ height: 50, width: "100%", color: Theme.BORDER_COLOR }}
                                        selectedValue={controls.relation.value}
                                        onValueChange={(val) => { setValue('relation', val) }}
                                        mode={'dropdown'}>
                                        <Picker.Item label="Relationship" value='' />
                                        {relationList.map(item => (
                                            <Picker.Item key={item} label={item} value={item} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            {controls.relation.error && <Text style={styles.text}>{controls.relation.error}</Text>}
                        </View> */}

                        {/* Contact Number */}
                        <MaskInputWithIcon
                            iconName={require('../../../assets/flag/flag.png')}
                            onChangeText={(val) => setValue('number', val)}
                            value={controls.number.value}
                            countryCode={countryCode}
                            placeholder={"XXX-XXXXXXX"}
                            mask={"[000]-[0000000]"}
                            keyboardType={"numeric"}
                            maxLength={10}
                            noBackgroundColor={true}
                            error={controls.number.error}
                        />
                        {/* <InputWithIcon
                            placeholder={`Contact Number`}
                            value={controls.number.value}
                            keyboardType={"numeric"}
                            onChangeText={(val) => setValue('number', val)}
                            error={controls.number.error}
                        /> */}
                    </View>
                    <View style={{ height: hp(8), justifyContent: "center", backgroundColor: Theme.WHITE_COLOR, elevation: 5 }}>
                        <View style={{ justifyContent: "center", alignItems: props.platform === 'android'?'center':null}}>
                            <Button onPress={() => { sendEmergencyContact() }} styleButton={{ width: "85%", alignSelf: props.platform === 'ios'?'center':null  }} >Done</Button>
                        </View>
                    </View>

                    {/* </View> */}
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: Theme.WHITE_COLOR
        // backgroundColor: "rgba(0,0,0,0.8)"
    },
    input: {
        // flexDirection: "row",
        borderBottomColor: Theme.BORDER_COLOR,
        borderBottomWidth: 1,
        height: 50,
        marginBottom: 2
    },

    inputErr: {
        borderBottomColor: Theme.RED_COLOR,
        borderBottomWidth: 2,
    },
    containerView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        marginTop: 30
        // marginTop: 22

    },
    content: {
        flex: 0.75,
        flexDirection: 'row',
        // justifyContent:'center',
    },
    buttonView: {
        flex: 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Theme.WHITE_COLOR,
        marginHorizontal: 60,
    }
});

const mapStateToProps = state => {
    return {
        platform: state.util.platform,
        // driverDetails: state.user.driverDetails,
    };
};


export default connect(mapStateToProps)(EmergencyContactModal);
