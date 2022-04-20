// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { Image, View, Platform } from 'react-native';
import { getBuildNumber } from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import { getAccountDetails, setDeviceToken, setJWT, accountData, getMyTripDetails } from '../../../store/actions/dataAction';
import { setUserData, setUserJWT, setAdditionalDetails, setWalletData } from '../../../store/actions/userAction';
import { setPlatformValue } from '../../../store/actions/utilAction';
import messaging from '@react-native-firebase/messaging';

class AuthLoading extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  // UNSAFE_componentWillMount = () => {
  //   BackgroundGeolocation.checkStatus(status => {
  //     if (status.isRunning) {
  //       BackgroundGeolocation.stop()
  //     }
  //   })
  // }

  componentDidMount = async () => {
    // this.notification();
    try {
      SplashScreen.hide()

      let userToken = await AsyncStorage.getItem('jwt');
      this.props.setPlatformValue(Platform.OS)
      if (userToken === null) {
        this.props.navigation.dispatch(state => {
          return {
            ...CommonActions.reset({
              routes: [
                { name: 'LoginStack' }
              ]
            }),
          }
        });
      } else {
        // important for dataAction
        this.props.onSetJWT(userToken);

        let decodedJwt = jwtDecode(userToken)

        let data = { id: decodedJwt.id, role: decodedJwt.role }
        this.props.accountData(data).then(res => {
          setTimeout(() => {
            this.props.setUserData(res.userData);
            // this.props.setWalletData(res.wallet);
            // this.props.setAdditionalDetails(res.additonalDetails);
            // this.props.getMyTripDetails(data.id);

            // this.props.navigation.navigate('Dashboard')
            // this.props.navigation.navigate('HomeParentApp')
            let screenName = parseInt(getBuildNumber()) < parseInt(res.userData['parent_version'].split('-')[Platform.OS=='ios'?1:0]) ? 'Update' : 'HomeParentApp' 

            this.props.navigation.dispatch(state => {
              return {
                  ...CommonActions.reset({
                      routes: [
                          {name: screenName}
                      ]
                  }),
              }
            });
          }, 1000)
        })
      }
    }
    catch (e) {
      console.log("e", e)
    }
  };

  notification = () => {
    messaging().getToken()
        .then(fcmToken => {
          console.log(fcmToken)
          if (fcmToken)
            this.props.onSetDeviceToken(fcmToken)
           
        })
    // PushNotification.configure({
    //   onRegister: (token) => {
    //     // save device token to server
    //     console.warn('aaa', token)
    //     messaging().getToken()
    //     .then(fcmToken => {
    //       if (fcmToken)
    //         this.props.onSetDeviceToken(fcmToken)
           
    //     })
    //   },

    //   // IOS ONLY (optional): default: all - Permissions to register.
    //   permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true
    //   },

    //   popInitialNotification: true,
    //   requestPermissions: true,
    // })
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#143459', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* <Image
              source={require('../../../../assets/icons/app_icon.png')}
              style={{ width: 50, height: 50, }}
            /> */}

          {/* <Image
            source={require('../../../assets/icons/mtSplashScreen.gif')}
            style={{ height: 560, marginTop: 10 }}
          /> */}
          <Image
            source={require('../../../assets/icons/newLoader.gif')}
            style={{ width: 150, height: 210, marginTop: 10 }}
          />
        </View>

      </View>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    onSetDriverId: (id) => dispatch(setDriverId(id)),
    onSetJWT: (jwt) => dispatch(setJWT(jwt)),
    setUserData: (data) => dispatch(setUserData(data)),
    accountData: (data) => dispatch(accountData(data)),
    setUserJWT: (token) => dispatch(setUserJWT(token)),
    onSetDeviceToken: (token) => dispatch(setDeviceToken(token)),
    getAccountDetails: (id, props) => dispatch(getAccountDetails(id, props)),
    setWalletData: data => dispatch(setWalletData(data)),
    setAdditionalDetails: data => dispatch(setAdditionalDetails(data)),
    getMyTripDetails: user_id => dispatch(getMyTripDetails(user_id)),
    setPlatformValue: (data) => dispatch(setPlatformValue(data)),
  }
}


export default connect(null, mapDispatchToProps)(AuthLoading);
