import React, { Component } from 'react';
import {
  Alert, Image, Picker, ScrollView, StyleSheet, TextInput, TimePickerAndroid, TouchableNativeFeedback, TouchableOpacity, View, DatePickerAndroid
} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { checkNumberExist, createUser } from '../../../store/actions/dataAction';
import validate from '../../utilities/validation';
import Header from '../Parent/Parent Profile/Header';
import InputWithIcon from "../../components/InputWithIcon"
import OutlineButton from "../../components/OutlineButton"
import PushNotification from 'react-native-push-notification';
import ImagePicker from 'react-native-image-crop-picker';
import MaskInputWithIcon from './../../components/MaskInputWithIcon';
import RadioBox from '../../components/RadioBox';
import TextWithStyle from '../../components/TextWithStyle';

class DriverSignUp extends Component {
  //DriverHeader is defined in another js file
  // static navigationOptions = ({ navigation }) => HeaderWithText(navigation, "Create An Account");
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    isFormValid: true,
    isLoading: false,
    objectNames: ['name', 'email', 'emergencyNumber', 'nic', 'registrationNumber', 'licenseNumber'],
    region: {
      latitude: 67.0755,
      longitude: 24.9355,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    token: null,
    profilePicture: null,
    controls: {
      email: {
        value: '',
        valid: true,
      },
      name: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true
        }
      },
      emergencyNumber: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true,
          isNumberDifference: true,
          isNumber: true
        }
      },
      nic: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true,
          isNIC: true
        }
      },
      registrationNumber: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true,
        }
      },
      licenseNumber: {
        value: '',
        valid: true,
      },
      gender: {
        value: 'Male',
      },
      role: { value: 'D' },
      mobile_number: { value: '03561234567' },

      mobile_number: { value: this.props.navigation.getParam('data').number },
      password: { value: this.props.navigation.getParam('data').password }
    },
  }

  componentDidMount = () => {
    this.data = this.props.navigation.getParam('data');
  }

  // when value of any input field change this method call
  onInputChange = (key, value) => {
    let temp = { ...this.state.controls }
    temp[key].value = key === 'emergencyNumber' ? `${value.split('-')[0]}${value.split('-')[1]}` : value
    this.setState({ controls: temp })
  }

  onPageChange = () => {
    valid = true;   // variable to decide whether any field is invalid or all fields are valid

    // check each field if valid then create new user else show error to each invalid field and not create new user
    this.state.objectNames.map(objectName => {
      let object = this.state.controls[objectName]

      let temp = { ...this.state.controls }
      temp[objectName].valid = validate(object.value.trim(), object.validationRules, this.state.controls.mobile_number.value)
      this.setState({ controls: temp })

      // if any field is not valid then set form valid to false
      if (!(validate(object.value, object.validationRules, this.state.controls.mobile_number.value))) {
        this.setState({ isFormValid: false });
        if (valid === true)
          valid = false
      }
    })

    if (this.state.profilePicture === null) {
      alert('Please upload your profile picture')
      return
    }
 
    // if valid is true then create new user 
    if (valid === true) {
      this.setState({ isLoading: true })

      const formData = new FormData();
      formData.append('profilePicture', {
        name: `profilePicture${this.state.profilePicture.mime === "image/png" ? ".png" : ".jpg"}`,
        type: this.state.profilePicture.mime,
        uri:
          Platform.OS === "android" ? this.state.profilePicture.path : this.state.profilePicture.path.replace("file://", "")
      })
      formData.append('controls', JSON.stringify(this.state.controls))

      // check if role is driver then send user to document page else navigate it to login page
      this.props.navigation.navigate('Documents', { driverFormData: formData, data: this.data });
      // this.props.createUser(formData)
      //   .then((res) => {
      //     resp = res._bodyInit
      //     this.setState({ isLoading: false })
      //     if (res.status !== 200)
      //       alert(JSON.stringify(res._bodyInit));
      //     else
      //       this.props.navigation.navigate('Documents', { insertId: resp.insertId, data: this.data, token: this.props.navigation.dangerouslyGetParent().getParam('token')});
      //   })
    }
  }

  openCamera = () => {
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

  render() {
      return (
        <React.Fragment>
          <View style={styles.headerContainer} >
            <Header headerText='Create Your Account' />
          </View >
          <ScrollView>
            <View>
              <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                {/* <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                  <TextWithStyle style={styles.textContainer}>Enter your details to signup with VanWala</TextWithStyle>
                </View> */}

                <TouchableOpacity onPress={this.openCamera} style={{ borderRadius: 50, backgroundColor: 'white', alignSelf: 'center' }}>
                  {this.state.profilePicture === null ?
                    <Image style={{ width: 80, height: 80 }} source={require('../../../assets/icons/parent/driver_profile_icon.png')} />
                    :
                    <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: `data:${this.state.profilePicture.mime};base64,${this.state.profilePicture.data}` }} />}
                </TouchableOpacity>

                {/* name */}
                <InputWithIcon
                  iconName={require('../../../assets/icons/signup/user.png')}
                  onChangeText={(val) => this.onInputChange('name', val)}
                  value={this.state.controls.name.value}
                  // onFocus={this.onEmailFocusBlur}
                  // onBlur={() => this.onBlur("email")}
                  placeholder={"Full Name"}
                  error={(this.state.controls.name.valid === false && this.state.isFormValid === false) ? "Name is Required" : null}
                />

                {/* gender */}
                <View style={{ flexDirection: 'row', marginVertical: 15, }}>
                  <View style={{ flex: 0.1 }}><Image style={{ width: 20, height: 20 }} source={require('../../../assets/icons/signup/gender.png')} /></View>
                  <View style={{ flex: 0.9, flexDirection: 'row', }}>
                    <TextWithStyle> Gender</TextWithStyle>
                    <RadioBox selected={this.state.controls.gender.value === 'Male'} text={'Male'} onPress={() => this.onInputChange('gender', 'Male')} />
                    <RadioBox selected={this.state.controls.gender.value === 'Female'} text={'Female'} onPress={() => this.onInputChange('gender', 'Female')} />
                  </View>
                </View>

                {/* email */}
                <InputWithIcon
                  iconName={require('../../../assets/icons/signup/email.png')}
                  onChangeText={(val) => this.onInputChange('email', val)}
                  value={this.state.controls.email.value}
                  // onFocus={this.onEmailFocusBlur}
                  // onBlur={() => this.onBlur("email")}
                  placeholder={"Email Address (Optional)"}
                // error={(this.state.controls.email.valid === false && this.state.isFormValid === false) ? "Email is incorrect" : null}
                />

                {/* {emergencyNumber} */}
                <MaskInputWithIcon
                  iconName={require('../../../assets/icons/signup/mobile.png')}
                  onChangeText={(val) => this.onInputChange('emergencyNumber', val)}
                  value={this.state.controls.emergencyNumber.value}
                  // onFocus={this.onEmailFocusBlur}
                  // onBlur={() => this.onBlur("email")}
                  placeholder={"Emergency Contact"}
                  // type={"custom"}
                  // options={{mask: '9999-9999999'}}
                  mask={"[0000]-[0000000]"}
                  keyboardType={"numeric"}
                  error={(this.state.controls.emergencyNumber.value.length < 1 && this.state.controls.emergencyNumber.valid === false && this.state.isFormValid === false) ? "Emergency Number is Required" : (this.state.controls.emergencyNumber.valid === false && this.state.isFormValid === false && this.state.controls.emergencyNumber.value.length > 0) ? 'Emergency Number Should be Correct And Different From SignUp Number' : null}
                />

                {/* {nic} */}
                <MaskInputWithIcon
                  iconName={require('../../../assets/icons/signup/nic.png')}
                  onChangeText={(val) => this.onInputChange('nic', val)}
                  value={this.state.controls.nic.value}
                  // onFocus={this.onEmailFocusBlur}
                  // onBlur={() => this.onBlur("email")}
                  placeholder={"NIC"}
                  // type={"custom"}
                  // options={{ mask: '99999-9999999-9' }}
                  mask={"[00000]-[0000000]-[0]"}
                  keyboardType={"numeric"}
                  error={(this.state.controls.nic.value.length < 1 && this.state.controls.nic.valid === false && this.state.isFormValid === false) ? "NIC is Required" : (this.state.controls.nic.valid === false && this.state.isFormValid === false && this.state.controls.nic.value.length > 0) ? 'NIC is incorrect' : null}
                />

                {/* {registration Number} */}
                <InputWithIcon
                  iconName={require('../../../assets/icons/signup/rigestration.png')}
                  onChangeText={(val) => this.onInputChange('registrationNumber', val)}
                  value={this.state.controls.registrationNumber.value}
                  // onFocus={this.onEmailFocusBlur}
                  // onBlur={() => this.onBlur("email")}
                  placeholder={"Registration Number"}
                  error={(this.state.controls.registrationNumber.valid === false && this.state.isFormValid === false) ? "Registration Number is Required" : null}
                />

                {/* {licenseNumber} */}
                <InputWithIcon
                  iconName={require('../../../assets/icons/signup/license.png')}
                  onChangeText={(val) => this.onInputChange('licenseNumber', val)}
                  value={this.state.controls.licenseNumber.value}
                  // onFocus={this.onEmailFocusBlur}
                  // onBlur={() => this.onBlur("email")}
                  placeholder={"License Number (Optional)"}
                // error={(this.state.controls.licenseNumber.valid === false && this.state.isFormValid === false) ? "License Number is Required" : null}
                />

                {/* gender */}
                {/* <View style={{ marginTop: 7 }}>
                  <TextWithStyle>Select Gender</TextWithStyle>
                  <View style={{ flexDirection: 'row', flex: 1, height: 50, marginTop: 5 }}>
                    <TouchableOpacity onPress={() => this.onInputChange('gender', 'Male')} style={[styles.genderButton, { backgroundColor: (this.state.controls.gender.value === 'Male') ? 'rgba(20, 52, 89,1)' : 'rgb(168, 168, 168)' }]}>
                      <TextWithStyle style={{ color: 'white', fontSize: RF(3) }}>Male</TextWithStyle>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onInputChange('gender', 'Female')} style={[styles.genderButton, { backgroundColor: (this.state.controls.gender.value === 'Female') ? 'rgba(20, 52, 89,1)' : 'rgb(168, 168, 168)' }]}>
                      <TextWithStyle style={{ color: 'white', fontSize: RF(3) }}>Female</TextWithStyle>
                    </TouchableOpacity>
                  </View>
                </View> */}

                <View style={[styles.button, { marginTop: 40, marginBottom: 20 }]}>
                  <TouchableOpacity style={{ width: '50%' }} onPress={this.onPageChange}>
                    <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                      <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Next</TextWithStyle>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </React.Fragment>
      )
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
    fontSize: RF(3),
    fontFamily: "Lato-Regular",
    color: 'black'
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },

  nextButton: {
    alignItems: 'center',
    padding: 10,
    width: '100%',
    // backgroundColor: "#143459",
    borderRadius: 8,
  },

  genderButton: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
})

const mapDispatchToProps = (dispatch) => {
  return {
    createUser: (details) => dispatch(createUser(details)),
    checkNumberExist: (number) => dispatch(checkNumberExist(number)),
  }
}

export default connect(null, mapDispatchToProps)(DriverSignUp);