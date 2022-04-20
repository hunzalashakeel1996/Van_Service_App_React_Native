
import React, { Component } from 'react';
import {
    Alert, Image, Picker, ScrollView, StyleSheet, PermissionsAndroid, TouchableOpacity, View, BackHandler, Platform
} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { checkNumberExist, createUser, parentSignUp, passwordLogin, setJWT, uploadParentSingupImages } from '../../../store/actions/dataAction';
import validate from '../../utilities/validation';
import Header from '../Parent/Parent Profile/Header';
import InputWithIcon from "../../components/InputWithIcon"
import OutlineButton from "../../components/OutlineButton"
import Theme from "../../components/Theme"
import timeConverter from '../../components/timeConverter';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { TextInputMask } from 'react-native-text-input-mask';
import MaskInputWithIcon from './../../components/MaskInputWithIcon';
import HeaderText from "../../components/Header/HeaderText";
import RadioBox from '../../components/RadioBox';
import LocationMapModal from '../../components/LocationMapModal';
import Geolocation from 'react-native-geolocation-service';
import Loader from '../../components/Loader';
import TextWithStyle from '../../components/TextWithStyle';
import { setUserData } from './../../../store/actions/userAction';
import { StackActions, NavigationActions } from 'react-navigation'
import Toast from 'react-native-simple-toast';

class ParentSignUp extends Component {

    //DriverHeader is defined in another js file
    static navigationOptions = ({ navigation }) => HeaderText(navigation, "Create Your Account");

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            isFormValid: true,
            isLoading: false,
            currentLocation: true,
            parentControls: {
                name: {
                    value: '',
                    valid: false,
                    error: null,
                },
                email: {
                    value: '',
                    valid: true,
                    error: null,
                    validationRules: {
                        isEmail: true
                    }
                },
                address: {
                    value: '',
                    valid: false,
                    error: null,
                },
                location: {
                    value: {},
                    valid: true,
                    error: null,
                },
                emergencyNumber: {
                    value: '',
                    valid: true,
                    error: null,

                },
                image: {
                    value: "",
                    valid: true,
                },
                // referralCode: {
                //     value: ''
                // },
                gender: {
                    value: 'Male',
                    valid: true,
                },
                role: { value: 'P' },
                mobile_number: { value: props.route.params.data.number },
                password: { value: props.route.params.data.password }
                // mobile_number: 
                // { value: '03419876123' },
                // password:
                // { value: 'parent123' }
            },
        }
        this.errText = {
            email: "Please enter vaild email address",
            emergencyNumber: "Please enter valid phone number"
        }
        this.errReqText = {
            email: "Email is Required",
            emergencyNumber: "Emergency Number is Required",
            name: "Name is Required",
            address: "Address is required",
        }
    }

    componentDidMount = () => {
        this.checkStatus();
        this.data = this.props.route.params.data;
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    handleBackButtonClick = () => {
        console.log('aaaa')
        Alert.alert(
            'Exit App',
            'Are you sure to exit app?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }


    checkStatus = async () => {
        if (Platform.OS == 'ios') {
            this.getCurrentLocation();
        }
        else {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted) {
                this.getCurrentLocation();
            }
            else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.getCurrentLocation();
                    } else {
                        console.log('Camera permission denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        }
    }

    onMarkerDrag = (location) => {
        this.tempLocation = { ...location };
        // this.setState({ coordinate: { ...location } }, () => {
        // })
    }

    setLocation = () => {
        let controls = { ...this.state.parentControls }
        controls.location.value = this.tempLocation;
        this.setState({ parentControls: controls, currentLocation: false });
        // let address = `${this.state.coordinate.latitude},${this.state.coordinate.longitude}`;
        Toast.show('Location Changed Successfully', Toast.LONG);
        this.setModalVisible(false);
    }

    getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                let tempControls = { ...this.state.parentControls };
                let cord = Object.assign(position.coords, { latitudeDelta: 0.005, longitudeDelta: 0.005, });
                tempControls.location.value = cord;
                this.setState({
                    parentControls: tempControls,
                    currentLocation: true
                });
                console.log(position);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // when value of any input field change this method call
    onInputChange = (controls, key, value) => {
        let tempControls = { ...this.state[controls] };
        tempControls[key].value = key === 'emergencyNumber' ? `${value.split('-')[0]}${value.split('-')[1]}` : value;
        // tempControls[key].valid = validate(value.trim(), tempControls[key].validationRules);

        this.setState({ controls: tempControls });

        // this.setState({ controls: tempControls }, () => {
        //     if (this.state[controls][key].valid) {
        //         let controls = this.state.controls;
        //         controls[key].error = null;
        //         this.setState({ controls });
        //     }
        // });

    }

    onPageChange = (controls) => {
        let tempControls = { ...this.state[controls] };
        let keys = Object.keys(tempControls)
        keys.map((key, i) => {
            if (typeof tempControls[key].value == 'string') {
                //if value is not empty
                if (tempControls[key].value.trim() != "") {
                    if (key === 'emergencyNumber') {
                        let numChk = tempControls[key].value.trim() === this.state.parentControls.mobile_number.value;
                        let isValid = (numChk) ? false : validate(tempControls[key].value.trim(), tempControls[key].validationRules);
                        tempControls[key].valid = isValid;
                        tempControls[key].error = !isValid ? numChk ? "Emergency number should be different from signup number" : this.errText[key] : null;
                    } else {
                        let isValid = validate(tempControls[key].value.trim(), tempControls[key].validationRules);
                        tempControls[key].valid = isValid;
                        tempControls[key].error = !isValid ? this.errText[key] : null;
                    }

                } else {
                    //if value is empty

                    tempControls[key].valid = key === 'email' ? true : tempControls[key].valid;;
                    tempControls[key].error = !tempControls[key].valid ? this.errReqText[key] : null;
                }
            } else {
                let isValid = tempControls[key].value != null ? true : false;
                tempControls[key].valid = isValid;
                tempControls[key].error = !isValid ? this.errText[key] : null;
            }
            //set validation to check all keys are valid now
            keys[i] = tempControls[key].valid;
        })
        this.setState({ [controls]: tempControls });

        if (!keys.includes(false)) {
            console.warn("ok")
            return true;
            // this.props.navigation.navigate('ParentChildSignUp', { parentControls: this.state.parentControls, data: this.data })
        } else {
            return false;
        }
    }

    openCamera = (controls) => {
        let tempControls = { ...this.state[controls] };

        // More info on all the options is below in the API Reference... just some common use cases shown here
        Alert.alert(
            'Would you like to open Camera or select from Gallery',
            '',
            [
                {
                    text: 'Open Camera', onPress: () => {
                        ImagePicker.openCamera({
                            width: 500,
                            height: 600,
                            includeBase64: true,
                            cropping: true,
                        }).then(image => {
                            tempControls.image.value = { mime: image.mime, data: image.data, path: image.path }
                            this.setState({ [controls]: tempControls })
                        });
                    }
                },
                {
                    text: 'Open Gallery', onPress: () => {
                        ImagePicker.openPicker({
                            width: 500,
                            height: 600,
                            includeBase64: true,
                            cropping: true,
                        }).then(image => {
                            tempControls.image.value = { mime: image.mime, data: image.data, path: image.path }
                            this.setState({ [controls]: tempControls })
                        });
                    }
                },
            ],
            { cancelable: true },
        );
    }

    setModalVisible = (bool) => {
        this.setState({ modalVisible: bool });
    }

    parentSignupProcess = (data) => {
        console.warn(data)
        this.props.parentSignUp(data).then(res => {
            let data = this.props.route.params.data;

            // this.props.passwordLogin(data.number, data.password, data.token)
            this.props.passwordLogin(this.state.parentControls.mobile_number.value, this.state.parentControls.password.value, data.token)
                .then(token => {
                    if (token) {
                        jsonWebToken = token.token; //Json web token recieve
                        this.props.onSetJWT(jsonWebToken);
                        // save jwt in local storage
                        AsyncStorage.setItem('jwt', jsonWebToken);
                        let decodedJwt = jwtDecode(jsonWebToken)

                        this.props.onSetUserData(decodedJwt);

                        setTimeout(() => {
                            Toast.show(`Your account has been created successfully`, Toast.LONG);
                            this.setState({ isLoading: false });
                            this.props.navigation.navigate('HomeParentApp', { token: jsonWebToken });
                        }, 10)
                        // setTimeout(() => {this.props.navigation.navigate('Dashboard', { token: jsonWebToken });}, 10) 
                    }
                })
        })
    }

    onSignUp = () => {
        if (this.onPageChange('parentControls')) {
            this.setState({ isLoading: true })
            // console.warn(this.state.childControls)
            let parentPicture = this.state.parentControls.image.value;

            const formData = new FormData();
            if (parentPicture != "") {
                formData.append('parentPicture', {
                    name: `parentPicture${parentPicture.mime === "image/png" ? ".png" : ".jpg"}`,
                    type: parentPicture.mime,
                    uri:
                        Platform.OS === "android" ? parentPicture.path : parentPicture.path.replace("file://", "")
                })
                this.state.parentControls.image.value = this.state.parentControls.image.value != "" ? "true" : "";
            }
            let cord = this.state.parentControls.location.value;
            this.state.parentControls.location.value = `${cord.latitude},${cord.longitude}`

            // this.state.childs.map((child, index) => {
            //     if (child.image.value != "") {
            //         formData.append('childsPicture', {
            //             name: `childProfile${child.image.value.mime === "image/png" ? ".png" : ".jpg"}`,
            //             type: child.image.value.mime,
            //             uri:
            //                 Platform.OS === "android" ? child.image.value.path : child.image.value.path.replace("file://", "")
            //         })
            //         child.image.value = child.image.value != "" ? "true" : "";
            //     }
            // })

            // formData.append('data', JSON.stringify(data))
            // if parent uplaod any image of parent profile or child profile then save it to server else create account direct 
            if (formData._parts.length > 0) {
                this.props.uploadParentSingupImages(formData).then(values => {
                    let data = {
                        parent: this.state.parentControls,
                        // childs: this.state.childs,
                        parent_picture: values.parent_profile,
                        // childs_profile: values.childs_profile
                    }
                    this.parentSignupProcess(data)

                })
            }
            else {
                let data = {
                    parent: this.state.parentControls,
                    // childs: this.state.childs,
                }
                this.parentSignupProcess(data)
            }
        }
    }


    render() {
        const { parentControls, isLoading, currentLocation } = this.state;
        if (!isLoading) {
            return (
                <React.Fragment>
                    {/* opens location modal to set location */}
                    {this.state.modalVisible && (
                        <LocationMapModal
                            modalVisible={this.state.modalVisible}
                            setModalVisible={isVisible => this.setModalVisible(isVisible)}
                            coordinate={parentControls.location.value}
                            onMarkerDrag={loc => this.onMarkerDrag(loc)}
                            setLocation={() => this.setLocation()}
                        />
                    )}
                    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
                        <View>
                            <View style={{ marginTop: Platform.OS == 'ios' ? 40 : 20, marginHorizontal: 20 }}>
                                <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                                    <TextWithStyle style={styles.textContainer}>Enter Your Details</TextWithStyle>
                                </View>

                                <TouchableOpacity onPress={() => this.openCamera('parentControls')} style={{ alignSelf: 'center' }}>
                                    {parentControls.image.value === "" ?
                                        <Image style={{ width: 82, height: 80 }} source={require('../../../assets/icons/parent/parent_profile_icon.png')} />
                                        :
                                        <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: `data:${parentControls.image.value.mime};base64,${parentControls.image.value.data}` }} />}
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => this.openCamera('parentControls')} style={{ borderRadius: 50, backgroundColor: '#c4c4c4', alignSelf: 'center', marginBottom: 25 }}>
                                    {parentControls.image.value === "" ?
                                        <Ionicons name={'md-person'} size={40} style={{ paddingHorizontal: 25, paddingVertical: 20, }} />
                                        :
                                        <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: `data:${parentControls.image.value.mime};base64,${parentControls.image.value.data}` }} />}
                                </TouchableOpacity> */}

                                {/* name */}
                                <InputWithIcon
                                    iconName={require('../../../assets/icons/signup/user.png')}
                                    onChangeText={(val) => this.onInputChange('parentControls', 'name', val)}
                                    value={parentControls.name.value}
                                    // onFocus={this.onEmailFocusBlur}
                                    // onBlur={() => this.onBlur("email")}
                                    placeholder={"Full Name"}
                                    autoCapitalize={'words'}
                                    error={parentControls.name.error}
                                />

                                {/* gender */}
                                <View style={{ flexDirection: 'row', marginVertical: 15, }}>
                                    <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../assets/icons/signup/gender.png')} /></View>
                                    <View style={{ flex: 0.9, flexDirection: 'row', }}>
                                        <TextWithStyle> Gender</TextWithStyle>
                                        <RadioBox selected={parentControls.gender.value === 'Male'} text={'Male'} onPress={() => this.onInputChange('parentControls', "gender", 'Male')} />
                                        <RadioBox selected={parentControls.gender.value === 'Female'} text={'Female'} onPress={() => this.onInputChange('parentControls', "gender", 'Female')} />
                                    </View>
                                </View>

                                {/* address */}
                                <InputWithIcon
                                    iconName={require('../../../assets/icons/signup/home.png')}
                                    onChangeText={(val) => this.onInputChange('parentControls', 'address', val)}
                                    value={parentControls.address.value}
                                    // onFocus={this.onEmailFocusBlur}
                                    // onBlur={() => this.onBlur("email")}
                                    placeholder={"Home Address (For Driver)"}
                                    error={parentControls.address.error}
                                />
                                <View style={{ flexDirection: "row", marginBottom: 15, marginTop: 5, alignItems: 'center', }}>
                                    <View style={{ flex: 0.1 }}></View>
                                    <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../assets/icons/signup/locator.png')} /></View>
                                    <TextWithStyle style={{ flex: 0.45, color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM }} onPress={() => this.setModalVisible(true)}>{`Change Home Location`}</TextWithStyle>
                                    <View style={{ flex: 0.35 }}>
                                        {!currentLocation ? <Ionicons name={'md-checkmark-circle'} size={20} color={Theme.PRIMARY_COLOR} />
                                            : <TextWithStyle style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_SMALL }}>{`(Current Location)`}</TextWithStyle>}
                                        {/* <Image style={styles.icon} source={require('../../../assets/icons/signup/verified.png')} /> */}
                                    </View>
                                </View>

                                {/* email */}
                                <InputWithIcon
                                    iconName={require('../../../assets/icons/signup/email.png')}
                                    onChangeText={(val) => this.onInputChange('parentControls', 'email', val)}
                                    value={parentControls.email.value}
                                    // onFocus={this.onEmailFocusBlur}
                                    // onBlur={() => this.onBlur("email")}
                                    placeholder={"Email Address (Optional)"}
                                    error={parentControls.email.error}
                                />

                                {/* {emergencyNumber} */}
                                <MaskInputWithIcon
                                    iconName={require('../../../assets/icons/signup/mobile.png')}
                                    onChangeText={(val) => this.onInputChange('parentControls', 'emergencyNumber', val)}
                                    value={parentControls.emergencyNumber.value}
                                    // onFocus={this.onEmailFocusBlur}
                                    // onBlur={() => this.onBlur("email")}
                                    placeholder={"Emergency Mobile Number (Optional)"}
                                    mask={"[0000]-[0000000]"}
                                    keyboardType={"numeric"}
                                    maxLength={12}
                                    style={{color: 'black'}}
                                    error={parentControls.emergencyNumber.error}
                                />


                                {/* referral code */}
                                {/* <InputWithIcon
                                iconName={"md-person"}
                                onChangeText={(val) => this.onInputChange('parentControls' ,'referralCode', val)}
                                value={parentControls.referralCode.value}
                                // onFocus={this.onEmailFocusBlur}
                                // onBlur={() => this.onBlur("email")}
                                placeholder={"Enter Referral Code"}
                            /> */}




                            </View>
                        </View>

                        {/* <View style={{ marginTop: RF(9) }}>
                            <OutlineButton styleButton={{ width: "80%", }} onPress={() => this.onPageChange('parentControls')}>Next</OutlineButton>
                        </View> */}
                        <View style={[styles.button]}>
                            {/* <TouchableOpacity style={{ width: '50%' }} onPress={() => this.onPageChange('parentControls')}> */}
                            <TouchableOpacity style={{ width: '50%' }} onPress={this.onSignUp}>
                                <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                    {/* <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Save</TextWithStyle> */}
                                    {this.state.isloading ? <ActivityIndicator size={25} color="white" />
                                        : <TextWithStyle style={{ fontSize: 22, color: "white" }}>Sign Up</TextWithStyle>}
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={[styles.button, { paddingVertical: 10 }]}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={() => this.onPageChange('parentControls')}>
                                <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                    <TextWithStyle style={{ color: 'white', fontSize: RF(3) }}>Next</TextWithStyle>
                                </View>
                            </TouchableNativeFeedback>
                        </View> */}
                    </ScrollView>

                </React.Fragment >
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
    },

    textContainer: {
        fontSize: RF(2.8),
        fontFamily: "Lato-Regular"
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
        // marginBottom: 20
    },

    nextButton: {
        alignItems: 'center',
        padding: 10,
        width: '90%',
        // backgroundColor: "#143459",
        borderRadius: 8,
    },

    genderButton: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 10
    },

    typeButton: {
        width: '30%',
        backgroundColor: 'white',
        paddingVertical: 12,
        alignItems: 'center',
        borderColor: '#143459',
    },

    headerText: {
        fontSize: RF(3),
        fontFamily: 'Lato-Regular',
        fontWeight: 'bold',
        color: 'black'
    },
    text: {
        marginLeft: 35,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR
    },
    list: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        margin: 5,
        // flexDirection: "row",
        backgroundColor: "#eee",
        // justifyContent: "center",
        // alignItems: "flex-start",
        borderRadius: 15,
        zIndex: -1
    },
    icon: {
        width: 20,
        height: 20,
    }
})

const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (details) => dispatch(createUser(details)),
        checkNumberExist: (number) => dispatch(checkNumberExist(number)),
        parentSignUp: (data) => dispatch(parentSignUp(data)),
        passwordLogin: (number, password, token) => dispatch(passwordLogin(number, password, token)),
        onSetUserData: (data) => dispatch(setUserData(data)),
        onSetJWT: (jwt) => dispatch(setJWT(jwt)),
        uploadParentSingupImages: (formData) => dispatch(uploadParentSingupImages(formData)),
    }
}

export default connect(null, mapDispatchToProps)(ParentSignUp);
