import React, { Component } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Keyboard,
    PermissionsAndroid,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Linking,
    Modal,
    View,
    Platform
} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import TextInputMask from 'react-native-text-input-mask';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { login, sendSmsMessage } from '../../../store/actions/dataAction';
import { setRole } from '../../../store/actions/Map';
import TextWithStyle from '../../components/TextWithStyle';
import validate from '../../utilities/validation';
import NumberRegistered from '../../components/modals/NumberRegistered';
import Geolocation from 'react-native-geolocation-service';
import RNOtpVerify from 'react-native-otp-verify';

class LoginNew extends Component {

    static navigationOptions = {
        headerShown: false,
    };

    state = {
        isKeypadOpen: false,
        isFormValid: true,
        isNumberShow: false,
        isParentModal: false,
        controls: {
            number: {
                value: '',
                valid: false,
                validationRules: {
                    isRequired: true,
                    isNumber: true
                }
            },
        }
    }

    componentDidMount = async () => {
        try {
            
            
            if (Platform.OS === 'ios') {
                Geolocation.requestAuthorization("always")
                this.keyboardDidShowListener = Keyboard.addListener(
                    'keyboardDidShow',
                    () => { this.setState({ isKeypadOpen: true }) }
                );
                this.keyboardDidHideListener = Keyboard.addListener(
                    'keyboardDidHide',
                    () => { this.setState({ isKeypadOpen: false }) }
                );

            }
            else {
                this.hash = [''];
            this.getHash();
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                console.log('as', granted)
                this.keyboardDidShowListener = Keyboard.addListener(
                    'keyboardDidShow',
                    () => { this.setState({ isKeypadOpen: true }) }
                );
                this.keyboardDidHideListener = Keyboard.addListener(
                    'keyboardDidHide',
                    () => { this.setState({ isKeypadOpen: false }) }
                );
            }


            // let result = [];
            // let vehicles = [{ "aircon": "Yes", "car_image1": "/uploads/car_images/Ashraf car 1.jpg", "car_image2": "/uploads/car_images/Ashraf car 2.jpg", "car_image3": "/uploads/car_images/Ashraf car 3.jpg", "car_image4": "/uploads/car_images/Ashraf car 4.jpg", "car_image5": "/uploads/car_images/Ashraf car 5.jpg", "car_image6": "/uploads/car_images/Ashraf car 6.jpg", "car_image7": "/uploads/car_images/Ashraf car 7.jpg", "car_image8": "/uploads/car_images/Ashraf car 8.jpg", "child_seat": "No", "color": "White", "driver_id": 32, "id": 1, "make": "Honda", "model": "City", "name": "Honda City 1.8 i-VTEC", "no_of_seats": 5, "opt_1": null, "opt_1_val": null, "opt_2": null, "opt_2_val": null, "opt_3": null, "opt_3_val": null, "opt_4": null, "opt_4_val": null, "opt_5": null, "opt_5_val": null, "opt_6": null, "opt_6_val": null, "opt_7": null, "opt_7_val": null, "opt_8": null, "opt_8_val": null, "registration_number": "ABF-854", "transmission": "Automatic", "type": "Sedan", "variant": "1.3 i-VTEC ", "year": "2019" },
            // { "aircon": "Yes", "car_image1": "/uploads/car_images/Ashraf car 1.jpg", "car_image2": "/uploads/car_images/Ashraf car 2.jpg", "car_image3": "/uploads/car_images/Ashraf car 3.jpg", "car_image4": "/uploads/car_images/Ashraf car 4.jpg", "car_image5": "/uploads/car_images/Ashraf car 5.jpg", "car_image6": "/uploads/car_images/Ashraf car 6.jpg", "car_image7": "/uploads/car_images/Ashraf car 7.jpg", "car_image8": "/uploads/car_images/Ashraf car 8.jpg", "child_seat": "No", "color": "White", "driver_id": 32, "id": 2, "make": "Honda", "model": "City", "name": "Honda City 1.8 i-VTEC", "no_of_seats": 5, "opt_1": null, "opt_1_val": null, "opt_2": null, "opt_2_val": null, "opt_3": null, "opt_3_val": null, "opt_4": null, "opt_4_val": null, "opt_5": null, "opt_5_val": null, "opt_6": null, "opt_6_val": null, "opt_7": null, "opt_7_val": null, "opt_8": null, "opt_8_val": null, "registration_number": "ABF-854", "transmission": "Automatic", "type": "Toyota", "variant": "1.3 i-VTEC ", "year": "2019" },
            // { "aircon": "Yes", "car_image1": "/uploads/car_images/Ashraf car 1.jpg", "car_image2": "/uploads/car_images/Ashraf car 2.jpg", "car_image3": "/uploads/car_images/Ashraf car 3.jpg", "car_image4": "/uploads/car_images/Ashraf car 4.jpg", "car_image5": "/uploads/car_images/Ashraf car 5.jpg", "car_image6": "/uploads/car_images/Ashraf car 6.jpg", "car_image7": "/uploads/car_images/Ashraf car 7.jpg", "car_image8": "/uploads/car_images/Ashraf car 8.jpg", "child_seat": "No", "color": "White", "driver_id": 32, "id": 3, "make": "Honda", "model": "City", "name": "Honda City 1.8 i-VTEC", "no_of_seats": 5, "opt_1": null, "opt_1_val": null, "opt_2": null, "opt_2_val": null, "opt_3": null, "opt_3_val": null, "opt_4": null, "opt_4_val": null, "opt_5": null, "opt_5_val": null, "opt_6": null, "opt_6_val": null, "opt_7": null, "opt_7_val": null, "opt_8": null, "opt_8_val": null, "registration_number": "ABF-854", "transmission": "Automatic", "type": "Sedan", "variant": "1.3 i-VTEC ", "year": "2019" }, { "aircon": "Yes", "car_image1": "/uploads/car_images/Ashraf car 1.jpg", "car_image2": "/uploads/car_images/Ashraf car 2.jpg", "car_image3": "/uploads/car_images/Ashraf car 3.jpg", "car_image4": "/uploads/car_images/Ashraf car 4.jpg", "car_image5": "/uploads/car_images/Ashraf car 5.jpg", "car_image6": "/uploads/car_images/Ashraf car 6.jpg", "car_image7": "/uploads/car_images/Ashraf car 7.jpg", "car_image8": "/uploads/car_images/Ashraf car 8.jpg", "child_seat": "No", "color": "White", "driver_id": 32, "id": 1, "make": "Honda", "model": "City", "name": "Honda City 1.8 i-VTEC", "no_of_seats": 5, "opt_1": null, "opt_1_val": null, "opt_2": null, "opt_2_val": null, "opt_3": null, "opt_3_val": null, "opt_4": null, "opt_4_val": null, "opt_5": null, "opt_5_val": null, "opt_6": null, "opt_6_val": null, "opt_7": null, "opt_7_val": null, "opt_8": null, "opt_8_val": null, "registration_number": "ABF-854", "transmission": "Automatic", "type": "Sedan", "variant": "1.3 i-VTEC ", "year": "2019" }
            // ]

            // vehicles.map(vehicle => {
            //   result[`${vehicle.type}${vehicle.id}`] = vehicle
            // })
            // console.warn(result)
        } catch (err) {
            console.warn(err);
        }
    }

    getHash = () => {
        RNOtpVerify.getHash()
            .then(key => {
                console.log(key);
                this.hash = key;
            })
            .catch(console.log);
        }

    componentWillUnmount() {
        console.log('asjhaskjas')
        if (this.keyboardDidShowListener)
            this.keyboardDidShowListener.remove();
        if (this.keyboardDidHideListener)
            this.keyboardDidHideListener.remove();
    }

    // use to check if a input field is valid or not, key as 'email' or 'password' and value is value of that field 
    onInputChange = (key, value) => {
        let temp = { ...this.state.controls }
        let isValid = true;
        if (value.length === 12) {
            temp[key].value = `${value.split('-')[0]}${value.split('-')[1]}`
            temp[key].valid = validate(temp[key].value, temp[key].validationRules)
            isValid = temp[key].valid;
        } else {
            temp[key].value = value;
            temp[key].valid = validate(temp[key].value, temp[key].validationRules)
        }
        this.setState({ controls: temp, isFormValid: isValid })
    }

    onLogin = async () => {
        if (this.state.controls.number.valid === false)
            this.setState({ isFormValid: false })

        this.props.login(this.state.controls.number.value, this.hash)
            .then(res => {
                let response = res
                if (response.error)
                    Alert.alert('Sorry', response.error)
                else if (response['isPassword'] === false) {
                    let data = {
                        msg: `Your OPT code for VanWala is ${response.code}`,
                        number: response.number.replace(/^(0+)/g, '92'),
                    }
                    // this.props.sendSmsMessage(data).then((res) => {
                    //navigate to verification code
                    this.props.navigation.navigate('Verification', { id: response['id'], number: data.number })
                    // })
                }
                else {
                    // navigate to password page
                    if (response.role !== 'P' && response.role !== 'A')
                        this.setState({ isParentModal: true })
                    else
                        this.props.navigation.navigate('Password', { user_id: response.user_id, number: this.state.controls.number.value })
                }
            })
    }

    render() {
        let { isKeypadOpen, isFormValid, isParentModal, controls } = this.state

        let login = <TextWithStyle style={{ color: 'white', fontFamily: 'Lato-Regular', fontSize: RF(2.5) }}>
            <Ionicons name="arrow-forward-outline" size={24} color="white" />
        </TextWithStyle>;

        if (this.props.isLoading) {
            login = <ActivityIndicator color="#fff" style={{ paddingVertical: 9 }} />
        }

        return (
            <View style={{ flex: 1, backgroundColor: '#143459', alignItems: 'center' }}>
                <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../../../assets/icons/Home-page-logo.png')}
                        style={{ width: 150, height: 150, }}
                    />
                </View>

                <View style={[styles.signinContainer, { flex: isKeypadOpen === true ? 1 : 0.4 }]}>

                    <View style={{ flex: 0.2, marginBottom: 20 }}>
                        <TextWithStyle style={{ marginTop: 20, color: '#143459', fontSize: RF(3), fontFamily: 'Lato-Regular', alignSelf: 'center' }}>{`Safer & Smarter Commute`} </TextWithStyle>
                        {/* <TextWithStyle style={{ color: '#143459', fontSize: RF(2.5), fontFamily: 'Lato-Regular', alignSelf: 'center', fontStyle: 'italic' }}>For Your Child</TextWithStyle> */}
                    </View>

                    <View style={{ width: '100%', flex: Platform.OS === 'ios' ? 0.1 : 0.4, justifyContent: 'center', marginBottom: Platform.OS === 'ios' ? 20 : 0 }}>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: '#143459', flexDirection: 'row', borderRadius: 10, paddingVertical: 2 }}>
                            <Image
                                source={require('../../../assets/icons/pakistan.png')}
                                style={[styles.codeText, { width: 30, height: 30, }]}
                            />
                            {/* <TextWithStyle style={styles.codeText}>+92 </TextWithStyle> */}
                            <TextInputMask style={{ width: '80%', fontSize: RF(3), color: 'black' }}
                                onFocus={() => { this.setState({ isNumberShow: false }) }}
                                onBlur={() => { this.setState({ isNumberShow: true }) }}
                                onChangeText={(val) => this.onInputChange('number', val)}
                                value={controls.number.value}
                                underlineColorAndroid={'white'}
                                placeholder="03XX-XXXXXXX"
                                placeholderTextColor='grey'
                                mask={"[0000]-[0000000]"}
                                keyboardType={"numeric"}
                                maxLength={12} />
                        </View>

                        {(controls.number.valid === false && isFormValid === false) ?
                            <TextWithStyle style={{ color: 'red', marginLeft: 30, }}>Please Enter Correct Phone Number</TextWithStyle> : null
                        }
                    </View>

                    {/* login button view */}
                    <View style={[styles.button]}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={!this.props.isLoading ? this.onLogin : this.onPress} activeOpacity={.5} disabled={!(controls.number.valid)}>
                            <View style={[styles.loginButton, { backgroundColor: !(controls.number.valid) ? "rgba(20, 52, 89,.6)" : "rgba(20, 52, 89,1)" }]}>
                                {login}
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                </View>


                {isParentModal &&
                    <NumberRegistered
                        isParentModal={isParentModal}
                        setModalVisible={() => { this.setState({ isParentModal: false }) }} />
                }
            </View>
        );
    }
}
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    header: {
        flex: 0.1,
        backgroundColor: '#143459',
    },

    fields: {
        marginTop: 60,
        flex: 0.7,
        margin: 20
    },

    message: {
        marginTop: 5,
        flexDirection: 'column',
    },

    button: {
        flex: 0.2,
        alignItems: 'center',
        width: '100%'
    },

    loginButton: {
        width: RF(8),
        height: RF(8),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
    },

    textContainer: {
        marginLeft: 10,
        color: 'black',
        fontSize: RF(2.5),
        fontFamily: 'Lato-Regular'
    },

    signinContainer: {
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 20
    },

    codeText: {
        alignSelf: 'center',
        marginLeft: 30,
        // fontSize: RF(3.1),
        // fontWeight: '600',
        // color: 'black',
        marginRight: 5
    },
})

const mapStateToProps = (state) => {
    return {
        isLoading: state.ui.isLoading,
        role: state.map.role
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (number, hash) => dispatch(login(number, hash)),
        sendSmsMessage: (data) => dispatch(sendSmsMessage(data)),
        setRole: (role) => dispatch(setRole(role)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginNew);