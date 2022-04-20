import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { Image, Keyboard, Platform, StyleSheet, TextInput, TouchableNativeFeedback, View } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { passwordLogin, setDeviceToken } from '../../../store/actions/dataAction';
import { setDriverId } from '../../../store/actions/Map';
import Loader from '../../components/Loader';
import TextWithStyle from '../../components/TextWithStyle';
import { setUserData, setUserJWT } from '../../../store/actions/userAction';
import messaging from '@react-native-firebase/messaging';

class Password extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    state = {
        isLoading: false,
        isKeypadOpen: false,
        controls: {
            password: {
                value: '',
            },
            token: null
        },
        token: null
    }

    componentDidMount = async () => {
        try {
            setTimeout(() => {
                this.TextInput.focus();
            }, 500);
            this.notification()
            this.keyboardDidShowListener = Keyboard.addListener(
                'keyboardDidShow',
                () => { this.setState({ isKeypadOpen: true }) }
            );
            this.keyboardDidHideListener = Keyboard.addListener(
                'keyboardDidHide',
                () => { this.setState({ isKeypadOpen: false }) }
            );
        } catch (err) {
            console.warn(err);
        }
    }

    

    componentWillUnmount() {

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // use to check if a input field is valid or not, key as 'email' or 'password' and value is value of that field 
    onInputChange = (key, value) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                    }
                }
            }
        });
    }

    notification = () => {
        messaging().getToken()
            .then(fcmToken => {
                console.log(fcmToken)
                if (fcmToken)
                    this.setState({ token: fcmToken })
                this.props.onSetDeviceToken({ token: fcmToken })

            })
        // PushNotification.configure({
        //     // (optional) Called when Token is generated (iOS and Android)
        //     onRegister: (token) => {
        //         // save device token to server
        //         if (token) {

        //         }
        //     },

        //     // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
        //     senderID: "540629351078",

        //     // IOS ONLY (optional): default: all - Permissions to register.
        //     permissions: {
        //         alert: true,
        //         badge: true,
        //         sound: true
        //     },
        //     popInitialNotification: true,
        //     requestPermissions: true,
        // })
    }

    // if id is correct then check for password and login user to home page
    onLogin = async () => {
        this.setState({ isLoading: true })

        this.props.passwordLogin(this.props.route.params.number.replace(/^(92+)/g, '0'), this.state.controls.password.value, this.state.token, this.props.navigation)
            .then((token) => {
                if (token.token.error) {
                    this.setState({ isLoading: false })
                    alert(token.token.error)
                }
                else {
                    console.log(token.token)
                    let jsonWebToken = token.token; //Json web token recieve
                    let userData = jsonWebToken;
                    userData.token = this.state.token;
                    // if user want to signup 
                    if (jsonWebToken.number) {
                        this.props.navigation.navigate('ParentSignUp', { data: userData })
                    }
                    else {
                        // save jwt in local storage
                        let decodedJwt = jwtDecode(jsonWebToken)
                        AsyncStorage.setItem('jwt', jsonWebToken).then((val) => {
                            // this.props.onSetUserData(decodedJwt);

                            this.props.setUserData(decodedJwt);
                            this.props.setUserJWT(jsonWebToken);

                            this.props.navigation.navigate('Auth')
                        })
                    }
                }
            })
    }

    render() {
        let { isLoading, isKeypadOpen, controls, token } = this.state

        if (isLoading === false) {
            return (
                <View style={{ backgroundColor: '#143459', alignItems: 'center' }}>
                    <View style={{ height: 120, justifyContent: 'center', alignItems: 'center', paddingTop: Platform.OS == 'ios' ? 25 : 0 }}>
                        <Image
                            source={require('../../../assets/icons/Home-page-logo.png')}
                            style={{ width: 100, height: 100, }}
                        />
                    </View>

                    <View style={[styles.signinContainer, {}]}>
                        <View style={{ width: '90%', marginTop: 30 }}>
                            <TextWithStyle style={[styles.textContainer]}> {this.props.route.params.isNew ? 'Create New Password' : 'Password'}</TextWithStyle>

                            <View style={{ borderBottomWidth: 2, borderBottomColor: '#143459', flexDirection: 'row', borderRadius: 10, paddingVertical: 5 }}>
                                <TextInput ref={(input) => { this.TextInput = input; }} style={{ width: '80%', fontSize: RF(3), marginLeft: 10, color: 'black' }}
                                    onFocus={this.onEmailFocusBlur} onBlur={this.onEmailFocusBlur} secureTextEntry={true} autoFocus={true}
                                    onChangeText={(val) => this.onInputChange('password', val)} underlineColorAndroid={'white'} autoCapitalize={'none'}>
                                </TextInput>
                            </View>
                        </View>

                        {/* login button view */}
                        <View style={[styles.button]}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} onPress={isLoading === false ? this.onLogin : this.onPress} activeOpacity={.5} disabled={!(controls.password.value.length > 5)}>
                                <View style={[styles.loginButton, { backgroundColor: !(controls.password.value.length > 5) ? "rgba(20, 52, 89,.6)" : "rgba(20, 52, 89,1)" }]}>
                                    <TextWithStyle style={{ color: 'white', fontFamily: 'Lato-Regular', fontSize: RF(2.5) }}>
                                        <Ionicons name="arrow-forward-outline" size={24} color="white" />
                                    </TextWithStyle>
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                    </View>
                </View>
            );
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
        marginTop: 25,
        alignItems: 'center',
        width: '100%'
    },

    loginButton: {
        width: RF(8),
        height: RF(8),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        backgroundColor: 'white'
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
        height: '100%',
    },

    codeText: {
        alignSelf: 'center',
        marginLeft: 30,
        fontSize: RF(3.1),
        fontWeight: '600',
        color: 'black',
        marginRight: 5
    },

    headerContainer: {
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
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
        passwordLogin: (number, password, token) => dispatch(passwordLogin(number, password, token)),
        onSetDriverId: (id) => dispatch(setDriverId(id)),
        setUserData: (id) => dispatch(setUserData(id)),
        setUserJWT: (token) => dispatch(setUserJWT(token)),
        onSetDeviceToken: (token) => dispatch(setDeviceToken(token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Password);