import React from 'react';
import { Image, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// ====================================== Parent Imports ==========================================================
// import ChildAttendance from '../../screens/Parent/Children Profile/ChildAttendance';
// import ChildrenProfile from '../../screens/Parent/Children Profile/ChildrenProfile';
// import NewTrip from '../../screens/Parent/Children Profile/NewTrip';
import HomeParent from '../../screens/Parent/Home/HomeParent';
import Update from '../../screens/Parent/Home/Update';
import Notification from '../../screens/Parent/Notification/Notification';
import ChangePassword from '../../screens/Parent/Parent Profile/ChangePassword';
import LocationMap from '../../screens/Parent/Parent Profile/LocationMap';
import ParentProfile from '../../screens/Parent/Parent Profile/ParentProfile';
import Privacy from '../../screens/Parent/privacy/Privacy';
import TodayTrips from '../../screens/Parent/Home/TodayTrips';
import EditProfile from '../../screens/Parent/Parent Profile/EditProfile';
// import AddNewChild from '../../screens/Parent/Children Profile/AddNewChild';
// import SingleChild from '../../screens/Parent/Children Profile/SingleChild';
// ====================================== Common Imports ==========================================================
import CustomDrawer from '../../components/CustomDrawer';
import Help from '../../components/Help';
import Subscription from '../../screens/Parent/Subscription/Subscription';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import Vacation from '../../screens/Parent/Parent Profile/Vacation';
import Fee from '../../screens/Parent/Fee/Fee';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// ============================================ Parent Stacks ====================================================
// const childrenProfileStack = createNativeStackNavigator ({
//     ChildrenProfile: { screen: ChildrenProfile },
//     SingleChild: { screen: SingleChild },
//     ChildAttendance: { screen: ChildAttendance },
//     NewTrip: { screen: NewTrip },
//     AddNewChild: { screen: AddNewChild }
// });

const parentProfileStack = () => {
    return (
        <Stack.Navigator initialRouteName="ParentProfile"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="ParentProfile" component={ParentProfile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="LocationMap" component={LocationMap} />
        </Stack.Navigator>
    )
}
// // const parentProfileStack = createNativeStackNavigator ({
// //     ParentProfile: { screen: ParentProfile },
// //     ChangePassword: { screen: ChangePassword },
// //     EditProfile: { screen: EditProfile },
// //     LocationMap: { screen: LocationMap }
// // });

const homeParentStack = () => {
    return (
        <Stack.Navigator initialRouteName="HomeParent"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="HomeParent" component={HomeParent} />
            <Stack.Screen name="TodayTrips" component={TodayTrips} />
            <Stack.Screen name="Update" component={Update} />
            <Stack.Screen name="Subscription" component={Subscription} />
        </Stack.Navigator>
    )
}
// // const homeParentStack = createNativeStackNavigator ({
// //     HomeParent: { screen: HomeParent },
// //     TodayTrips: { screen: TodayTrips },
// //     Update: { screen: Update },
// //     Subscription: {screen: Subscription}
// // });

const HelpStack = () => {
    return (
        <Stack.Navigator initialRouteName="Help"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Help" component={Help} />
        </Stack.Navigator>
    )
}
// // const HelpStack = createNativeStackNavigator ({
// //     Help: { screen: Help },
// // }, {
// //     initialRouteName: 'Help',
// // });

// ================================================ Parent Drawer =================================================

const HomeParentAppDrawerNavigation = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerLabelStyle: {
                    color: 'black'
                },
                activeTintColor: "#143459",
                iconContainerStyle: {
                    opacity: 1
                },
                headerShown: false
            }}
            drawerContent={props => <CustomDrawer {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={homeParentStack}
                options={{
                    drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/home.png')} style={{ width: 22, height: 22, }} />)
                }}
            />
            <Drawer.Screen
                name="My Profile"
                component={parentProfileStack}
                options={{
                    drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/parents.png')} style={{ width: 25, height: 25, }} />)
                }}
            />
            <Drawer.Screen
                name="Leave/Off days"
                component={Vacation}
                options={{
                    drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/parents.png')} style={{ width: 25, height: 25, }} />)
                }}
            />
            <Drawer.Screen
                name="Fees"
                component={Fee}
                options={{
                    drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/payment.png')} style={{ width: 25, height: 25, }} />)
                }}
            />
            <Drawer.Screen
                name="Notification"
                component={Notification}
                options={{
                    drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/subscription.png')} style={{ width: 25, height: 25, }} />)
                }}
            />
            <Drawer.Screen
                name="Privacy Policy"
                component={Privacy}
                options={{
                    drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/childs.png')} style={{ width: 25, height: 25, }} />)
                }}
            />
            <Drawer.Screen
                name="Need Help?"
                component={HelpStack}
                options={{
                    drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/need-help.png')} style={{ width: 23, height: 23, }} />)
                }}
            />

        </Drawer.Navigator>
    )
}

// const HomeParentAppDrawerNavigation = createDrawerNavigator(
//     {
//         'Home': {
//             screen: homeParentStack,
//             navigationOptions: {
//                 drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/home.png')} style={{ width: 25, height: 25, }} />)
//             }
//         },
//         'My Profile': {
//             screen: parentProfileStack,
//             navigationOptions: {
//                 drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/parents.png')} style={styles.icon} />)
//             }
//         },
//         // 'Subscription': {
//         //     screen: Subscription,
//         //     navigationOptions: {
//         //         drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/subscription.png')} style={styles.icon} />)
//         //     }
//         // },
//         // 'Children Profile': {
//         //     screen: childrenProfileStack,
//         //     navigationOptions: {
//         //         drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/childs.png')} style={styles.icon} />)
//         //     }
//         // },
//         // 'Van Fees': {
//         //     screen: Fee,
//         //     navigationOptions: {
//         //         drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/payment.png')} style={styles.icon} />)
//         //     }
//         // },
//         'Notification ': {
//             screen: Notification,
//             navigationOptions: (props) => {
//                 return {
//                     headerShown: false,
//                 }
//             }

//         },
//         'Privacy Policy ': {
//             screen: Privacy,
//             navigationOptions: {
//                 drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/privacy.png')} style={styles.icon} />)
//             }
//         },
//         'Need Help?': {
//             screen: HelpStack,
//             navigationOptions: {
//                 drawerIcon: ({ tintColor }) => (<Image source={require('../../../assets/icons/need-help.png')} style={{ width: 25, height: 25 }} />)
//             }
//         },
//     },
//     {
//         drawerPosition: "right",
//         drawerLockMode: 'locked-closed',
//         contentComponent: CustomDrawer,
//         contentOptions: {
//             activeTintColor: "#143459",
//             iconContainerStyle: {
//                 opacity: 1
//             }
//         },
//     }
// );

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30,
    },
    badgeIconView: {
        position: "absolute",
        width: wp("4%"),
        height: wp("4%"),
        borderRadius: 50,
        backgroundColor: "rgba(238,61,60,1)",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        top: -5,
        left: -5,
    },

    badge: {
        color: '#fff',
    }
});

export default HomeParentAppDrawerNavigation;