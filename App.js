/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';

import React, { Component, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { navigateToNotification, setTopLevelNavigator } from './store/actions/dataAction';
import { setNotificationVisible } from './store/actions/utilAction';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NotificationPopupModal from './src_mt/components/modal/NotificationPopupModal';
import NotifService from './src_mt/NotificationService/NotifService';
import localNotification from './src_mt/components/util/localNotification';
import NoInternetModal from './src_mt/components/modal/NoInternetModal';
import PushNotification from "react-native-push-notification";

// import PassengerTabs from './src_mt/Navigation/Tab/PassengerTabs';

import AuthLoading from './src/screens/AuthLoading/AuthLoading';
import NoInternet from './src/screens/NoInternet/NoInternet';
import HomeParentAppDrawerNavigation from './src/Navigation/Drawer/PassengerDrawer';
import DashboardStack from './src/Navigation/Stack/DashboardStack';
import LoginStack from './src/Navigation/Stack/LoginStack';
import Update from './src/screens/Parent/Home/Update';

import { enableScreens } from 'react-native-screens'
enableScreens()

const App = (props) => {

    useEffect(() => {


        const notif = new NotifService(onNotif)
        return () => {
            console.log("cleaned up");
        };

    }, []);


    const onNotif = (notification) => {
        // if app is not killed and user pressed notificaiton than data of notification is inside notification.data obejct
        // else data is inside notification obejct (there is no data object when app is killed and user open app through notification )
        // console.log('noti', notification)
        let notificationData = null


        if (notification.data)
            notificationData = { ...notification.data }
        else
            notificationData = {
                request_id: notification.request_id,
                driver_id: notification.driver_id ? notification.driver_id : null,
                status: notification.status,
                transaction_notification: notification.transaction_notification,
            }

        if (notificationData.transaction_notification == "true") {
            if (!notification.userInteraction) {

                // console.warn(notificationData)
                if (!notificationData.alert) {
                    let data = {
                        modalVisible: true,
                        title: notification.title,
                        message: notification.message,
                        request_id: notificationData.request_id,
                        driver_id: notificationData.driver_id ? notificationData.driver_id : null,
                        status: notificationData.status,
                        btnText: notificationData.btnText,
                        is_booked: notificationData.is_booked ? notificationData.is_booked : false,
                    }
                    props.setNotificationVisible(data);
                } else {
                    // turn on this if you want to show notification on foreground
                    localNotification(notification.title, notification.message, { ...notificationData, id: "0", tag: notificationData.request_id },notification?.bigPictureUrl)
                }
            }
        } else {
            localNotification(notification.title, notification.message,{}, notification?.bigPictureUrl )
        }
    }

    const Stack = createNativeStackNavigator();

    return (
        <>
            <NavigationContainer ref={navigatorRef => { setTopLevelNavigator(navigatorRef); }}>
                <Stack.Navigator initialRouteName="Auth"
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen name="Auth" component={AuthLoading} />
                    <Stack.Screen name="Dashboard" component={DashboardStack} />
                    <Stack.Screen name="HomeParentApp" component={HomeParentAppDrawerNavigation} />
                    <Stack.Screen name="LoginStack" component={LoginStack} />
                    <Stack.Screen name="NoInternet" component={NoInternet} />
                    <Stack.Screen name="Update" component={Update} />
                </Stack.Navigator>
            </NavigationContainer>

            <NotificationPopupModal
                data={props.notification}
                setModalVisible={isVisible => props.setNotificationVisible(isVisible)}
                navigation={route => props.navigateToNotification(route, { isPress: true, notification: props.notification })}
            />

            <NoInternetModal />
        </>)
}


// const Stack = createNativeStackNavigator({
//     Auth: AuthLoading,
//     // Dashboard: DashboardStack,
//     Dashboard: DashboardStack,
//     HomeParentApp: HomeParentAppDrawerNavigation,
//     AdminDashboard: AdminDashboardDrawerNavigation,
//     Login: LoginStack,
//     // PassengerApp: PassengerTabs,
//     NoInternet: NoInternet
// });


const mapStateToProps = state => {
    return {
        notification: state.util.notification,
        userData: state.user.userData,
        unseenNotifications: state.map.unseenNotifications,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setNotificationVisible: (data) => dispatch(setNotificationVisible(data)),
        navigateToNotification: (route, data) => dispatch(navigateToNotification(route, data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);