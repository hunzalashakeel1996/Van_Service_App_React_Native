import React, { Component } from 'react';
import {
    Alert, Image, Picker, ScrollView, StyleSheet, BackHandler, TextInput, TimePickerAndroid, TouchableNativeFeedback, TouchableOpacity, View, DatePickerAndroid
} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { checkNumberExist, createUser, parentSignUp, passwordLogin, getSchools, uploadChildsSingupImages, uploadParentEditProfilePicture, setJWT, insertChild } from '../../../store/actions/dataAction';
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
import HeaderText from "../../components/Header/HeaderText";
import RadioBox from '../../components/RadioBox';
import IconWithBg from "../../components/IconWithBg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Loader from '../../components/Loader';
import TextWithStyle from '../../components/TextWithStyle';
import HeaderWithoutDrawer from '../../components/Header/HeaderWithoutDrawer';

class ParentChildSignUp extends Component {

    //DriverHeader is defined in another js file
    // static navigationOptions = ({ navigation }) => HeaderText(navigation, "Add Your Child Info");

    constructor(props) {
        super(props);

        this.state = {
            isFormValid: true,
            childs: [],
            childShow: true,
            isEdit: false,
            currentChild: 0,
            isLoading: false,
            schoolList: [],
            branchList: [],
            parentControls: [],
            parentControls: props.navigation.getParam('parentControls'),
            userData: props.navigation.getParam('user_data'),
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
        }
        this.errReqText = {
            name: "Name is required",
            dob: "Date of Birth is required",
            branch: "Branch is required",
            class: "Class is required",
            startTime: "Start Time is required",
            endTime: "End Time is required",
        }
    }

    componentDidMount = () => {
        // this.props.navigation.setParams({ page: 2 });
        // console.warn('parentsID',this.props.navigation.getParam('id'))
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', ()=>{return true});
        this.setState({ isLoading: true })
        this.addTrip(true);
        this.props.getSchools().then(data => {
            let schools = data;
            schools.map(item => {
                Object.assign(item, { branch_name: item.branch_name.split('-vw-'), coordinates: item.coordinates.split('-vw-'), address: item.address.split('-vw-') })
            })
            console.warn(schools)
            this.setState({ schoolList: schools, isLoading: false })
        })

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

        this.setState({ childControls },()=>{
        this.addTrip(true);
        });
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

    schoolChange = (controls, key, itemValue, itemIndex, index) => {
        let branchList = [];

        let tempControls = { ...this.state[controls] };

        if (itemIndex != 0) {
            let branch_name = this.state.schoolList[itemIndex - 1].branch_name;
            let coordinates = this.state.schoolList[itemIndex - 1].coordinates;
            let address = this.state.schoolList[itemIndex - 1].address;
            branch_name.map((name, index) => {
                branchList.push({ name: name, coordinates: coordinates[index], address: address[index] })
            })
        }

        tempControls.trips.value[index].branch.value = "";
        tempControls.trips.value[index][key].value = itemValue;
        this.setState({ branchList, controls: tempControls })


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
        // console.warn(this.state.childControls)

        return new Promise((resolve, reject) => {

            let tempControls = { ...this.state.childControls };
            let keys = Object.keys(tempControls)
            // console.warn(keys)
            let tripsValidate = [];
            keys.map((key, i) => {

                if (key != 'trips') {
                    if (key != 'image') {
                        //if value is not empty
                        if (tempControls[key].value.trim() != "") {
                            let isValid = validate(tempControls[key].value.trim(), tempControls[key].validationRules);
                            tempControls[key].valid = isValid;
                            tempControls[key].error = !isValid ? this.errText[key] : null;

                        } 
                        else {
                            //if value is empty
                            let isValid = false;
                            tempControls[key].valid = isValid;
                            tempControls[key].error = !tempControls[key].valid ? this.errReqText[key] : null;
                        }
                    } else {
                        let isValid = tempControls[key].value != null ? true : false;
                        tempControls[key].valid = isValid;
                        tempControls[key].error = !isValid ? this.errText[key] : null;
                    }
                    //set validation to check all keys are valid now
                    keys[i] = tempControls[key].valid;
                } else {

                    tempControls[key].value.map(trip => {
                        let tripKeys = Object.keys(trip)
                        // console.warn(tripKeys)

                        tripKeys.map((tripKey, i) => {
                            if (typeof trip[tripKey].value == 'string') {

                                if (trip[tripKey].value.trim() != "") {
                                    let isValid = validate(trip[tripKey].value.trim(), trip[tripKey].validationRules);
                                    trip[tripKey].valid = isValid;
                                    trip[tripKey].error = !isValid ? this.errText[key] : null;
                                }
                                else {
                                    //if value is empty
                                    let isValid = false;
                                    trip[tripKey].valid = isValid;
                                    trip[tripKey].error = !isValid ? this.errReqText[tripKey] : null;

                                }
                            } else {
                                let isValid = trip[tripKey].value != null ? true : false;
                                trip[tripKey].valid = isValid;
                                trip[tripKey].error = !isValid ? this.errText[key] : null;
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

    editChild = (child, index) => {
        let tempControls = { ...this.state.childControls };
        let keys = Object.keys(child)
        // console.warn(keys)
        keys.map((key, i) => {

            if (key != 'trips') {
                tempControls[key].value = child[key].value
            } else {
                child[key].value.map((trip, i) => {
                    // let tripKeys = Object.keys(trip)
                    // console.warn(tripKeys)
                    // console.warn(tripKey)
                    // console.warn(trip[tripKey])
                    tempControls.trips.value[i] = trip;
                })
            }
        })
        this.setState({ childControls: tempControls, childShow: true, isEdit: true });
        this.editChildIndex = index;
        // console.warn(childControls);
    }

    onUpdateChild = () => {
        this.validateChild().then(data => {
            // console.warn(data.childKeys)
            if (!data.childKeys.includes(false)) {
                // console.warn("ok")
                let tempControls = { ...this.state.childControls };
                // console.warn("tempControls", tempControls)
                let tempChilds = [...this.state.childs]
                tempChilds[this.editChildIndex] = tempControls;
                // console.warn("tempChilds", tempChilds[this.editChildIndex])

                this.setState({ childs: tempChilds, childShow: false, isEdit: false }, () => {
                    // console.warn("childs", this.state.childs)
                })
                this.clearChildControls();
                // console.warn(this.state.childControls)
            }
        })
    }

    // when sign up button pressed
    onSignUp = () => {
        this.setState({ isLoading: true })
        // console.warn(this.state.childControls)
        // let parentPicture = this.state.parentControls.image.value;
        let childPicture = this.state.childControls.image.value;

        const formData = new FormData();
        // if (parentPicture != "") {
        //     formData.append('parentPicture', {
        //         name: `parentPicture${parentPicture.mime === "image/png" ? ".png" : ".jpg"}`,
        //         type: parentPicture.mime,
        //         uri:
        //             Platform.OS === "android" ? parentPicture.path : parentPicture.path.replace("file://", "")
        //     })
        //     this.state.parentControls.image.value = this.state.parentControls.image.value != "" ? "true" : "";
        // }
        // let cord = this.state.parentControls.location.value;
        // this.state.parentControls.location.value = `${cord.latitude},${cord.longitude}`

        this.state.childs.map((child, index) => {
            if (child.image.value !== "") {
                console.warn('non-empty image')
                formData.append('childsPicture', {
                    name: `childsPicture${child.image.value.mime === "image/png" ? ".png" : ".jpg"}`,
                    type: child.image.value.mime,
                    uri:
                        Platform.OS === "android" ? child.image.value.path : child.image.value.path.replace("file://", "")
                })
                child.image.value = child.image.value != "" ? "true" : "";
            }
            // }
        })

        // formData.append('data', JSON.stringify(data))
        // if parent uplaod any image of parent profile or child profile then save it to server else create account direct 
        console.warn("formData._parts.length > 0:", formData._parts.length > 0)
        if (formData._parts.length > 0) {
            console.warn('yes, _parts.length', formData._parts.length)
            this.props.uploadChildsSingupImages(formData).then(values => {
                console.warn("uploadChildsSingupImages:", values)
                let data = {
                    // parent: this.state.parentControls,
                    childs: this.state.childs,
                    // child: this.state.childControls,
                    // parent_picture: values.parent_profile,
                    childs_profile: values.childs_profile
                }
                this.parentSignupProcess(data)

            })
        }
        else {
            let data = {
                // parent: this.state.parentControls,
                childs: this.state.childs,
                // child: this.state.childControls
            }
            this.parentSignupProcess(data)
        }
    }

    parentSignupProcess = (data) => {
        console.warn("parentSignupProcess")
        // console.warn(data, this.state.parentsID);
        let _data = {
            user_data: this.state.userData,
            data: data
    }
        console.warn("parentSignupProcess", _data)
        this.props.insertChild(_data).then(res => {
            console.warn("insertChild:", res)
            // if(res) {
                this.setState({ isLoading: false })
                this.props.navigation.navigate('HomeParentApp')
            // }
        })

        // this.props.parentSignUp(data).then(res => {
        //     console.warn(res)
        //     let data = this.props.navigation.getParam('data');
        //     console.warn(data)

        //     this.props.passwordLogin(data.number, data.password, data.token)
        //         .then(token => {
        //             if (token) {
        //                 jsonWebToken = token.token; //Json web token recieve
        //                 this.props.onSetJWT(jsonWebToken);
        //                 // save jwt in local storage
        //                 AsyncStorage.setItem('jwt', jsonWebToken);
        //                 let decodedJwt = jwtDecode(jsonWebToken)

        //                 this.props.onSetUserData(decodedJwt);

        //                 setTimeout(() => {this.props.navigation.navigate('HomeParentApp', { token: jsonWebToken });}, 10) 
        //             }
        //         })
        // })
    }

    openTimingClock = async (timeControl, tripIndex) => {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                this.onTripInputChange('childControls', timeControl, `${hour > 9 ? hour : "0" + hour}:${minute > 9 ? minute : "0" + minute}:00`, tripIndex)
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
        console.warn(this.state.childControls)
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
        this.clearChildControls(),
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

    goBack = () => {
        if (this.state.childs.length === 0)
            this.props.navigation.navigate('Dashboard')
        else
            this.setState({childShow: false})
    }

    render() {
        const { isLoading, childControls, childs, childShow, isEdit, schoolList, branchList } = this.state;
        if (!isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <HeaderWithoutDrawer headerText={'Add Your Child Info'} onBack={() => {this.goBack(); }}/> 
                    <ScrollView>
                        <View style={{ flex: 1 }}>
                            {/* form to add childs and their trips */}
                            {childShow && <View style={{ marginHorizontal: 10 }}>
                                <View>
                                    {/* Child information */}
                                    <View style={{ marginVertical: 10, }}>
                                        <TextWithStyle style={{ flex: 1, textAlign: "center" }}>Basic Information</TextWithStyle>
                                        {childs.length > 0 && <Ionicons name="md-close-circle" size={25} style={{ position: 'absolute', alignSelf: 'flex-end' }} onPress={() => this.setState({ childShow: false })} />}
                                    </View>
                                    <View>

                                        <View style={{ paddingBottom: 5, justifyContent: "center", alignItems: "center" }}>
                                            {/* child image */}
                                            <View style={{ flex: 1 }}>
                                                <TouchableOpacity onPress={() => this.openCamera('childControls')} style={{ alignSelf: 'center' }}>
                                                    {childControls.image.value === "" ?
                                                        <Image style={{ width: 82, height: 80 }} source={require('../../../assets/icons/parent/child_profile_icon.png')} />
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
                                                <View style={{ marginVertical: 10 }}>
                                                    <View style={{ flexDirection: 'row', borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, }}>
                                                        <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../assets/icons/signup/cake.png')} /></View>
                                                        <TouchableOpacity style={{ flex: 0.9, }} onPress={() => this.openDate()}>
                                                            <TextWithStyle style={{ marginBottom: 5, fontSize: Theme.FONT_SIZE_MEDIUM }}>{childControls.dob.value ? this.formatDate(childControls.dob.value) : 'Enter Date of Birth'}</TextWithStyle>
                                                        </TouchableOpacity>
                                                    </View>
                                                    {childControls.dob.error && <TextWithStyle style={styles.text}>{childControls.dob.error}</TextWithStyle>}
                                                </View>
                                            </View>
                                        </View>

                                        {/* gender */}
                                        {/* gender */}
                                        <View style={{ flexDirection: 'row', marginVertical: 5, }}>
                                            <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../assets/icons/signup/gender.png')} /></View>
                                            <View style={{ flex: 0.9, flexDirection: 'row', }}>
                                                <TextWithStyle> Gender</TextWithStyle>
                                                <RadioBox selected={childControls.gender.value === 'Male'} text={'Male'} onPress={() => this.onInputChange('childControls', "gender", 'Male')} />
                                                <RadioBox selected={childControls.gender.value === 'Female'} text={'Female'} onPress={() => this.onInputChange('childControls', "gender", 'Female')} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    {/* shift information for each child */}
                                    <View style={{ marginTop: 20, marginBottom: 5 }}>
                                        {/* <TextWithStyle style={{  }}>Trip Information</TextWithStyle> */}
                                    </View>

                                    {/* iterate over number of trips for each child */}
                                    {childControls.trips.value.map((trip, tripIndex) => (
                                        <View key={{ tripIndex }} style={{ backgroundColor: "#F2F2F2", paddingHorizontal: 8, borderRadius: 5, paddingBottom: 10 }}>
                                            {/* trip number header */}
                                            <View style={{ justifyContent: 'center', marginTop: 10, marginBottom: 10, flexDirection: "row" }}>
                                                {/* <TouchableOpacity > */}
                                                {/* <TextWithStyle style={{ flex: 0.9, color: '#143459', fontSize: RF(2.2),  }}>{`${trip.title.value} Trip`}</TextWithStyle> */}
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
                                                {/* <TextWithStyle style={{ flex: 0.9, color: '#143459', fontSize: RF(2.2), fontWeight: 'bold', textAlign: "center" }}>{`Trip # ${tripIndex + 1}`}</TextWithStyle> */}
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
                                                                onValueChange={(itemValue, itemPosition) => this.schoolChange('childControls', 'name', itemValue, itemPosition, tripIndex)}
                                                                mode={'dropdown'}>
                                                                <Picker.Item label={`${trip.title.value} Name`} value='' />
                                                                {schoolList.map((school, index) => {
                                                                    return <Picker.Item key={index} label={school.name} value={school.name} />
                                                                })}
                                                            </Picker>
                                                        </View>
                                                        {trip.name.error && <TextWithStyle style={styles.text1}>{trip.name.error}</TextWithStyle>}

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
                                                                key={branchList}
                                                                style={{ height: 30 }}
                                                                selectedValue={trip.branch.value}
                                                                onValueChange={(val) => this.onTripInputChange('childControls', 'branch', val, tripIndex)}
                                                                mode={'dropdown'}>
                                                                <Picker.Item label={`${trip.title.value} Branch Name`} value='' />
                                                                {branchList.map((branch, index) => {
                                                                    return <Picker.Item key={index} label={branch.name} value={branch} />
                                                                })}
                                                            </Picker>
                                                        </View>
                                                        {trip.branch.error && <TextWithStyle style={styles.text1}>{trip.branch.error}</TextWithStyle>}

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
                                                        {trip.class.error && <TextWithStyle style={styles.text1}>{trip.class.error}</TextWithStyle>}

                                                    </View>

                                                    {/* start time and off time field */}
                                                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10, marginHorizontal: 5, flex: 1, justifyContent: 'space-between' }}>
                                                        <View style={{ flex: 0.45 }}>
                                                            <TouchableOpacity style={{}} onPress={() => this.openTimingClock('startTime', tripIndex)}>
                                                                <TextWithStyle style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.startTime.value ? `Start Time: ${timeConverter(trip.startTime.value)}` : `${trip.title.value} Starts At`}</TextWithStyle>
                                                            </TouchableOpacity>
                                                            {trip.startTime.error && <TextWithStyle style={styles.text1}>{trip.startTime.error}</TextWithStyle>}
                                                        </View>
                                                        <View style={{ flex: 0.45 }}>
                                                            <TouchableOpacity style={{}} onPress={() => this.openTimingClock('endTime', tripIndex)}>
                                                                <TextWithStyle style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.endTime.value ? `End Time: ${timeConverter(trip.endTime.value)}` : `${trip.title.value} Ends At`}</TextWithStyle>
                                                            </TouchableOpacity>
                                                            {trip.endTime.error && <TextWithStyle style={styles.text1}>{trip.endTime.error}</TextWithStyle>}
                                                        </View>
                                                    </View>
                                                </View>
                                                {trip.title.value != 'School' && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: "rgba(255,255,255,1)", }}>Coming Soon</TextWithStyle>
                                                </View>}
                                            </View>}

                                        </View>
                                    ))}
                                </View>

                                <View style={{ marginTop: 20, marginBottom: 10, flexDirection: "row", flex: 1 }}>
                                    {/* add new trip button */}
                                    {/* <OutlineButton styleButton={{ width: "90%" }} onPress={() => this.addTrip()}>Add trip</OutlineButton> */}
                                    {/* add new child button */}
                                    {/* <OutlineButton styleButton={{ width: "80%", }} onPress={() => isEdit ? this.onUpdateChild() : this.onSaveChild()}>{isEdit ? 'Update' : 'Save'}</OutlineButton> */}
                                    <View style={[styles.button]}>
                                        <TouchableOpacity style={{ width: '50%' }} onPress={() => isEdit ? this.onUpdateChild() : this.onSaveChild()}>
                                            <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                                {/* <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Save</TextWithStyle> */}
                                                {this.state.isloading ? <ActivityIndicator size={25} color="white" />
                                                    : <TextWithStyle style={{ fontSize: 18, color: "white" }}>{isEdit ? 'Update' : 'Save'}</TextWithStyle>}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>}




                            {/* preview of added childs*/}
                            {!childShow && <View >
                                <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                                    {childs.map((child, index) => (
                                        <TouchableOpacity onPress={() => { this.editChild(child, index) }} key={index}>
                                            <View style={[styles.list]} >
                                                <View style={{ flex: 0.25 }}>
                                                    {/* <IconWithBg source={require('../../../assets/icons/school_white.png')} /> */}
                                                    {child.image.value != "" ? <Image style={{ width: 60, height: 60, borderRadius: 50 }} source={{ uri: `data:${child.image.value.mime};base64,${child.image.value.data}` }} /> :
                                                        <View style={{ width: wp("15%"), height: wp("15%"), borderRadius: 50, backgroundColor: "#143459", alignItems: "center", justifyContent: "center" }}>
                                                            <Image
                                                                source={child.gender.value === 'Male' ? require('../../../assets/icons/boy_white.png') : require('../../../assets/icons/girl_white.png')}
                                                                // style={{ width: wp("5%"), height: hp("3.5%") }}
                                                                style={{ width: 20, height: 30 }}
                                                            />
                                                        </View>}
                                                </View>
                                                <View style={{ flex: 0.75 }}>
                                                    {/* <TouchableOpacity onPress={()=>{console.warn("ok")}} style={{ position: 'absolute', alignSelf: 'flex-end', padding: 5, zIndex: 10 }}> */}
                                                    <Ionicons name={'md-more'} size={25} color={Theme.PRIMARY_COLOR} style={{ position: 'absolute', alignSelf: 'flex-end', zIndex: 1 }} />
                                                    {/* </TouchableOpacity> */}
                                                    <TextWithStyle style={{ paddingBottom: 10, color: Theme.BLACK_COLOR, fontSize: Theme.FONT_SIZE_LARGE }}>{child.name.value}</TextWithStyle>
                                                    <TextWithStyle numberOfLines={1} style={{ fontSize: Theme.FONT_SIZE_LARGE }}>{child.trips.value[this.state.currentChild].name.value}</TextWithStyle>
                                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL }}>{child.trips.value[this.state.currentChild].branch.value.name}</TextWithStyle>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={{ marginTop: 20, flex: 1 }}>
                                    {/* add new trip button */}
                                    {/* <OutlineButton styleButton={{ width: "90%" }} onPress={() => this.onAddChild()}>Add Another Child</OutlineButton> */}
                                    <TouchableOpacity style={[styles.locateContainer]} onPress={() => this.onAddChild()}>
                                        <TextWithStyle style={{ color: 'white', fontSize: 25, }}>+</TextWithStyle>
                                    </TouchableOpacity>
                                </View>
                            </View>}

                        </View>
                    </ScrollView>

                    {/* footer button */}
                    {
                        //     !childShow && <View >
                        //     {/* sign up button */}
                        //     <View style={[styles.button, { paddingVertical: 10 }]}>
                        //         <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={this.onSignUp}>
                        //             <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                        //                 <TextWithStyle style={{ color: 'white', fontSize: RF(3) }}>Sign Up</TextWithStyle>
                        //             </View>
                        //         </TouchableNativeFeedback>
                        //     </View>
                        // </View>
                    }

                    {!childShow && <View style={{alignSelf: 'center', marginBottom: 20, flexDirection: 'row', paddingTop: 10}}>
                        <TextWithStyle>By clicking Sign up you are accepting </TextWithStyle>
                        <TextWithStyle style={{color: '#14345A'}}>Terms and Condition</TextWithStyle>
                    </View>}

                    {!childShow && <View style={[styles.button]}>
                            <TouchableOpacity style={{ width: '50%' }} onPress={this.onSignUp}>
                                <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                    {/* <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Save</TextWithStyle> */}
                                    {this.state.isloading ? <ActivityIndicator size={25} color="white" />
                                        : <TextWithStyle style={{ fontSize: 22, color: "white" }}>Sign Up</TextWithStyle>}
                                </View>
                            </TouchableOpacity>
                    </View>}
                </View>
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
        // marginTop: 20,
        marginBottom: 10
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
    text1: {
        marginLeft: 20,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.RED_COLOR
    },
    list: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        flexDirection: "row",
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        // alignItems: "flex-start",
        borderRadius: 10,
        zIndex: -1
    },
    icon: {
        width: 20,
        height: 20,
        marginBottom: 7
    },

    locateContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        position: "relative",
        // bottom: 0,
        right: 20,
        backgroundColor: "#14345A",
        width: RF(8),
        height: RF(8),
        borderRadius: 50,
        // paddingVertical: 7,
        // paddingHorizontal: 10,
      },
});

ParentChildSignUp.navigationOptions = {
    headerShown: false,
};

const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (details) => dispatch(createUser(details)),
        checkNumberExist: (number) => dispatch(checkNumberExist(number)),
        parentSignUp: (data) => dispatch(parentSignUp(data)),
        passwordLogin: (number, password, token) => dispatch(passwordLogin(number, password, token)),
        insertChild: (data, id) => dispatch(insertChild(data, id)),
        onSetUserData: (id) => dispatch(setUserData(id)),
        getSchools: () => dispatch(getSchools()),
        uploadChildsSingupImages: (formData) => dispatch(uploadChildsSingupImages(formData)),
        uploadParentEditProfilePicture: (formData) => dispatch(uploadParentEditProfilePicture(formData)),
        onSetJWT: (jwt) => dispatch(setJWT(jwt)),
    }
}

export default connect(null, mapDispatchToProps)(ParentChildSignUp);