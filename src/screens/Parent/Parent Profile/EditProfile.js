import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, StyleSheet, TouchableOpacity, View, Alert, Text, ActivityIndicator, PermissionsAndroid } from 'react-native';
import Header from './Header';
import InputWithIcon from '../../../components/InputWithIcon';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import RadioBox from '../../../components/RadioBox';
import ImagePicker from 'react-native-image-crop-picker';
import { EditParentProfile, uploadParentEditProfilePicture } from '../../../../store/actions/dataAction';
import TextWithStyle from '../../../components/TextWithStyle';
import validate from '../../../utilities/validation';
import { setUserData } from '../../../../store/actions/userAction';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderWithoutDrawer from '../../../components/Header/HeaderWithoutDrawer';

class EditProfile extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    state = {
        profilePicture: null,
        isFormValid: true,
        objectNames: ['name', 'email', 'address'],
        isLoading: false,
        controls: {
            email: {
                value: this.props.route.params.details.email !== null ? this.props.route.params.details.email : '',
                valid: true,
                validationRules: {
                    isEmail: true
                }
            },
            name: {
                value: this.props.route.params.details.name,
                valid: true,
                validationRules: {
                    isRequired: true
                }
            },
            address: {
                value: this.props.route.params.details.address,
                valid: true,
                validationRules: {
                    isRequired: true
                }
            },
            gender: {
                value: this.props.route.params.details.gender,
            },
        },
    }

    openCamera = async() => {
        
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
                            this.setState({ profilePicture: { mime: image.mime, data: image.data, path: image.path } })
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
                            this.setState({ profilePicture: { mime: image.mime, data: image.data, path: image.path } })
                        });
                    }
                },
            ],
            { cancelable: true },
        );
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    onInputChange = (key, value) => {
        let temp = { ...this.state.controls }
        temp[key].value = value
        this.setState({ controls: temp })
    }

    validateForm = () => {
        let valid = true
        this.state.objectNames.map(objectName => {
            let object = this.state.controls[objectName]
            let temp = { ...this.state.controls }
            // check validation for each object. if object is email then check if it is not null then validate it else set true by default
            if ((objectName === 'email' && object.value.length > 0) || (objectName !== 'email'))
                temp[objectName].valid = validate(object.value.trim(), object.validationRules)
            else if ((objectName === 'email' && object.value.length === 0))
                temp[objectName].valid = true

            this.setState({ controls: temp })

            // if any field is not valid then set form valid to false
            if ((objectName === 'email' && object.value.length > 0) || (objectName !== 'email'))
                if (!(validate(object.value, object.validationRules))) {
                    this.setState({ isFormValid: false });
                    if (valid === true)
                        valid = false
                }
        })
        return valid
    }

    onEdit = () => {
        if (this.validateForm()) {
            this.setState({ isLoading: true })

            const { name, email, address, gender } = this.state.controls;
            const data = { name: name.value, email: email.value, address: address.value, gender: gender.value, id: this.props.route.params.details.id }

            let formData = new FormData()
            // formData.append('data', JSON.stringify(data))

            this.state.profilePicture &&
                formData.append('profilePicture', {
                    name: `${this.state.controls.name.value}ProfilePicture${this.state.profilePicture.mime === "image/png" ? ".png" : ".jpg"}`,
                    type: this.state.profilePicture.mime,
                    uri:
                        Platform.OS === "android" ? this.state.profilePicture.path : this.state.profilePicture.path.replace("file://", "")
                })

            if (formData._parts.length > 0) {
                this.props.uploadParentEditProfilePicture(formData).then(values => {
                    this.editProfileProcess(data, values.profile_picture)
                })
            }
            else {
                this.editProfileProcess(data, 'null')
            }
        }
    }

    editProfileProcess = (data, profilePicture) => {
        this.props.EditParentProfile(data, profilePicture)
            .then(data => {
                console.warn('aaa', data[0])
                this.setState({ isLoading: false })
                // AsyncStorage.setItem('jwt', data);
                this.props.onSetUserData(data[0]);
                this.props.navigation.goBack(null)
            })
    }

    render() {
        let {profilePicture, isFormValid, objectNames, isLoading, controls} = this.state

        return (
            <View style={{ flex: 1 }}>

                <View style={styles.headerContainer} >
                    <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText='Parent Profile' />
                </View>

                <View style={{ flex: 1, marginTop: 20, marginHorizontal: 20 }}>

                    <TouchableOpacity onPress={this.openCamera} style={{ borderRadius: 50, backgroundColor: '#c4c4c4', alignSelf: 'center' }}>
                        {profilePicture === null ?
                            <Image style={{ width: 80, height: 80 }} source={require('../../../../assets/icons/parent/parent_profile_icon.png')} />
                            :
                            <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: `data:${profilePicture.mime};base64,${profilePicture.data}` }} />}
                    </TouchableOpacity>

                    {/* name */}
                    <InputWithIcon
                        iconName={require('../../../../assets/icons/signup/user.png')}
                        onChangeText={(val) => this.onInputChange('name', val)}
                        value={controls.name.value}
                        placeholder={"Full Name"}
                        error={(controls.name.valid === false && isFormValid === false) ? "Name is Required" : null}
                    />

                    {/* gender */}
                    <View style={{ flexDirection: 'row', marginVertical: 15, }}>
                        <View style={{ flex: 0.1 }}><Image style={{ width: 20, height: 20 }} source={require('../../../../assets/icons/signup/gender.png')} /></View>
                        <View style={{ flex: 0.9, flexDirection: 'row', }}>
                            <TextWithStyle> Gender</TextWithStyle>
                            <RadioBox  selected={controls.gender.value === 'Male'} text={'Male'} onPress={() => this.onInputChange('gender', 'Male')} />
                            <RadioBox selected={controls.gender.value === 'Female'} text={'Female'} onPress={() => this.onInputChange('gender', 'Female')} />
                        </View>
                    </View>

                    {/* email */}
                    <InputWithIcon
                        iconName={require('../../../../assets/icons/signup/email.png')}
                        onChangeText={(val) => this.onInputChange('email', val)}
                        value={controls.email.value}
                        placeholder={"Email Address (Optional)"}
                        error={(controls.email.valid === false && isFormValid === false) ? "Email is incorrect" : null}
                    />

                    {/* address */}
                    <InputWithIcon
                        iconName={require('../../../../assets/icons/signup/home.png')}
                        onChangeText={(val) => this.onInputChange('address', val)}
                        value={controls.address.value}
                        placeholder={"Complete Address"}
                        error={(controls.address.valid === false && isFormValid === false) ? "address is Required" : null}
                    />

                    <View style={[styles.button]}>
                        <TouchableOpacity style={{ width: '100%' }} onPress={this.onEdit} disabled={this.state.isLoading}>
                            <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                {/* <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Save</TextWithStyle> */}
                                {isLoading ?
                                    <ActivityIndicator size={25} color="white" />
                                    :
                                    <TextWithStyle style={{ fontSize: 22, color: "white" }}>Save</TextWithStyle>}
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
    },

    button: {
        marginTop: 150,
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
})

const mapDispatchToProps = (dispatch) => {
    return {
        EditParentProfile: (data, profilePicture) => dispatch(EditParentProfile(data, profilePicture)),
        uploadParentEditProfilePicture: (formData) => dispatch(uploadParentEditProfilePicture(formData)),
        onSetUserData: (data) => dispatch(setUserData(data)),
    }
}

export default connect(null, mapDispatchToProps)(EditProfile);