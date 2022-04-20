import React, { Component } from 'react';
import { Image, Picker, ScrollView, StyleSheet, TextInput, TimePickerAndroid, TouchableNativeFeedback, TouchableOpacity, View, Alert } from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';

import { setNewTrip } from '../../../../store/actions/dataAction';
import validate from '../../../utilities/validation';
import Header from '../Parent Profile/Header';
import TextWithStyle from '../../../components/TextWithStyle';

class NewTrip extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    state = {
        isFormValid: false,
        isLoading: false,
        controls: {
            schoolName: {
                value: '',
                valid: true,
                validationRules: {
                    isRequired: true,
                }
            },
            schoolAddress: {
                value: '',
                valid: true,
                validationRules: {
                    isRequired: true,
                }
            },
            startTime: {
                value: '',
                valid: true,
                validationRules: {
                    isRequired: true,
                }
            },
            offTime: {
                value: '',
                valid: true,
                validationRules: {
                    isRequired: true,
                }
            },
            class: {
                value: '',
                valid: true,
                validationRules: {
                    isRequired: true,
                }
            },
            title: {
                value: '',
                valid: true,
                validationRules: {
                    isRequired: true,
                }
            },

            age: {
                value: '',
                valid: true,
                validationRules: {
                    isRequired: true,
                }
            }
        }
    }

    onBackButton = () => {
        this.props.navigation.navigate('ChildAttendance', { id: this.props.route.params.id, name: this.props.route.params.name });
    }

    // when value of any input field change this method call
    onInputChange = (key, value, index, ) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(value, this.state.controls[key].validationRules)
                    }
                },
            }
        });
    }

    openTimingClock = async (time) => {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                this.onInputChange(time, `${hour}:${minute}:00`)
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }

    onAddTrip = () => {
        let valid = true
        let objectNames = ['schoolName', 'schoolAddress', 'startTime', 'offTime', 'class', 'title']
        // check each field if valid then create new user else show error to each invalid field and not create new user
        objectNames.map(objectName => {
            let object = this.state.controls[objectName]

            this.setState(prevState => {
                return {
                    controls: {
                        ...prevState.controls,
                        [objectName]: {
                            ...prevState.controls[objectName],
                            valid: validate(object.value, object.validationRules)
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

        if (valid === true) {
            this.setState({ isLoading: true })
            this.props.setNewTrip(this.props.route.params.id, this.state.controls)
                .then((res) => {
                    this.setState({ isLoading: false })
                    if (res.status === 400)
                        Alert.alert('Already Registered', res._bodyInit)
                    else
                        this.onBackButton();
                })
        }
    }

    render() {
        if (this.state.isLoading === false) {
            return (
                <ScrollView>
                    <View>
                        <View style={[styles.headerContainer, { marginBottom: 20 }]} >
                            <Header isDrawer='false' navigateBack={this.onBackButton} headerText={`${this.props.route.params.name} New Trip`} />
                        </View >

                        <View>
                            <View style={{ marginHorizontal: 10 }}>
                                {/* school title field */}
                                <View style={{ width: '100%', borderBottomColor: 'rgb(147, 147, 147)', borderBottomWidth: 1.5, marginBottom: 10 }}>
                                    <Picker
                                        selectedValue={this.state.controls.title.value}
                                        onValueChange={(val) => this.onInputChange('title', val)}
                                        mode={'dropdown'}>
                                        <Picker.Item label="Title" value='' />
                                        <Picker.Item label="School" value="school" />
                                        <Picker.Item label="College" value="college" />
                                        <Picker.Item label="Coaching" value="coaching" />
                                        <Picker.Item label="University" value="university" />
                                    </Picker>

                                    {(this.state.controls.title.valid === false && this.state.isFormValid === false) ?
                                        <TextWithStyle style={{ color: 'red' }}>Title is Required</TextWithStyle> : null
                                    }
                                </View>

                                {/* school name field */}
                                {/* <View >
                  <TextInput style={{ width: '100%', marginBottom: 5 }} onChangeText={(val) => this.onInputChange('age', val)}
                    underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter Child Age' keyboardType={"phone-pad"}>
                  </TextInput>
                  {(this.state.controls.schoolName.valid === false && this.state.isFormValid === false) ?
                    <TextWithStyle style={{ color: 'red' }}>Age is Required</TextWithStyle> : null
                  }
                </View> */}

                                <View >
                                    <TextInput style={{ width: '100%', marginBottom: 5 }} onChangeText={(val) => this.onInputChange('schoolName', val)}
                                        underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter School Name'>
                                    </TextInput>
                                    {(this.state.controls.schoolName.valid === false && this.state.isFormValid === false) ?
                                        <TextWithStyle style={{ color: 'red' }}>School Name is Required</TextWithStyle> : null
                                    }
                                </View>

                                {/* school address field */}
                                <View>
                                    <TextInput style={{ width: '100%', marginBottom: 5 }} onChangeText={(val) => this.onInputChange('schoolAddress', val)}
                                        underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter School Address (name,campus,city,country)' >
                                    </TextInput>
                                    {(this.state.controls.schoolAddress.valid === false && this.state.isFormValid === false) ?
                                        <TextWithStyle style={{ color: 'red' }}>School Address is Required</TextWithStyle> : null
                                    }
                                </View>

                                {/* start time and off time field */}
                                <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15, marginHorizontal: 5, justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={{ flex: 0.45 }} onPress={() => this.openTimingClock('startTime')}>
                                        <TextWithStyle style={{ borderBottomWidth: 1, fontSize: RF(2.4) }}>{this.state.controls.startTime.value ? this.state.controls.startTime.value : 'Enter Start Time'}</TextWithStyle>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 0.45 }} onPress={() => this.openTimingClock('offTime')}>
                                        <TextWithStyle style={{ borderBottomWidth: 1, fontSize: RF(2.4) }}>{this.state.controls.offTime.value ? this.state.controls.offTime.value : 'Enter Off Time'}</TextWithStyle>
                                    </TouchableOpacity>
                                </View>

                                {/* school class field  */}
                                {/* <View>

                  <TextInput style={{ width: '100%', marginBottom: 5 }} onChangeText={(val) => this.onInputChange('class', val)}
                    underlineColorAndroid={'rgb(147, 147, 147)'} placeholder='Enter class' >
                  </TextInput>
                  {(this.state.controls.class.valid === false && this.state.isFormValid === false) ?
                    <TextWithStyle style={{ color: 'red' }}>Class is Required</TextWithStyle> : null
                  }
                </View> */}

                                <View style={{ width: '100%', borderBottomColor: 'rgb(147, 147, 147)', borderBottomWidth: 1.5, marginTop: 5 }}>
                                    <Picker
                                        selectedValue={this.state.controls.class.value}
                                        onValueChange={(val) => this.onInputChange('class', val)}
                                        mode={'dropdown'}>
                                        <Picker.Item label="Class" value='' />
                                        <Picker.Item label="Nursery" value="Nursery" />
                                        <Picker.Item label="prep 1" value="prep 1" />
                                        <Picker.Item label="prep 2" value="prep 2" />
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" />
                                        <Picker.Item label="6" value="6" />
                                        <Picker.Item label="7" value="7" />
                                        <Picker.Item label="8" value="8" />
                                        <Picker.Item label="9" value="9" />
                                        <Picker.Item label="Metric" value="Metric" />
                                    </Picker>

                                    {(this.state.controls.title.valid === false && this.state.isFormValid === false) ?
                                        <TextWithStyle style={{ color: 'red' }}>Class is Required</TextWithStyle> : null
                                    }
                                </View>

                                <View style={[styles.button, { marginTop: 40, marginBottom: 20, }]}>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={this.onAddTrip}>
                                        <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                            <TextWithStyle style={{ color: 'white', fontSize: RF(3.5) }}>Next</TextWithStyle>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: '#143459', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../../../assets/icons/app_icon.png')}
                            style={{ width: 50, height: 50, }}
                        />
                        <Image
                            source={require('../../../../assets/icons/loading2.gif')}
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

})

const mapDispatchToProps = (dispatch) => {
    return {
        setNewTrip: (id, details) => dispatch(setNewTrip(id, details))
    }
}

export default connect(null, mapDispatchToProps)(NewTrip);
