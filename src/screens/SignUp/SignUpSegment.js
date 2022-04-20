import React, { Component } from 'react';
import {
  Alert, Image, Picker, ScrollView, StyleSheet, Text, TextInput, TimePickerAndroid, TouchableNativeFeedback, TouchableOpacity, View, DatePickerAndroid
} from 'react-native';
import {RFPercentage as RF} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { checkNumberExist, createUser } from '../../../store/actions/dataAction';
import validate from '../../utilities/validation';
import Header from '../Parent/Parent Profile/Header';

class SignUpSegment extends Component {
  //DriverHeader is defined in another js file
  // static navigationOptions = ({ navigation }) => HeaderWithText(navigation, "Create An Account");
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    isFormValid: true,
    objectNames: ['number', 'name', 'email', 'address', 'role',],
    numberOfTrips: [['']],
    page: 1,
    numberOfChilds: [''],
    numberOfTrips: [['']],
    currentChild: 0,
    isLoading: false,
    region: {
      latitude: 67.0755,
      longitude: 24.9355,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    controls: {
      number: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true,
          isNumber: true
        }
      },
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
      address: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true
        }
      },
      role: {
        value: 'P',
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
          isNumber: true
        }
      },
      nic: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true
        }
      },
      licenseNumber: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true
        }
      },
      vanNumber: {
        value: '',
        valid: true,
        validationRules: {
          isRequired: true
        }
      },
      referralCode: {
        value: ''
      },
      gender: {
        value: 'Male',
      },
      childNames: {
        value: [], 
      },
      DOB: {
        value: [],
      },
      childGenders: {
        value: []
      },
      schoolName: {
        value: [['']],
      },
      schoolAddress: {
        value: [['']],
      },
      startTime: {
        value: [['']],
      },
      offTime: {
        value: [['']]
      },
      class: {
        value: [['']],
      },
      title: {
        value: [['']],
      }
    }
  }

  onNavigateStartPage = () => {
    if (this.state.page === 1)
      this.props.navigation.navigate('StartPage');
    else
      this.setState({ page: --this.state.page })
  }

  // when value of any input field change this method call
  onInputChange = (key, value, isArray, index, tripIndex) => {
    let temp;
    // if key is array then change value of index item 
    if (isArray) {
      temp = this.state.controls[key].value
      // if key is for shift information
      tripIndex !== undefined ? temp[index][tripIndex] = value
        : temp[index] = value;
    }

    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          [key]: {
            ...prevState.controls[key],
            value: isArray === true ? temp : value,
            valid: this.state.controls[key].validationRules !== null ? validate(value.trim(), this.state.controls[key].validationRules) : null
          }
        },
      }
    });

    // if number is already exist then alert user during signup form
    if (key === 'number' && value.length === 11) {
      this.props.checkNumberExist(value)
        .then(res => {
          if (res.status === 200) {
            let numberCount = JSON.parse(res._bodyText)
            // if number count is greater than 0 it means number is aready exist and show alert and remove value from form
            if (numberCount[0].number !== 0) {
              Alert.alert('Sorry', 'Number is already exist')
              this.setState(prevState => {
                return {
                  controls: {
                    ...prevState.controls,
                    ['number']: {
                      ...prevState.controls['number'],
                      value: '',
                    }
                  },
                }
              });
            }
          }
        })
    }
  }

  onPageChange = () => {
    valid = true;   // variable to decide whether any field is invalid or all fields are valid
    let temp = this.state.controls.role.value === 'D' ? [...this.state.objectNames, 'nic', 'licenseNumber', 'vanNumber'] : [...this.state.objectNames, 'emergencyNumber']
    this.setState({ objectNames: temp }, () => {
      // check each field if valid then create new user else show error to each invalid field and not create new user
      this.state.objectNames.map(objectName => {
        let object = this.state.controls[objectName]

        this.setState(prevState => {
          return {
            controls: {
              ...prevState.controls,
              [objectName]: {
                ...prevState.controls[objectName],
                valid: validate(object.value.trim(), object.validationRules)
              }
            },
          }
        });
        // if any field is not valid then set form valid to false
        if (!(validate(object.value, object.validationRules))) {
          this.setState({ isFormValid: false });
          if (valid === true)
            valid = false
        }
      })
      // if valid is true then create new user 
      if (valid === true) {
        this.setState({ isLoading: true })
        // check if role is driver then send user to document page else navigate it to login page
        if (this.state.controls.role.value === 'D') {
          this.props.createUser(this.state.controls)
            .then((res) => {
              resp = JSON.parse(res._bodyText)
              this.setState({ isLoading: false })
              if (res.status !== 200)
                alert(JSON.stringify(res._bodyText));
              else
                this.props.navigation.navigate('Documents', { insertId: resp.insertId });
            })
        }
        else
          this.setState({ page: ++this.state.page, isLoading: false })
      }
    })
  }

  // when sign up button pressed
  onSignUp = () => {
    this.setState({ isLoading: true })
    // if valid is true then create new user 
    this.props.createUser(this.state.controls)
      .then((res) => {
        if (res.status === 400) {
          alert(JSON.stringify(res._bodyText));
          this.setState({ isLoading: false })
        }
        else {
          this.setState({ isLoading: false, page: --this.state.page})
          // empty parent or driver fields
          let temp =[...this.state.objectNames, 'nic', 'licenseNumber', 'vanNumber','emergencyNumber', ]
          temp.map(objectName => {
            this.setState(prevState => {
              return {
                controls: {
                  ...prevState.controls,
                  [objectName]: {
                    ...prevState.controls[objectName],
                    value: ''
                  }
                },
              }
            });
          })

          // empty child information fields
          temp = ['childNames','DOB','childGenders','schoolName','schoolAddress','startTime','offTime','class','title']
          temp.map((objectName,index) => {
            this.setState(prevState => {
              return {
                controls: {
                  ...prevState.controls,
                  [objectName]: {
                    ...prevState.controls[objectName],
                    value: index < 3 ? [] : [['']]
                  }
                },
              }
            });
          })
          alert('successfully created')
        }
      })
  }

  // change role according to user
  changeAccountType = (role) => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          'role': {
            ...prevState.controls.role,
            value: role
          }
        },
      }
    });
  }

  openTimingClock = async (time, index, tripIndex) => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this.onInputChange(time, `${hour}:${minute}:00`, true, index, tripIndex)
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  }

  openDate = async (i) => {
    try {
      // open date picker to select starting date
      let { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        mode: 'spinner'
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        month++;
        this.onInputChange('DOB', `${year}-${month}-${day}`, true, i)
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  // when user press on add child button
  onAddChild = () => {
    let temp = this.state.numberOfChilds;
    temp.push('');
    // create every new varaible for new child
    this.setState(prevState => {
      return {
        numberOfChilds: temp,
        numberOfTrips: [...this.state.numberOfTrips, ['']],
        currentChild: temp.length - 1,
        controls: {
          ...prevState.controls,
          schoolName: { value: [...this.state.controls.schoolName.value, ['']] },
          class: { value: [...this.state.controls.class.value, ['']] },
          title: { value: [...this.state.controls.title.value, ['']] },
          schoolAddress: { value: [...this.state.controls.schoolAddress.value, ['']] },
          startTime: { value: [...this.state.controls.startTime.value, ['']] },
          offTime: { value: [...this.state.controls.offTime.value, ['']] }
        },
      }
    })
  }

  render() {
    emergencyNumber = null;
    documents = null;

    // if user select parent or individual for signup
    if (this.state.controls.role.value === 'P' || this.state.controls.role.value === 'I') (
      emergencyNumber = < View >
        <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('emergencyNumber', val)}
          underlineColorAndroid={'rgb(147, 147, 147)'} keyboardType={"phone-pad"} placeholder='Enter Emergency Mobile Number' value={this.state.controls.emergencyNumber.value}>
        </TextInput>

        {(this.state.controls.emergencyNumber.valid === false && this.state.isFormValid === false) ?
          <Text style={{ color: 'red' }}>Please Enter Correct Phone Number</Text> : null
        }
      </View>
    )
    else (
      documents =
      <View>
        <View>
          <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('nic', val)}
            underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter NIC Number' value={this.state.controls.nic.value}>
          </TextInput>
          {(this.state.controls.nic.valid === false && this.state.isFormValid === false) ?
            <Text style={{ color: 'red' }}>NIC is Required</Text> : null
          }
        </View>
        <View>
          <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('licenseNumber', val)}
            underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter License Number' value={this.state.controls.licenseNumber.value}> 
          </TextInput>
          {(this.state.controls.licenseNumber.valid === false && this.state.isFormValid === false) ?
            <Text style={{ color: 'red' }}>License Number is Required</Text> : null
          }
        </View>
        <View>
          <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('vanNumber', val)}
            underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Van Number' value={this.state.controls.vanNumber.value}>
          </TextInput>
          {(this.state.controls.licenseNumber.valid === false && this.state.isFormValid === false) ?
            <Text style={{ color: 'red' }}>Van Number is Required</Text> : null
          }
        </View>
      </View>
    )

    if (this.state.page === 1 && this.state.isLoading === false) {
      return (
        <ScrollView>
          <View>
            <View style={styles.headerContainer} >
              <Header isDrawer='true' openDrawer={() => { this.props.navigation.toggleDrawer() }} headerText='Create An Account' />
            </View >
            {/* role selector header */}
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <TouchableOpacity onPress={() => this.changeAccountType('P')} style={[styles.typeButton, { borderBottomWidth: this.state.controls.role.value === 'P' ? 2 : 0 }]}>
                <Text style={[styles.headerText]}>Parent</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.changeAccountType('D')} style={[styles.typeButton, { borderBottomWidth: this.state.controls.role.value === 'D' ? 2 : 0 }]}>
                <Text style={[styles.headerText]}>Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={(() => this.changeAccountType('I'))} style={[styles.typeButton, { borderBottomWidth: this.state.controls.role.value === 'I' ? 2 : 0 }]}>
                <Text style={[styles.headerText]}>Individual</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 30, marginHorizontal: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.textContainer}>Enter your details to signup with VanWala</Text>
                {/* <Text style={styles.textContainer}>VanWala</Text> */}
              </View>
              {/* mobile number  */}
              <View>
                <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('number', val)}
                  underlineColorAndroid={'rgb(147, 147, 147)'} keyboardType={"phone-pad"} placeholder='Enter Mobile Number' value={this.state.controls.number.value}>
                </TextInput>

                {(this.state.controls.number.valid === false && this.state.isFormValid === false) ?
                  <Text style={{ color: 'red' }}>Please Enter Correct Phone Number</Text> : null
                }
              </View>

              {emergencyNumber}

              {/* name */}
              <View>
                <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('name', val)}
                  underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Name' autoCapitalize='words' value={this.state.controls.name.value}>
                </TextInput>
                {(this.state.controls.name.valid === false && this.state.isFormValid === false) ?
                  <Text style={{ color: 'red' }}>Name is Required</Text> : null
                }
              </View>

              {/* email */}
              <View>
                <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('email', val)}
                  underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Email' value={this.state.controls.email.value}>
                </TextInput>

                {(this.state.controls.email.valid === false && this.state.isFormValid === false) ?
                  <Text style={{ color: 'red' }}>Email is incorrect</Text> : null
                }
              </View>

              {/* address */}
              {/* <View>
              <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('address', val)}
                underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Address'>
              </TextInput>
              {(this.state.controls.address.valid === false && this.state.isFormValid === false) ?
                <Text style={{ color: 'red' }}>address is Required</Text> : null
              }
            </View> */}
              {documents}
              {/* coordinates */}
              <View>
                <TextInput style={{ marginTop: 5, width: '100%' }} onChangeText={(val) => this.onInputChange('address', val)}
                  underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Complete Address' value={this.state.controls.address.value}>
                </TextInput>
                {(this.state.controls.address.valid === false && this.state.isFormValid === false) ?
                  <Text style={{ color: 'red' }}>Address is Required</Text> : null
                }
              </View>

              {/* access
            {this.state.controls.role.value !== 'D' && this.state.controls.role.value !== '' && this.state.controls.role.value !== null ?
              <View style={{ width: '100%', borderBottomColor: 'rgb(147, 147, 147)', borderBottomWidth: 1.5 }}>
                <Picker
                  selectedValue={this.state.controls.access.value}
                  onValueChange={(val) => this.onInputChange('access', val)}
                  mode={'dropdown'}>
                  <Picker.Item label="Access" value='' />
                  <Picker.Item label="Half Access" value="HA" />
                  <Picker.Item label="Full Access" value="FA" />
                </Picker>
              </View>
              : null} */}

              {/* referral code */}
              <View>
                <TextInput style={{ marginTop: 10, width: '100%' }} onChangeText={(val) => this.onInputChange('referralCode', val)}
                  underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Referral Code' value={this.state.controls.referralCode.value}>
                </TextInput>
              </View>

              {/* gender */}
              <View style={{ marginTop: 7 }}>
                <Text>Select Gender</Text>
                <View style={{ flexDirection: 'row', flex: 1, height: 50, marginTop: 5 }}>
                  <TouchableOpacity onPress={() => this.onInputChange('gender', 'Male')} style={[styles.genderButton, { backgroundColor: (this.state.controls.gender.value === 'Male') ? 'rgba(20, 52, 89,1)' : 'rgb(168, 168, 168)' }]}>
                    <Text style={{ color: 'white', fontSize: RF(3) }}>Male</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.onInputChange('gender', 'Female')} style={[styles.genderButton, { backgroundColor: (this.state.controls.gender.value === 'Female') ? 'rgba(20, 52, 89,1)' : 'rgb(168, 168, 168)' }]}>
                    <Text style={{ color: 'white', fontSize: RF(3) }}>Female</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.button, { marginTop: 40, marginBottom: 20 }]}>
                <TouchableOpacity style={{ width: '100%' }} onPress={this.onPageChange}>
                  <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                    <Text style={{ color: 'white', fontSize: RF(3.5) }}>Next</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )
    }
    else if (this.state.isLoading === true) {
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
    else {
      return (
        <ScrollView>
          <View>
            <View style={styles.headerContainer} >
              <Header isDrawer='false' navigateBack={this.onNavigateStartPage} headerText='Child Information' />
            </View >

            <View style={{ marginHorizontal: 10 }}>
              {/* loop through total number of childs user added */}
              {this.state.numberOfChilds.map((single, i) => (
                <View style={{ marginVertical: 20 }}>
                  {/* child name header */}
                  <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { this.setState({ currentChild: i }) }} style={{ paddingHorizontal: 20, flexDirection: 'row' }}>
                      {i !== this.state.currentChild ? <Ionicons name="md-arrow-dropdown" size={20} color="#143459" /> : null}
                      <Text style={{ marginLeft: 10, color: '#143459', fontSize: RF(2.5), fontWeight: i !== this.state.currentChild ? 'bold' : null }}>{this.state.controls.childNames.value[i] ? this.state.controls.childNames.value[i] : `Child # ${i}`}</Text>
                    </TouchableOpacity>
                  </View>

                  {this.state.currentChild === i ?
                    <View>
                      {this.state.controls.role.value === 'P' ?
                        <View>
                          <View>
                            {/* child name field */}
                            <TextInput style={{ width: '100%' }} onChangeText={(val) => this.onInputChange('childNames', val, true, i)} autoCapitalize='words'
                              underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Name' defaultValue={this.state.controls.childNames.value[i] ? this.state.controls.childNames.value[i] : null}>
                            </TextInput>
                            {(this.state.controls.name.valid === false && this.state.isFormValid === false) ?
                              <Text style={{ color: 'red' }}>Name is Required</Text> : null
                            }
                          </View>
                          {/* child age field */}
                          <View>
                            {/* <TextInput style={{ width: '100%' }} onChangeText={(val) => this.onInputChange('DOB', val, true, i)}
                              underlineColorAndroid={'rgb(147, 147, 147)'} keyboardType={"phone-pad"} placeholder='Enter Date of Birth' defaultValue={this.state.controls.DOB.value[i] ? this.state.controls.DOB.value[i] : null} >
                            </TextInput> */}
                            <TouchableOpacity style={{ flex: 0.45, marginVertical: 10 }} onPress={() => this.openDate(i)}>
                              <Text style={{ borderBottomWidth: 1, fontSize: RF(2.4) }}>{this.state.controls.DOB.value[i] ? this.state.controls.DOB.value[i] : 'Enter Date of Birth'}</Text>
                            </TouchableOpacity>
                            {(this.state.controls.name.valid === false && this.state.isFormValid === false) ?
                              <Text style={{ color: 'red' }}>Date of Birth is Required</Text> : null
                            }
                          </View>
                          {/* gender */}
                          <View style={{ marginTop: 7 }}>
                            <Text>Select Gender</Text>
                            <View style={{ flexDirection: 'row', flex: 1, height: 50, marginTop: 5 }}>
                              <TouchableOpacity onPress={() => this.onInputChange('childGenders', 'Male', true, i)} style={[styles.genderButton, { backgroundColor: (this.state.controls.childGenders.value[i] === 'Male') ? 'rgba(20, 52, 89,1)' : 'rgb(168, 168, 168)' }]}>
                                <Text style={{ color: 'white', fontSize: RF(3) }}>Male</Text>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => this.onInputChange('childGenders', 'Female', true, i)} style={[styles.genderButton, { backgroundColor: (this.state.controls.childGenders.value[i] === 'Female') ? 'rgba(20, 52, 89,1)' : 'rgb(168, 168, 168)' }]}>
                                <Text style={{ color: 'white', fontSize: RF(3) }}>Female</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        : null}

                      {/* shift information for each child */}
                      <View style={{ marginTop: 20 }}>
                        <Text style={{ fontWeight: 'bold' }}>Shift Information</Text>
                      </View>

                      {/* iterate over number of trips for each child */}
                      {this.state.numberOfTrips[i].map((single, j) => (
                        <View>
                          {/* trip number header */}
                          <View style={{ justifyContent: 'center', marginTop: 10 }}>
                            <TouchableOpacity >
                              <Text style={{ color: '#143459', fontSize: RF(2.2), fontWeight: 'bold' }}>{`Trip # ${j}`}</Text>
                            </TouchableOpacity>
                          </View>

                          {/* school name field */}
                          <View>
                            <TextInput style={{ width: '100%' }} onChangeText={(val) => this.onInputChange('schoolName', val, true, i, j)}
                              underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter School Name' defaultValue={this.state.controls.schoolName.value[i][j] ? this.state.controls.schoolName.value[i][j] : null}>
                            </TextInput>
                            {(this.state.controls.name.valid === false && this.state.isFormValid === false) ?
                              <Text style={{ color: 'red' }}>Age is Required</Text> : null
                            }
                          </View>

                          {/* school address field */}
                          <View>
                            <TextInput style={{ width: '100%' }} onChangeText={(val) => this.onInputChange('schoolAddress', val, true, i, j)}
                              underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter School Address (campus,city,country)' defaultValue={this.state.controls.schoolAddress.value[i][j] ? this.state.controls.schoolAddress.value[i][j] : null}>
                            </TextInput>
                            {(this.state.controls.name.valid === false && this.state.isFormValid === false) ?
                              <Text style={{ color: 'red' }}>Age is Required</Text> : null
                            }
                          </View>

                          {/* start time and off time field */}
                          <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10, marginHorizontal: 5, flex: 1, justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ flex: 0.45 }} onPress={() => this.openTimingClock('startTime', i, j)}>
                              <Text style={{ borderBottomWidth: 1, fontSize: RF(2.4) }}>{this.state.controls.startTime.value[i][j] ? this.state.controls.startTime.value[i][j] : 'Enter Start Time'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 0.45 }} onPress={() => this.openTimingClock('offTime', i, j)}>
                              <Text style={{ borderBottomWidth: 1, fontSize: RF(2.4) }}>{this.state.controls.offTime.value[i][j] ? this.state.controls.offTime.value[i][j] : 'Enter Off Time'}</Text>
                            </TouchableOpacity>
                          </View>

                          {/* school class field  */}
                          <View>
                            <TextInput style={{ width: '100%' }} onChangeText={(val) => this.onInputChange('class', val, true, i, j)}
                              underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter class' defaultValue={this.state.controls.class.value[i][j] ? this.state.controls.class.value[i][j] : null}>
                            </TextInput>
                            {(this.state.controls.name.valid === false && this.state.isFormValid === false) ?
                              <Text style={{ color: 'red' }}>Age is Required</Text> : null
                            }
                          </View>

                          {/* school title field */}
                          <View style={{ width: '100%', borderBottomColor: 'rgb(147, 147, 147)', borderBottomWidth: 1.5 }}>
                            <Picker
                              selectedValue={this.state.controls.title.value[i][j]}
                              onValueChange={(val) => this.onInputChange('title', val, true, i, j)}
                              mode={'dropdown'}>
                              <Picker.Item label="Title" value='' />
                              <Picker.Item label="School" value="school" />
                              <Picker.Item label="College" value="college" />
                              <Picker.Item label="Coaching" value="coaching" />
                              <Picker.Item label="University" value="university" />
                            </Picker>
                          </View>
                        </View>
                      ))}

                      {/* add new trip button */}
                      <View style={{ alignItems: 'flex-end', marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => { let temp = this.state.numberOfTrips; temp[i].push(''); this.setState({ numberOfTrips: temp }) }}>
                          <Text style={[styles.headerText, { fontSize: RF(2.5), color: '#143459' }]}>+ Add trip</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    : null}
                </View>
              ))}

              {/* add new child button */}
              <View style={{ alignItems: 'flex-end', marginVertical: 10 }}>
                <TouchableOpacity onPress={this.onAddChild}>
                  <Text style={[styles.headerText, { fontSize: RF(2.5), color: '#143459' }]}>+ Add Child</Text>
                </TouchableOpacity>
              </View>

              {/* sign up button */}
              <View style={[styles.button, { marginTop: 40, marginBottom: 20 }]}>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={this.onSignUp}>
                  <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                    <Text style={{ color: 'white', fontSize: RF(3.5) }}>Sign Up</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>

            </View>
          </View>
        </ScrollView>
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
    fontSize: RF(2.5),
    fontFamily: "Lato-Regular"
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },

  nextButton: {
    alignItems: 'center',
    padding: 15,
    width: '100%',
    // backgroundColor: "#143459",
    borderRadius: 10,
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

export default connect(null, mapDispatchToProps)(SignUpSegment);