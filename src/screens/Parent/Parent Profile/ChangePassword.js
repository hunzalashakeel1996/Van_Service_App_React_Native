import React, { Component } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { connect } from 'react-redux';

import { changePassword } from '../../../../store/actions/dataAction';
import HeaderWithoutDrawer from '../../../components/Header/HeaderWithoutDrawer';
import TextWithStyle from '../../../components/TextWithStyle';
import validate from '../../../utilities/validation';
import Toast from 'react-native-simple-toast';

class ChangePassword extends Component {
    state = {
        isLoading: false,
        isCurrentPasswordFocus: false,
        isNewPasswordFocus: false,
        isRetypePasswordFocus: false,
        controls: {
            currentPassword: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                }
            },
            newPassword: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                }
            },
            retypePassword: {
                value: '',
            }
        }
    }

    static navigationOptions = {
        headerShown: false,
    };

    componentDidMount = async () => {
        this.value = this.props.userData
    };

    // use to check if a input field is valid or not, key as 'email' or 'password' and value is value of that field 
    onInputChange = (key, value) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(value, prevState.controls[key].validationRules)
                    }
                }
            }
        });
        if (this.state.controls[key].valid)
            key === 'password' ? this.passwordValidTextColor = 'white' : this.emailValidTextColor = 'white'
    }

    // check if password field is in focus or in blur and show/hide password validate error by changing color of text
    onCurrentPasswordFocusBlur = () => {
        if (this.state.isCurrentPasswordFocus === true) {
            this.setState({ isCurrentPasswordFocus: false });
            if (this.state.controls.currentPassword.valid)
                this.currentPasswordValidTextColor = 'rgba(255, 255, 255,0.0)'
            else
                this.currentPasswordValidTextColor = '#143459'
        }
        else
            this.setState({ isCurrentPasswordFocus: true });
    }

    // check if password field is in focus or in blur and show/hide password validate error by changing color of text
    onNewPasswordFocusBlur = () => {
        if (this.state.isNewPasswordFocus === true) {
            this.setState({ isNewPasswordFocus: false });
            if (this.state.controls.newPassword.valid)
                this.newPasswordValidTextColor = 'rgba(255, 255, 255,0.0)'
            else
                this.newPasswordValidTextColor = '#143459'
        }
        else
            this.setState({ isNewPasswordFocus: true });
    }

    // check if password field is in focus or in blur and show/hide password validate error by changing color of text
    onRetypePasswordBlur = () => {
        if (this.state.isRetypePasswordFocus === false) {
            if (this.state.controls.newPassword.value !== this.state.controls.retypePassword.value)
                this.retypePasswordValidTextColor = '#143459'
            else {
                this.retypePasswordValidTextColor = 'rgba(255, 255, 255,0.0)'
            }
        }
    }

    onUpdate = () => {
        // check condition if both new passoword match and also all fields are valid
        if (this.state.controls.newPassword.value === this.state.controls.retypePassword.value) {
            if (this.state.controls.newPassword.valid && this.state.controls.currentPassword.valid) {
                this.setState({ isLoading: true })

                //hit to server 
                this.props.changePassword(this.value.id, this.state.controls.currentPassword.value, this.state.controls.newPassword.value)
                    .then(res => {
                        if (res.error) {
                            this.setState({ isLoading: false })
                            alert(res.error)
                        }
                        else {
                            Toast.showWithGravity(
                                'Password successfully changed',
                                Toast.SHORT,
                                Toast.CENTER,
                            );
                            this.onNavigateProfileParent()
                        }
                    })
            }
        }
        else
            alert('Password Mismatch')
    }

    onNavigateProfileParent = () => {
        // this.props.navigation.navigate('ParentProfile')
        this.props.navigation.goBack();
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        let { isLoading, isCurrentPasswordFocus, isNewPasswordFocus, isRetypePasswordFocus, controls } = this.state

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer} >
                    <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText='Change Password' />
                </View >

                <View style={styles.fields}>

                    {/* current password text field view */}
                    <View style={{marginBottom: Platform.OS=='ios'? 20:0}}>
                        <TextInput
                            style={Platform.OS == 'ios' && { borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 5 }}
                            placeholder='Current Password'
                            underlineColorAndroid={isCurrentPasswordFocus ? '#143459' : 'grey'}
                            placeholderTextColor={isCurrentPasswordFocus ? '#143459' : 'grey'}
                            onFocus={this.onCurrentPasswordFocusBlur} onBlur={this.onCurrentPasswordFocusBlur}
                            onChangeText={(val) => this.onInputChange('currentPassword', val)} secureTextEntry={true} autoCapitalize={'none'}>
                        </TextInput>
                    </View>

                    {/* new password text field view */}
                    <View style={{ marginTop: 20, marginBottom: Platform.OS=='ios'? 20:0}}>
                        <TextInput
                            style={Platform.OS == 'ios' && { borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 5 }}
                            placeholder='New Password'
                            underlineColorAndroid={isNewPasswordFocus ? '#143459' : 'grey'}
                            placeholderTextColor={isNewPasswordFocus ? '#143459' : 'grey'}
                            onFocus={this.onNewPasswordFocusBlur} onBlur={this.onNewPasswordFocusBlur}
                            onChangeText={(val) => this.onInputChange('newPassword', val)} secureTextEntry={true} autoCapitalize={'none'}>
                        </TextInput>

                        <View style={styles.message}>
                            <TextWithStyle style={{  color: this.newPasswordValidTextColor ? this.newPasswordValidTextColor : 'rgba(255, 255, 255,0.0)', fontSize: 13 }}>Password Length Should be Greater Than 6</TextWithStyle>
                        </View>
                    </View>

                    {/* re-type password text field view */}
                    <View>
                        <TextInput
                            style={Platform.OS == 'ios' && { borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 5 }}
                            placeholder='Re-type New Password'
                            underlineColorAndroid={isRetypePasswordFocus ? '#143459' : 'grey'}
                            placeholderTextColor={isRetypePasswordFocus ? '#143459' : 'grey'}
                            onBlur={this.onRetypePasswordBlur}
                            onChangeText={(val) => this.onInputChange('retypePassword', val)} secureTextEntry={true} autoCapitalize={'none'}>
                        </TextInput>

                        <View style={styles.message}>
                            <TextWithStyle style={{ color: this.retypePasswordValidTextColor ? this.retypePasswordValidTextColor : 'rgba(255, 255, 255,0.0)', fontSize: 13 }}>Password Mismatch</TextWithStyle>
                        </View>
                    </View>
                </View>

                {/* update button view */}
                <View style={styles.button}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={!this.props.isLoading ? this.onUpdate : this.onPress} activeOpacity={.5}>
                        <View style={styles.loginButton}>
                            {isLoading ?
                                <ActivityIndicator size={25} color="white" />
                                :
                                <TextWithStyle style={{ fontSize: 22, color: "white" }}>Update</TextWithStyle>}
                        </View>
                    </TouchableNativeFeedback>
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

    fields: {
        flex: 0.85,
        marginTop: 60,
        margin: 20
    },

    message: {
        marginTop: 5,
        marginLeft: 5,
        flexDirection: 'column',
    },

    button: {
        flex: 0.1,
        alignItems: 'center'
    },

    loginButton: {
        alignItems: 'center',
        padding: 10,
        width: '80%',
        backgroundColor: "#143459",
        borderRadius: 8,
    }
})

mapStateToProps = (state) => {
    return {
        userData: state.user.userData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePassword: (id, password, newPassword) => dispatch(changePassword(id, password, newPassword)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);