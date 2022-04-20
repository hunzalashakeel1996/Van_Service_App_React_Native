import React from 'react';
import { connect } from 'react-redux';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, Linking, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { NavigationActions, DrawerNavigator } from 'react-navigation';
// import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import TextWithStyle from "./TextWithStyle";
import AsyncStorage from '@react-native-community/async-storage';
import { DeviceTokenInactive, uploadUrl} from '../../store/actions/dataAction';
import { setUserLogout } from '../../store/actions/userAction';
import { DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

const CustomDrawer = (props) => {
    // delete device token from database of current user when user logged out


    // notification = () => {

    // }

    // chkLogout = () => {
    //     AsyncStorage.getItem("shift").then(values => {
    //         if (values !== null) {
    //             // console.warn(values)
    //             Alert.alert(
    //                 'Alert',
    //                 `You cannot logout when shift is currently in process. Please complete your shift first.`,
    //                 [
    //                     { text: 'Ok', onPress: () => { return null } },
    //                     // { text: 'Confirm', onPress: () => this.logout() },
    //                 ],
    //                 { cancelable: true }
    //             )
    //         } else {
    //             // console.warn(values)
    //             Alert.alert(
    //                 'Log out',
    //                 'Do you want to logout?',
    //                 [
    //                     { text: 'Cancel', onPress: () => { return null } },
    //                     { text: 'Confirm', onPress: () => logout() },
    //                 ],
    //                 { cancelable: false }
    //             )
    //         }
    //     });
    // }

    const chkLogout = () => {
        Alert.alert(
            'Log out',
            'Do you want to logout?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                { text: 'Confirm', onPress: () => logout() },
            ],
            { cancelable: false }
        )
    }

    const logout = () => {
        messaging().getToken()
        .then(fcmToken => {
            console.log('aaaa', fcmToken)
            props.DeviceTokenInactive(fcmToken, props.navigation).then(data => {
                AsyncStorage.clear();
                // props.navigation.navigate("Login");
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [ { name: 'LoginStack' },],
                    })
                );
                props.setUserLogout();
            })
          // if (fcmToken)
            // this.props.onSetDeviceToken(fcmToken)
           
        })
        // PushNotification.configure({
        //     // (optional) Called when Token is generated (iOS and Android)
        //     onRegister: (token) => {
        //         // save device token to server
        //         props.DeviceTokenInactive(token.token, props.navigation).then(data => {
        //             AsyncStorage.clear();
        //             // props.navigation.navigate("Login");
        //             props.navigation.dispatch(
        //                 CommonActions.reset({
        //                     index: 1,
        //                     routes: [ { name: 'LoginStack' },],
        //                 })
        //             );
        //             props.setUserLogout();
        //         })
        //         // this.token = token.token
        //     },
        // })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <View style={styles.drawerHeader} >

                <View style={{ flex: 0.2, justifyContent: "center", marginLeft: 4 }}>
                    <View style={styles.drawerIcon}>
                        {props.userData.profile_picture ?
                            <Image
                                source={{ uri: `${uploadUrl + '/' +props.userData.profile_picture}` }}
                                style={{ width: 50, height: 50, borderRadius: 50 }}
                            />
                            :
                            <Image
                                source={require('./../../assets/icons/app_icon.png')}
                                style={{ width: 40, height: 40, }}
                            />
                        }
                    </View>
                </View>

                <View style={{ flex: 0.8, justifyContent: "center" }}>
                    <TextWithStyle style={styles.headingText}>{props.userData.name}</TextWithStyle>
                </View>

            </View>
            <DrawerContentScrollView  {...props}>
            < DrawerItemList {...props} />

                <ScrollView style={{ flex: 0.5 }}>
                    {props.userData.role !== "A" && <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', marginHorizontal: 17 }}>
                            <Image source={require('./../../assets/icons/star.png')} style={{ width: 24, height: 24, }} />
                        </View>

                        <View>
                            <TouchableOpacity onPress={() => { Linking.openURL(Platform.OS=='ios'?'https://apps.apple.com/pk/app/vanwala/id1562975143' : 'https://play.google.com/store/apps/details?id=com.vanwala') }}>
                                <TextWithStyle style={{ margin: 16, fontSize: 13, color: "black", }}>Rate & Review</TextWithStyle>
                            </TouchableOpacity>
                        </View>
                    </View>}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', marginHorizontal: 17 }}>
                            <Image source={require('./../../assets/icons/logout.png')} style={{ width: 24, height: 24, }} />
                        </View>

                        <View>
                            <TouchableOpacity onPress={() => { chkLogout(); }}>
                                <TextWithStyle style={{ margin: 16, fontSize: 13, color: "black", }}>Logout</TextWithStyle>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </DrawerContentScrollView >
        </SafeAreaView >
    );
};

const mapStateToProps = state => {
    return {
        // userLocation: state.map.userLocation,
        // driverId: state.map.driverId,
        userData: state.user.userData,
        isLoading: state.ui.isLoading,
        url: state.data.url,
        uploadUrl: state.data.uploadUrl,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        DeviceTokenInactive: (token, props) => dispatch(DeviceTokenInactive(token, props)),
        setUserLogout: () => dispatch(setUserLogout()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);

const styles = StyleSheet.create({
    drawerIcon: {
        // height: 45,
        width: "80%",
        borderRadius: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    headingText: {
        marginLeft: "6%",
        fontSize: RF(3),
        color: "white",
        fontFamily: "Lato-Regular"
        // fontFamily: "lato.bold"
    },

    drawerHeader: {
        flex: 0.3,
        flexDirection: "row",
        height: 30,
        justifyContent: "flex-start",
        paddingLeft: 20,
        backgroundColor: '#143459'
    }
});





