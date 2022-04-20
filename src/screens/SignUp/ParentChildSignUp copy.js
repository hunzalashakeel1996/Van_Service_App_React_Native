import React, { Component } from 'react';
import {
    Alert, Image, Picker, ScrollView, StyleSheet, Text, TextInput, TimePickerAndroid, TouchableNativeFeedback, TouchableOpacity, View, DatePickerAndroid
} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { checkNumberExist, createUser, parentSignUp, passwordLogin } from '../../../store/actions/dataAction';
import validate from '../../utilities/validation';
import Header from '../Parent/Parent Profile/Header';
import InputWithIcon from "../../components/InputWithIcon"
import OutlineButton from "../../components/OutlineButton"
import Theme from "../../components/Theme"
import timeConverter from '../../components/timeConverter';
import ImagePicker from 'react-native-image-crop-picker';
import { setUserData, setDriverId } from '../../../store/actions/Map';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { TextInputMask } from 'react-native-text-input-mask';
import MaskInputWithIcon from './../../components/MaskInputWithIcon';
import HeaderWithText from "../../components/Header/HeaderWithText";
import RadioBox from '../../components/RadioBox';
import IconWithBg from "../../components/IconWithBg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

class ParentChildSignUp extends Component {

    //DriverHeader is defined in another js file
    static navigationOptions = ({ navigation }) => HeaderWithText(navigation, "Add Your Child Info", true);

    constructor(props) {
        super(props);

        this.state = {
            isFormValid: true,
            childs: [
                {
                    name: {
                        value: 'Arsalan Bhatty',
                        valid: false,
                        error: null,
                    },
                    dob: {
                        value: '2009-01-01',
                        valid: false,
                        error: null,
                    },
                    gender: {
                        value: 'Male',
                    },
                    image: {
                        value: '',
                        valid: true,
                    },
                    trips: {
                        value: [{
                            title: {
                                value: 'School',
                                valid: false,
                                error: null,
                            },
                            name: {
                                value: 'Meritorious School System',
                                valid: false,
                                error: null,
                            },
                            branch: {
                                value: 'Johar Branch',
                                valid: false,
                                error: null,
                            },
                            class: {
                                value: 'af',
                                valid: false,
                                error: null,
                            },
                            startTime: {
                                value: 'fdaf',
                                valid: false,
                                error: null,
                            },
                            endTime: {
                                value: 'fdaf',
                                valid: false,
                                error: null,
                            },

                        }],
                        valid: false,
                    },
                }],
            childShow: false,
            currentChild: 0,
            isLoading: false,
            parentControls: props.navigation.getParam('parentControls'),
            childControls: {
                name: {
                    value: '',
                    valid: false,
                    error: null,
                },
                dob: {
                    value: '',
                    valid: false,
                    error: null,
                },
                gender: {
                    value: 'Male',
                },
                image: {
                    value: '',
                    valid: true,
                },
                trips: {
                    value: [],
                    valid: false,
                },
            },
        }
        this.errText = {
            email: "Please enter vaild email address",
            emergencyNumber: "Please enter valid phone number"
        }
    }

    componentDidMount = () => {
        // this.props.navigation.setParams({ page: 2 });
        this.addTrip(true);
    }

    // onNavigateStartPage = () => {

    //     this.setState({ page: --this.state.page })
    // }

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

    clearChildControls = () => {
        let childControls = {
            name: {
                value: '',
                valid: false,
                error: null,
            },
            dob: {
                value: '',
                valid: false,
                error: null,
            },
            gender: {
                value: 'Male',
            },
            image: {
                value: '',
                valid: true,
            },
            trips: {
                value: [],
                valid: false,
            },
        };

        this.setState({ childControls });
        this.addTrip(true);
    }

    onTripInputChange = (controls, key, value, index) => {
        let tempControls = { ...this.state[controls] };

        tempControls.trips.value[index][key].value = value;
        // tempControls[key].valid = validate(value.trim(), tempControls[key].validationRules);
        // console.warn(tempControls.trips.value[1])
        // console.warn(trip)

        this.setState({ controls: tempControls });

        // this.setState({ controls: tempControls }, () => {
        //     if (this.state[controls][key].valid) {
        //         let controls = this.state.controls;
        //         controls[key].error = null;
        //         this.setState({ controls });
        //     }
        // });

    }

    // when user press on add trip button
    addTrip = (isFirst = false) => {
        let trip = {
            title: {
                value: 'School',
                valid: false,
                error: null,
            },
            name: {
                value: '',
                valid: false,
                error: null,
            },
            branch: {
                value: '',
                valid: false,
                error: null,
            },
            class: {
                value: '',
                valid: false,
                error: null,
            },
            startTime: {
                value: '',
                valid: false,
                error: null,
            },
            endTime: {
                value: '',
                valid: false,
                error: null,
            },

        };

        if (isFirst) {
            let tempControls = { ...this.state.childControls };
            tempControls.trips.value.push(trip);
            this.setState({ childControls: tempControls })
        } else {
            this.validateChild().then(data => {
                console.warn(data.childKeys)
                if (!data.childKeys.includes(false)) {
                    console.warn("ok")
                    let tempControls = { ...this.state.childControls };
                    tempControls.trips.value.push(trip);
                    this.setState({ childControls: tempControls })
                }
            })

        }

    }

    removeTrip = (index) => {
        let tempControls = { ...this.state.childControls };
        tempControls.trips.value.splice(index, 1);
        this.setState({ childControls: tempControls })
    }

    // Capitalize(str) {
    //     return str.charAt(0).toUpperCase() + str.slice(1);
    // }

    validateChild = () => {
        return new Promise((resolve, reject) => {
            let tempControls = { ...this.state.childControls };
            let keys = Object.keys(tempControls)
            // console.warn(keys)
            let tripsValidate = [];
            keys.map((key, i) => {

                if (key != 'trips') {
                    //if value is not empty
                    if (tempControls[key].value.trim() != "") {
                        if (key != 'image') {
                            let isValid = validate(tempControls[key].value.trim(), tempControls[key].validationRules);
                            tempControls[key].valid = isValid;
                            tempControls[key].error = !isValid ? this.errText[key] : null;
                        }

                    } else {
                        //if value is empty
                        tempControls[key].error = !tempControls[key].valid ? `${key} is required` : null;
                    }
                    //set validation to check all keys are valid now
                    keys[i] = tempControls[key].valid;
                } else {
                    tempControls[key].value.map(trip => {
                        let tripKeys = Object.keys(trip)
                        // console.warn(tripKeys)
                        tripKeys.map((tripKey, i) => {
                            if (trip[tripKey].value.trim() != "") {
                                let isValid = validate(trip[tripKey].value.trim(), trip[tripKey].validationRules);
                                trip[tripKey].valid = isValid;
                                trip[tripKey].error = !isValid ? this.errText[key] : null;
                            } else {
                                //if value is empty
                                trip[tripKey].error = !trip[tripKey].valid ? `${tripKey} is required` : null;
                            }
                            //set validation to check all keys are valid now
                            tripKeys[i] = trip[tripKey].valid;
                        })

                        if (!tripKeys.includes(false)) {
                            tripsValidate.push(true)
                        } else {
                            tripsValidate.push(false)
                        }

                    })

                    keys[i] = !tripsValidate.includes(false) ? true : false;

                }
            })
            this.setState({ childControls: tempControls });
            resolve({ childKeys: keys });
        })

    }

    editChild = (child) => {
       

    }

    // when sign up button pressed
    onSignUp = () => {
        this.setState({ isLoading: true })

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

        this.state.childs.map((child, index) => {
            if (child.image.value != "") {
                formData.append('childsPicture', {
                    name: `childProfile${child.image.value.mime === "image/png" ? ".png" : ".jpg"}`,
                    type: child.image.value.mime,
                    uri:
                        Platform.OS === "android" ? child.image.value.path : child.image.value.path.replace("file://", "")
                })
                child.image.value = child.image.value != "" ? "true" : "";
            }
        })

        let data = {
            parent: this.state.parentControls,
            childs: this.state.childs,
        }

        formData.append('data', JSON.stringify(data))

        console.warn(formData)
        this.validateChild().then(data => {
            console.warn(data.childKeys)
        });

        this.props.parentSignUp(formData).then(res => {
            console.warn(res)
            // let data = this.props.navigation.getParam('data');

            this.props.passwordLogin(data.number, data.password, data.token)
                .then(token => {
                    this.setState({ isLoading: false })
                    if (token.status === 200 && token._bodyInit) {
                        jsonWebToken = token._bodyInit.token; //Json web token recieve
                        // save jwt in local storage
                        AsyncStorage.setItem('jwt', jsonWebToken);
                        let decodedJwt = jwtDecode(jsonWebToken)

                        this.props.onSetUserData(decodedJwt);

                        this.props.navigation.navigate('LocationMap', { token: jsonWebToken });
                    }
                })
        })
    }

    openTimingClock = async (timeControl, tripIndex) => {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                this.onTripInputChange('childControls', timeControl, `${hour > 10 ? hour : "0" + hour}:${minute > 10 ? minute : "0" + minute}:00`, tripIndex)
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }

    openDate = async () => {
        try {
            let currentDate = new Date()
            // open date picker to select starting date
            let { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(currentDate.getFullYear() - 2, 0, 1),
                maxDate: new Date(currentDate.getFullYear() - 2, 11, 31),
                mode: 'spinner'
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                month++;
                this.onInputChange('childControls', 'dob', `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`)
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }

    // when user press on add child button
    onSaveChild = () => {
        this.validateChild().then(data => {
            console.warn(data.childKeys)
            if (!data.childKeys.includes(false)) {
                console.warn("ok")
                let childs = [...this.state.childs];
                childs.push(this.state.childControls);
                this.setState({ childs, childShow: false })
                this.clearChildControls();
            }
        })
    }

    // when user press on add child button
    onAddChild = () => {
        this.setState({ childShow: true })
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

    formatDate = (date) => {
        let dob = date.split('-');
        let month = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return `${dob[2]}-${month[parseInt(dob[1]) - 1]}- ${dob[0]}`
    }


    render() {
        const { isLoading, childControls, childs, childShow } = this.state;
        if (!isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ flex: 1 }}>
                            {/* form to add childs and their trips */}
                            {childShow && <View style={{ marginHorizontal: 10 }}>
                                <View>
                                    {/* Child information */}
                                    <View style={{ marginVertical: 10, }}>
                                        <Text style={{ flex: 1, textAlign: "center" }}>Basic Information</Text>
                                        {childs.length > 0 && <Ionicons name="md-close-circle" size={25} style={{ position: 'absolute', alignSelf: 'flex-end' }} onPress={() => this.setState({ childShow: false })} />}
                                    </View>
                                    <View>

                                        <View style={{ paddingBottom: 5, justifyContent: "center", alignItems: "center" }}>
                                            {/* child image */}
                                            <View style={{ flex: 1 }}>
                                                <TouchableOpacity onPress={() => this.openCamera('childControls')} style={{ alignSelf: 'center' }}>
                                                    {childControls.image.value === "" ?
                                                        <Image style={{ width: 80, height: 80 }} source={require('../../../assets/icons/signup/profile.png')} />
                                                        :
                                                        <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: `data:${childControls.image.value.mime};base64,${childControls.image.value.data}` }} />}
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity onPress={() => this.openCamera('childControls')} style={{ borderRadius: 50, backgroundColor: '#c4c4c4', alignSelf: 'flex-start' }}>
                                                    {childControls.image.value === "" ?
                                                        <Ionicons name={'md-person'} size={40} style={{ paddingHorizontal: 25, paddingVertical: 20, }} />
                                                        :
                                                        <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: `data:${childControls.image.value.mime};base64,${childControls.image.value.data}` }} />}
                                                </TouchableOpacity> */}
                                            </View>
                                            <View style={{ flex: 1, width: '100%', marginTop: 10 }}>
                                                {/* child name field */}
                                                <InputWithIcon
                                                    iconName={require('../../../assets/icons/signup/user.png')}
                                                    onChangeText={(val) => this.onInputChange('childControls', 'name', val)}
                                                    value={childControls.name.value}
                                                    // onFocus={this.onEmailFocusBlur}
                                                    // onBlur={() => this.onBlur("email")}
                                                    placeholder={"Enter Child Name"}
                                                    error={childControls.name.error}
                                                />

                                                {/* child dob field */}
                                                <View style={{ marginVertical: 10, flexDirection: 'row', borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, }}>
                                                    <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../assets/icons/signup/cake.png')} /></View>
                                                    <TouchableOpacity style={{ flex: 0.9, }} onPress={() => this.openDate()}>
                                                        <Text style={{ marginBottom: 5, fontSize: Theme.FONT_SIZE_MEDIUM }}>{childControls.dob.value ? this.formatDate(childControls.dob.value) : 'Enter Date of Birth'}</Text>
                                                    </TouchableOpacity>
                                                    {childControls.dob.error && <Text style={styles.text}>{childControls.dob.error}</Text>}
                                                </View>
                                            </View>
                                        </View>

                                        {/* gender */}
                                        {/* gender */}
                                        <View style={{ flexDirection: 'row', marginVertical: 5, }}>
                                            <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../assets/icons/signup/gender.png')} /></View>
                                            <View style={{ flex: 0.9, flexDirection: 'row', }}>
                                                <Text> Gender</Text>
                                                <RadioBox selected={childControls.gender.value === 'Male'} text={'Male'} onPress={() => this.onInputChange('childControls', "gender", 'Male')} />
                                                <RadioBox selected={childControls.gender.value === 'Female'} text={'Female'} onPress={() => this.onInputChange('childControls', "gender", 'Female')} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    {/* shift information for each child */}
                                    <View style={{ marginTop: 20, marginBottom: 5 }}>
                                        {/* <Text style={{  }}>Trip Information</Text> */}
                                    </View>

                                    {/* iterate over number of trips for each child */}
                                    {childControls.trips.value.map((trip, tripIndex) => (
                                        <View key={{ tripIndex }} style={{ backgroundColor: "#f5f5f5", paddingHorizontal: 8, borderRadius: 5, paddingBottom: 10 }}>
                                            {/* trip number header */}
                                            <View style={{ justifyContent: 'center', marginTop: 10, marginBottom: 10, flexDirection: "row" }}>
                                                {/* <TouchableOpacity > */}
                                                {/* <Text style={{ flex: 0.9, color: '#143459', fontSize: RF(2.2),  }}>{`${trip.title.value} Trip`}</Text> */}
                                                <View style={{ flex: 0.9, color: '#143459', fontWeight: 'bold', alignItems: "center" }}>
                                                    <Picker
                                                        style={{ height: 30, width: "60%", color: Theme.PRIMARY_COLOR, styleAttr: 'Large' }}
                                                        selectedValue={trip.title.value}
                                                        onValueChange={(val) => this.onTripInputChange('childControls', 'title', val, tripIndex)}
                                                        mode={'dropdown'}>
                                                        {/* <Picker.Item label="Select Title" value='' /> */}
                                                        <Picker.Item label="School Trip" value="School" />
                                                        <Picker.Item label="College Trip" value="College" />
                                                        <Picker.Item label="Coaching Trip" value="Coaching" />
                                                        <Picker.Item label="University Trip" value="University" />
                                                    </Picker>
                                                </View>
                                                {/* <Text style={{ flex: 0.9, color: '#143459', fontSize: RF(2.2), fontWeight: 'bold', textAlign: "center" }}>{`Trip # ${tripIndex + 1}`}</Text> */}
                                                {/* </TouchableOpacity> */}
                                                {tripIndex != 0 && <Ionicons name="md-close-circle" size={25} style={{ flex: 0.1 }} onPress={() => this.removeTrip(tripIndex)} />}
                                            </View>

                                            {<View>

                                                <View pointerEvents={trip.title.value != 'School' ? 'none' : 'auto'} style={trip.title.value != 'School' ? { backgroundColor: '#000', opacity: 0.2, borderRadius: 10 } : null}>
                                                    {/* school name field */}
                                                    <View style={{ marginBottom: 10 }}>
                                                        <View style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1 }}>
                                                            <Picker
                                                                style={{ height: 30 }}
                                                                selectedValue={trip.name.value}
                                                                onValueChange={(val) => this.onTripInputChange('childControls', 'name', val, tripIndex)}
                                                                mode={'dropdown'}>
                                                                <Picker.Item label={`${trip.title.value} Name`} value='' />
                                                                <Picker.Item label="Nursery" value="nursery" />
                                                                <Picker.Item label="KG 1" value="kg1" />
                                                                <Picker.Item label="KG 2" value="kg2" />
                                                                <Picker.Item label="1" value="1" />
                                                                <Picker.Item label="2" value="2" />
                                                                <Picker.Item label="3" value="3" />
                                                                <Picker.Item label="4" value="4" />
                                                                <Picker.Item label="5" value="5" />
                                                                <Picker.Item label="6" value="6" />
                                                                <Picker.Item label="7" value="7" />
                                                                <Picker.Item label="8" value="8" />
                                                                <Picker.Item label="9" value="9" />
                                                                <Picker.Item label="10" value="10" />
                                                            </Picker>
                                                        </View>
                                                        {trip.name.error && <Text style={styles.text}>{trip.name.error}</Text>}

                                                    </View>
                                                    {/* <InputWithIcon
                                                iconName={"md-calendar"}
                                                iconColor={'#143459'}
                                                onChangeText={(val) => this.onTripInputChange('childControls', 'name', val, tripIndex)}
                                                value={trip.name.value}
                                                // onFocus={this.onEmailFocusBlur}
                                                // onBlur={() => this.onBlur("email")}
                                                placeholder={"Enter School Name"}
                                                error={trip.name.error}
                                            /> */}

                                                    {/* school branch field */}
                                                    <View style={{ marginBottom: 10 }}>
                                                        <View style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1 }}>
                                                            <Picker
                                                                style={{ height: 30 }}
                                                                selectedValue={trip.branch.value}
                                                                onValueChange={(val) => this.onTripInputChange('childControls', 'branch', val, tripIndex)}
                                                                mode={'dropdown'}>
                                                                <Picker.Item label={`${trip.title.value} Branch Name`} value='' />
                                                                <Picker.Item label="Nursery" value="nursery" />
                                                                <Picker.Item label="KG 1" value="kg1" />
                                                                <Picker.Item label="KG 2" value="kg2" />
                                                                <Picker.Item label="1" value="1" />
                                                                <Picker.Item label="2" value="2" />
                                                                <Picker.Item label="3" value="3" />
                                                                <Picker.Item label="4" value="4" />
                                                                <Picker.Item label="5" value="5" />
                                                                <Picker.Item label="6" value="6" />
                                                                <Picker.Item label="7" value="7" />
                                                                <Picker.Item label="8" value="8" />
                                                                <Picker.Item label="9" value="9" />
                                                                <Picker.Item label="10" value="10" />
                                                            </Picker>
                                                        </View>
                                                        {trip.branch.error && <Text style={styles.text}>{trip.branch.error}</Text>}

                                                    </View>
                                                    {/* <InputWithIcon
                                                iconName={"md-calendar"}
                                                iconColor={'#143459'}
                                                onChangeText={(val) => this.onTripInputChange('childControls', 'branch', val, tripIndex)}
                                                value={trip.branch.value}
                                                // onFocus={this.onEmailFocusBlur}
                                                // onBlur={() => this.onBlur("email")}
                                                placeholder={"Enter School branch (campus,city,country)"}
                                                error={trip.branch.error}
                                            /> */}

                                                    {/* school class field  */}
                                                    <View style={{ marginBottom: 10 }}>
                                                        <View style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1 }}>
                                                            <Picker
                                                                style={{ height: 30 }}
                                                                selectedValue={trip.class.value}
                                                                onValueChange={(val) => this.onTripInputChange('childControls', 'class', val, tripIndex)}
                                                                mode={'dropdown'}>
                                                                <Picker.Item label="Select Class/Grade" value='' />
                                                                <Picker.Item label="Nursery" value="nursery" />
                                                                <Picker.Item label="KG 1" value="kg1" />
                                                                <Picker.Item label="KG 2" value="kg2" />
                                                                <Picker.Item label="1" value="1" />
                                                                <Picker.Item label="2" value="2" />
                                                                <Picker.Item label="3" value="3" />
                                                                <Picker.Item label="4" value="4" />
                                                                <Picker.Item label="5" value="5" />
                                                                <Picker.Item label="6" value="6" />
                                                                <Picker.Item label="7" value="7" />
                                                                <Picker.Item label="8" value="8" />
                                                                <Picker.Item label="9" value="9" />
                                                                <Picker.Item label="10" value="10" />
                                                            </Picker>
                                                        </View>
                                                        {trip.class.error && <Text style={styles.text}>{trip.class.error}</Text>}

                                                    </View>

                                                    {/* start time and off time field */}
                                                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10, marginHorizontal: 5, flex: 1, justifyContent: 'space-between' }}>
                                                        <View style={{ flex: 0.45 }}>
                                                            <TouchableOpacity style={{}} onPress={() => this.openTimingClock('startTime', tripIndex)}>
                                                                <Text style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.startTime.value ? `Start Time: ${timeConverter(trip.startTime.value)}` : `${trip.title.value} Starts At`}</Text>
                                                            </TouchableOpacity>
                                                            {trip.startTime.error && <Text style={styles.text}>{trip.startTime.error}</Text>}
                                                        </View>
                                                        <View style={{ flex: 0.45 }}>
                                                            <TouchableOpacity style={{}} onPress={() => this.openTimingClock('endTime', tripIndex)}>
                                                                <Text style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.endTime.value ? `End Time: ${timeConverter(trip.endTime.value)}` : `${trip.title.value} Ends At`}</Text>
                                                            </TouchableOpacity>
                                                            {trip.endTime.error && <Text style={styles.text}>{trip.endTime.error}</Text>}
                                                        </View>
                                                    </View>
                                                </View>
                                                {trip.title.value != 'School' && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: "rgba(255,255,255,1)", }}>Coming Soon</Text>
                                                </View>}
                                            </View>}

                                        </View>
                                    ))}
                                </View>

                                <View style={{ marginTop: 20, marginBottom: 10, flexDirection: "row", flex: 1 }}>
                                    {/* add new trip button */}
                                    {/* <OutlineButton styleButton={{ width: "90%" }} onPress={() => this.addTrip()}>Add trip</OutlineButton> */}
                                    {/* add new child button */}
                                    <OutlineButton styleButton={{ width: "80%", }} onPress={() => this.onSaveChild()}>Save</OutlineButton>
                                </View>
                            </View>}




                            {/* preview of added childs*/}
                            {!childShow && <View >
                                <View style={{ marginHorizontal: 15 }}>
                                    {childs.map((child, index) => (
                                        <TouchableOpacity disabled={true} key={index}>
                                            <View style={[styles.list]}>
                                                <View style={{ flex: 0.25 }}>
                                                    {/* <IconWithBg source={require('../../../assets/icons/school_white.png')} /> */}
                                                    <View style={{ width: wp("15%"), height: wp("15%"), borderRadius: 50, backgroundColor: "#143459", alignItems: "center", justifyContent: "center" }}>
                                                        <Image
                                                            source={child.gender.value === 'Male' ? require('../../../assets/icons/boy_white.png') : require('../../../assets/icons/girl_white.png')}
                                                            // style={{ width: wp("5%"), height: hp("3.5%") }}
                                                            style={{ width: 20, height: 30 }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ flex: 0.75 }}>
                                                    <Ionicons name={'md-more'} size={25} color={Theme.PRIMARY_COLOR} style={{ position: 'absolute', alignSelf: 'flex-end' }} />
                                                    <Text style={{ paddingBottom: 10, color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{child.name.value}</Text>
                                                    <Text style={{ fontSize: Theme.FONT_SIZE_LARGE }}>{child.trips.value[this.state.currentChild].name.value}</Text>
                                                    <Text style={{ fontSize: Theme.FONT_SIZE_SMALL }}>{child.trips.value[this.state.currentChild].branch.value}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={{ marginTop: 20, flexDirection: "row", flex: 1 }}>
                                    {/* add new trip button */}
                                    <OutlineButton styleButton={{ width: "90%" }} onPress={() => this.onAddChild()}>Add Another Child</OutlineButton>
                                </View>
                            </View>}

                        </View>
                    </ScrollView>

                    {/* footer button */}
                    {!childShow && <View >
                        {/* sign up button */}
                        <View style={[styles.button, { paddingVertical: 10 }]}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={this.onSignUp}>
                                <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                    <Text style={{ color: 'white', fontSize: RF(3) }}>Sign Up</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>}
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: '#143459', justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <Image
                            source={require('../../../assets/icons/app_icon.png')}
                            style={{ width: 70, height: 70, }}
                        />
                        <Image
                            source={require('../../../assets/icons/loading2.gif')}
                            style={{ width: 70, height: 20, marginTop: 10 }}
                        />
                    </View>

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
        marginTop: RF(9)
    },

    nextButton: {
        alignItems: 'center',
        padding: 10,
        width: '90%',
        // backgroundColor: "#143459",
        borderRadius: 10,
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
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        flexDirection: "row",
        backgroundColor: "#eee",
        alignItems: "center",
        // alignItems: "flex-start",
        borderRadius: 10,
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
        onSetUserData: (id) => dispatch(setUserData(id)),
    }
}

export default connect(null, mapDispatchToProps)(ParentChildSignUp);