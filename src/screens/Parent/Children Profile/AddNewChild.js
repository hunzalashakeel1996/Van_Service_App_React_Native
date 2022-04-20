import React, { Component } from 'react';
import {
    Alert, Image, Picker, ScrollView, StyleSheet, Text, TextInput, TimePickerAndroid, TouchableNativeFeedback, TouchableOpacity, View, DatePickerAndroid
} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import { checkNumberExist, createUser, parentSignUp, passwordLogin, getSchools, addNewChild, uploadParentEditProfilePicture } from '../../../../store/actions/dataAction';
import validate from '../../../utilities/validation';
import InputWithIcon from "../../../components/InputWithIcon"
import OutlineButton from "../../../components/OutlineButton"
import Theme from "../../../components/Theme"
import timeConverter from '../../../components/timeConverter';
import ImagePicker from 'react-native-image-crop-picker';
import { setUserData, setDriverId, setChilds } from '../../../../store/actions/Map';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { TextInputMask } from 'react-native-text-input-mask';
// import MaskInputWithIcon from './../../components/MaskInputWithIcon';
import HeaderText from "../../../components/Header/HeaderText";
import RadioBox from '../../../components/RadioBox';
import IconWithBg from "../../../components/IconWithBg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Loader from '../../../components/Loader';
import Header from '../Parent Profile/Header';
import TextWithStyle from '../../../components/TextWithStyle';

class AddNewChild extends Component {
    static navigationOptions = {
        headerShown: false,
    }

    constructor(props) {
        super(props);

        this.state = {
            isFormValid: true,
            timeModalOpen: '',
            childs: [],
            isEdit: false,
            currentChild: 0,
            isLoading: false,
            schoolList: [],
            branchList: [],
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
        this.setState({ controls: tempControls });
    }


    onTripInputChange = (controls, key, value, index) => {
        let tempControls = { ...this.state[controls] };

        tempControls.trips.value[index][key].value = value;
        // tempControls[key].valid = validate(value.trim(), tempControls[key].validationRules);
        // console.warn(tempControls.trips.value[1])
        // console.warn(trip)

        this.setState({ controls: tempControls, timeModalOpen: '' });

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

    validateChild = () => {
        return new Promise((resolve, reject) => {

            let tempControls = { ...this.state.childControls };
            let keys = Object.keys(tempControls)
            // console.warn(keys)
            let tripsValidate = [];
            keys.map((key, i) => {

                if (key != 'trips') {
                    if (key != 'image') {
                        // if value is not empty
                        if (tempControls[key].value.trim() != "") {
                            let isValid = validate(tempControls[key].value.trim(), tempControls[key].validationRules);
                            tempControls[key].valid = isValid;
                            tempControls[key].error = !isValid ? this.errText[key] : null;

                        } else {
                            // if value is empty
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
        this.setState({ childControls: tempControls, isEdit: true });
        this.editChildIndex = index;
        // console.warn(childControls);
    }

    // when sign up button pressed
    onSignUp = () => {

    }

    openTimingClock = async (event, time) => {
        if (event.type == 'dismissed') {
            this.setState({ timeModalOpen: '' })
          }
          else {
            this.onTripInputChange('childControls', this.state.timeModalOpen.split('-')[0], `${time.getHours()}:${time.getMinutes()}:00`, this.state.timeModalOpen.split('-')[1])
          }
      

        // try {
        //     const { action, hour, minute } = await TimePickerAndroid.open({
        //         hour: 14,
        //         minute: 0,
        //         is24Hour: false, // Will display '2 PM'
        //     });
        //     if (action !== TimePickerAndroid.dismissedAction) {
        //         this.onTripInputChange('childControls', this.state.timeModalOpen.split('-')[0], `${hour > 9 ? hour : "0" + hour}:${minute > 9 ? minute : "0" + minute}:00`, this.state.timeModalOpen.split('-')[1])
        //     }
        // } catch ({ code, message }) {
        //     console.warn('Cannot open time picker', message);
        // }
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
    onSaveChild = async () => {
        this.setState({ isLoading: true })

        this.validateChild().then(data => {
            if (!data.childKeys.includes(false)) {
                let formData = new FormData()
                let { name, gender, dob, image, trips } = this.state.childControls
                let data = { name: name.value, gender: gender.value, dob: dob.value, trips: trips.value, parent_id: this.props.childs[0].parent_id, coordinates: this.props.childs[0].coordinates, address: this.props.childs[0].address, emergency_number: this.props.childs[0].emergency_number }

                image.value.mime &&
                    formData.append('profilePicture', {
                        name: `childProfile${image.value.mime === "image/png" ? ".png" : ".jpg"}`,
                        type: image.value.mime,
                        uri:
                            Platform.OS === "android" ? image.value.path : image.value.path.replace("file://", "")
                    })
                console.warn(formData._parts.length)
                // formData.append('data', JSON.stringify(data))
                if (formData._parts.length > 0) {
                    this.props.uploadParentEditProfilePicture(formData).then(values => {
                        this.addNewChildProcess(data, values.profile_picture)
                    })
                }
                else {
                    console.warn('tihs')
                    this.addNewChildProcess(data, 'null')
                }

            }
        })
    }

    addNewChildProcess = (data, image) => {
        this.props.addNewChild(data, image)
            .then(data => {
                this.setState({ isLoading: false })
                let childs = [...this.props.childs]
                childs.push(data[0])
                this.props.onSetChilds(childs);
                this.props.navigation.goBack(null)
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

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        let classes = ['nursery', 'kg1', 'kg2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        const { isLoading, childControls, childs, childShow, isEdit, schoolList, branchList } = this.state;
        if (!isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText='Children Profile' />
                    </View >

                    <ScrollView>
                        <View style={{ flex: 1 }}>
                            {/* form to add childs and their trips */}
                            <View style={{ marginHorizontal: 10 }}>
                                <View>
                                    {/* Child information */}
                                    <View style={{ marginBottom: 10, }}>
                                        <TextWithStyle style={{ flex: 1, textAlign: "center" }}>Basic Information</TextWithStyle>
                                        {childs.length > 0 && <Ionicons name="md-close-circle" size={25} style={{ position: 'absolute', alignSelf: 'flex-end' }} onPress={() => this.setState({ childShow: false })} />}
                                    </View>
                                    <View>

                                        <View style={{ paddingBottom: 5, justifyContent: "center", alignItems: "center" }}>
                                            {/* child image */}
                                            <View style={{ flex: 1 }}>
                                                <TouchableOpacity onPress={() => this.openCamera('childControls')} style={{ alignSelf: 'center' }}>
                                                    {childControls.image.value === "" ?
                                                        <Image style={{ width: 80, height: 80 }} source={require('../../../../assets/icons/signup/profile.png')} />
                                                        :
                                                        <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: `data:${childControls.image.value.mime};base64,${childControls.image.value.data}` }} />}
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ flex: 1, width: '100%', marginTop: 10 }}>
                                                {/* child name field */}
                                                <InputWithIcon
                                                    iconName={require('../../../../assets/icons/signup/user.png')}
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
                                                        <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../../assets/icons/signup/cake.png')} /></View>
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
                                            <View style={{ flex: 0.1 }}><Image style={styles.icon} source={require('../../../../assets/icons/signup/gender.png')} /></View>
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

                                                    {/* school class field  */}
                                                    <View style={{ marginBottom: 10 }}>
                                                        <View style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1 }}>
                                                            <Picker
                                                                style={{ height: 30 }}
                                                                selectedValue={trip.class.value}
                                                                onValueChange={(val) => this.onTripInputChange('childControls', 'class', val, tripIndex)}
                                                                mode={'dropdown'}>
                                                                <Picker.Item label="Select Class/Grade" value='' />
                                                                {classes.map((item, index) => {
                                                                    return <Picker.Item key={index} label={item} value={item} />
                                                                })}
                                                            </Picker>
                                                        </View>
                                                        {trip.class.error && <TextWithStyle style={styles.text1}>{trip.class.error}</TextWithStyle>}

                                                    </View>

                                                    {/* start time and off time field */}
                                                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10, marginHorizontal: 5, flex: 1, justifyContent: 'space-between' }}>
                                                        <View style={{ flex: 0.45 }}>
                                                            <TouchableOpacity style={{}} onPress={() => this.setState({timeModalOpen: `startTime-${tripIndex}`})}>
                                                                <TextWithStyle style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.startTime.value ? `Start Time: ${timeConverter(trip.startTime.value)}` : `${trip.title.value} Starts At`}</TextWithStyle>
                                                            </TouchableOpacity>
                                                            {trip.startTime.error && <TextWithStyle style={styles.text1}>{trip.startTime.error}</TextWithStyle>}
                                                        </View>
                                                        <View style={{ flex: 0.45 }}>
                                                            <TouchableOpacity style={{}} onPress={() => this.setState({timeModalOpen: `endTime-${tripIndex}`})}>
                                                                <TextWithStyle style={{ borderBottomColor: Theme.BORDER_COLOR, borderBottomWidth: 1, fontSize: Theme.FONT_SIZE_MEDIUM }}>{trip.endTime.value ? `End Time: ${timeConverter(trip.endTime.value)}` : `${trip.title.value} Ends At`}</TextWithStyle>
                                                            </TouchableOpacity>
                                                            {trip.endTime.error && <TextWithStyle style={styles.text1}>{trip.endTime.error}</TextWithStyle>}
                                                        </View>
                                                        {this.state.timeModalOpen !== '' &&<DateTimePicker mode={'time'} value={new Date()} is24Hour={false} onChange={(event, datetime) => { this.openTimingClock(event, datetime)}} />}
                                                    </View>
                                                </View>
                                                {trip.title.value != 'School' && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: "rgba(255,255,255,1)", }}>Coming Soon</TextWithStyle>
                                                </View>}
                                            </View>}

                                        </View>
                                    ))}
                                </View>

                                <View style={[styles.button]}>
                                    <TouchableOpacity style={{ width: '100%' }} onPress={this.onSaveChild}>
                                        <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                            {/* <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Save</TextWithStyle> */}
                                            {this.state.isloading ? <ActivityIndicator size={25} color="white" />
                                                : <TextWithStyle style={{ fontSize: 22, color: "white" }}>Save</TextWithStyle>}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>


                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.headerContainer, { flex: 1 }]} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText='Children Profile' />
                    </View>
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
        // position: 'absolute',
        // bottom: 10,
        // top: 0,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '50%'
    },

    nextButton: {
        alignItems: 'center',
        padding: 8,
        width: '100%',
        borderRadius: 5,
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
        backgroundColor: "#eee",
        alignItems: "center",
        // alignItems: "flex-start",
        borderRadius: 10,
        zIndex: -1
    },
    icon: {
        width: 20,
        height: 20,
    },

    headerContainer: {
        width: '100%',
        marginBottom: 20,
        top: 0,
        left: 0,
        zIndex: 100,
    },
})

mapStateToProps = (state) => {
    return {
        childs: state.map.childs,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (details) => dispatch(createUser(details)),
        checkNumberExist: (number) => dispatch(checkNumberExist(number)),
        parentSignUp: (data) => dispatch(parentSignUp(data)),
        passwordLogin: (number, password, token) => dispatch(passwordLogin(number, password, token)),
        onSetUserData: (id) => dispatch(setUserData(id)),
        getSchools: (props) => dispatch(getSchools(props)),
        addNewChild: (data, image) => dispatch(addNewChild(data, image)),
        onSetChilds: (childs) => dispatch(setChilds(childs)),
        uploadParentEditProfilePicture: (formData) => dispatch(uploadParentEditProfilePicture(formData)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewChild);