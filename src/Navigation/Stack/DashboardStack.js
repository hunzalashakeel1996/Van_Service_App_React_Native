import ChangePassword from '../../screens/Parent/Parent Profile/ChangePassword';
import LocationMap from '../../screens/Parent/Parent Profile/LocationMap';
import ParentProfile from '../../screens/Parent/Parent Profile/ParentProfile';
import Privacy from '../../screens/Parent/privacy/Privacy';
import EditProfile from '../../screens/Parent/Parent Profile/EditProfile';
import HomeDashboard from '../../screens/Dashboard/HomeDashboard';
import Account from '../../screens/Dashboard/Account';
import Help from '../../components/Help';
import PassengerTabs from '../../../src_mt/Navigation/Tab/PassengerTabs';
import HomeParentAppDrawerNavigation from '../Drawer/PassengerDrawer';
import TripsSummary from '../../screens/Dashboard/TripsSummary';
import Theme from '../../../src_mt/Theme/Theme';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import React from 'react'

const Stack = createNativeStackNavigator();

// const parentProfileStack = createNativeStackNavigator ({
//     ParentProfile: { screen: ParentProfile },
//     ChangePassword: { screen: ChangePassword },
//     EditProfile: { screen: EditProfile },
//     LocationMap: { screen: LocationMap }
// });

// const AccountStack = createNativeStackNavigator ({
//     Account: { screen: Account },
//     Privacy: { screen: Privacy },
//     Help: { screen: Help },
//     parentProfileStack: { screen: parentProfileStack }
// });

// const HomeDashboardStack = createNativeStackNavigator ({
//     HomeDashboard: { screen: HomeDashboard },
//     HomeParentApp: { screen: HomeParentAppDrawerNavigation },
//     PassengerApp: { screen: PassengerTabs },
// }, { headerMode: 'none' });


// const DashboardStack = createNativeStackNavigator ({
//     HomeDashboard: { screen: HomeDashboard },
//     HomeParentApp: { screen: HomeParentAppDrawerNavigation },
//     PassengerApp: { screen: PassengerTabs },
//     TripsSummary: { screen: TripsSummary },
//     Account: { screen: AccountStack },
// }, {
//     headerMode: "float",
//     defaultNavigationOptions: {
//         headerShown: false,
//         headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
//         headerTintColor: Theme.WHITE_COLOR,
//         headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
//     }
// });

const parentProfileStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="ParentProfile"
            screenOptions={{ gestureEnabled: false,headerShown: false, }}
            headerMode="float"
            options={{
                        headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
                        headerTintColor: Theme.WHITE_COLOR,
                        headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
            }}
        >
            <Stack.Screen
                name="ParentProfile"
                component={ParentProfile}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
            />
            <Stack.Screen
                name="LocationMap"
                component={LocationMap}
            />
        </Stack.Navigator>
    )
}

const AccountStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Account"
            screenOptions={{ gestureEnabled: false, headerShown: false}}
        >
            <Stack.Screen
                name="Account"
                component={Account}
            />
            <Stack.Screen
                name="Privacy"
                component={Privacy}
            />
            <Stack.Screen
                name="Help"
                component={Help}
            />
            <Stack.Screen
                name="parentProfileStack"
                component={parentProfileStack}
            />
        </Stack.Navigator>
    )
}

const DashboardStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="HomeDashboard"
            screenOptions={{ gestureEnabled: false }} 
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="HomeDashboard"
                component={HomeDashboard}
            />
            <Stack.Screen
                name="HomeParentApp"
                component={HomeParentAppDrawerNavigation}
            /> 
             <Stack.Screen
                name="PassengerApp"
                component={PassengerTabs}
            />
            <Stack.Screen
                name="TripsSummary"
                component={TripsSummary}
            />
             <Stack.Screen
                name="AccountStack"
                component={AccountStack}
            />
        </Stack.Navigator>
    )
}
export default DashboardStack;