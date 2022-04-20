import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Theme from '../../Theme/Theme';

import { Image, View, TouchableOpacity } from 'react-native';
import Text from '../../components/text/TextWithStyle';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../../screens/Passenger/Home'
import ScheduleTrip from '../../screens/Passenger/ScheduleTrip'
import ViewOffers from '../../screens/Passenger/ViewOffers'
import BookDriver from '../../screens/Passenger/BookDriver';
import TripBooked from '../../screens/Passenger/TripBooked';
import MyTrips from '../../screens/Passenger/MyTrips';
import MyTripDetail from '../../screens/Passenger/MyTripDetail';
import Account from '../../screens/Passenger/Account';
import MyConfirmation from '../../screens/Passenger/MyConfirmation';
import DriverConfirmation from '../../screens/Passenger/DriverConfirmation';
import Payment from '../../screens/Payment/Payment';
import Contract from '../../screens/Passenger/Contract';
import DriverList from '../../screens/Passenger/RideNow/DriverList';
import DriverBooking from '../../screens/Passenger/RideNow/DriverBooking';
import DriverOnRoute from '../../screens/Passenger/RideNow/DriverOnRoute';
import PlaceJob from '../../screens/Passenger/RideNow/PlaceJob';
import Billing from '../../screens/Passenger/Billing/Billing';
import BillingTripDetail from '../../screens/Passenger/Billing/BillingTripDetail';
import PassengerDuringTrip from '../../screens/Passenger/Trip/PassengerDuringTrip';
import PassengerFeedback from '../../screens/Passenger/Trip/PassengerFeedback';
import CancellationPolicy from '../../screens/Passenger/CancellationPolicy';
import Wallet from '../../screens/Payment/Wallet';
import DepositPayment from '../../screens/Payment/DepositPayment';


const PStack = createNativeStackNavigator();
const PassengerStack = () => (
    <PStack.Navigator
        initialRouteName={'PassengerHome'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
        }}>
        <PStack.Screen name="PassengerHome" component={Home} options={{ headerShown: false }} />
        <PStack.Screen name="ScheduleTrip" component={ScheduleTrip} options={{ title: "SCHEDULE A TRIP" }} />
        <PStack.Screen name="ViewOffers" component={ViewOffers} options={{ title: "ABOUT THE TRIP" }} />
        <PStack.Screen name="BookDriver" component={BookDriver} options={({ route }) => ({ title: route.params?.segment ? "CONFIRM BOOKING" : "CONFIRMATION DETAIL" })}  />
        <PStack.Screen name="TripBooked" component={TripBooked} options={{ title: "TRIP BOOKED" }} />
    </PStack.Navigator>)

// const PassengerStack = createStackNavigator({
//     PassengerHome: { screen: Home },
//     ScheduleTrip: { screen: ScheduleTrip },
//     ViewOffers: { screen: ViewOffers },
//     BookDriver: { screen: BookDriver },
//     TripBooked: { screen: TripBooked },
// }, {
//     initialRouteName: 'PassengerHome',
//     headerMode: "float",
//     defaultNavigationOptions: {
//         headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
//         headerTintColor: Theme.WHITE_COLOR,
//         headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
//     }
// });

const PTripStack = createNativeStackNavigator();
const PassengerTripStack = () => (
    <PTripStack.Navigator
        initialRouteName={'MyTrips'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
        }}>
        <PTripStack.Screen name="MyTrips" component={MyTrips} options={{ title: "MY TRIPS" }} />
        <PTripStack.Screen name="MyTripDetail" component={MyTripDetail} options={{ title: "TRIP DETAIL" }} />
        <PTripStack.Screen name="ViewOffers" component={ViewOffers} options={{ title: "ABOUT THE TRIP" }}  />
        <PTripStack.Screen name="BookDriver" component={BookDriver} options={({ route }) => ({ title: route.params?.segment ? "CONFIRM BOOKING" : "CONFIRMATION DETAIL" })} />
        <PTripStack.Screen name="TripBooked" component={TripBooked} options={{ title: "TRIP BOOKED" }} />
        <PTripStack.Screen name="MyConfirmation" component={MyConfirmation} options={{ title: "MY CONFIRMATION" }} />
        <PTripStack.Screen name="DriverConfirmation" component={DriverConfirmation} options={{ title: "DRIVER CONFIRMATION" }} />
        <PTripStack.Screen name="Payment" component={Payment} options={{ title: "PAYMENT METHOD" }} />
        <PTripStack.Screen name="Contract" component={Contract} options={{ title: "CONTRACT" }} />
        <PTripStack.Screen name="CancellationPolicy" component={CancellationPolicy} options={{ title: "Cancellation Policy" }} />
        <PTripStack.Screen name="PassengerDuringTrip" component={PassengerDuringTrip} options={{ title: "TRIP START" }} />
    </PTripStack.Navigator>)

// const PassengerTripStack = createStackNavigator({
//     MyTrips: { screen: MyTrips },
//     MyTripDetail: { screen: MyTripDetail },
//     ViewOffers: { screen: ViewOffers },
//     BookDriver: { screen: BookDriver },
//     TripBooked: { screen: TripBooked },
//     MyConfirmation: { screen: MyConfirmation },
//     DriverConfirmation: { screen: DriverConfirmation },
//     Payment: { screen: Payment },
//     Contract: { screen: Contract },
//     CancellationPolicy: { screen: CancellationPolicy },
//     PassengerDuringTrip: { screen: PassengerDuringTrip },
// }, {
//     initialRouteName: 'MyTrips',
//     headerMode: "float",
//     defaultNavigationOptions: {
//         headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
//         headerTintColor: Theme.WHITE_COLOR,
//         headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
//     }
// });

const PRideNowStack = createNativeStackNavigator();
const PassengerRideNowStack = () => (
    <PRideNowStack.Navigator
        initialRouteName={'DriverList'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
        }}>
        <PRideNowStack.Screen name="DriverList" component={DriverList} options={{ title: "AVAILABLE JOBS" }} />
        <PRideNowStack.Screen name="DriverBooking" component={DriverBooking} options={{ title: "CONFIRM BOOKING" }} />
    </PRideNowStack.Navigator>)

// const PassengerRideNowStack = createStackNavigator({
//     DriverList: { screen: DriverList },
//     DriverBooking: { screen: DriverBooking },
// }, {
//     initialRouteName: 'DriverList',
//     headerMode: "float",
//     defaultNavigationOptions: {
//         headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
//         headerTintColor: Theme.WHITE_COLOR,
//         headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
//     }
// });

const PBookStack = createNativeStackNavigator();
const PassengerBookStack = () => (
    <PBookStack.Navigator
        initialRouteName={'PassengerHome'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
        }}>
        <PBookStack.Screen name="PassengerHome" component={PassengerStack} options={{ headerShown: false }} />
        <PBookStack.Screen name="ScheduleTrip" component={ScheduleTrip} options={{ title: "SCHEDULE A TRIP" }} />
        <PBookStack.Screen name="DriverList" component={DriverList} options={{ title: "AVAILABLE JOBS" }} />
        <PBookStack.Screen name="DriverBooking" component={DriverBooking}  options={{ title: "CONFIRM BOOKING" }} />
        <PBookStack.Screen name="DriverOnRoute" component={DriverOnRoute} options={{ headerShown: false, }} />
        <PBookStack.Screen name="PlaceJob" component={PlaceJob} options={{ title: "RIDE NOW" }} />
        <PBookStack.Screen name="PassengerFeedback" component={PassengerFeedback}
            options={({ navigation }) => {
                const { params = {} } = navigation.state;
                return ({
                    title: `${params.trip.destination} Trip Feedback`,
                    headerRight: (
                        <TouchableOpacity onPress={params.handleSkipBtn} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10 }} activeOpacity={0.5}>
                            <Text style={{ color: Theme.WHITE_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, marginRight: 5 }}>{`Skip`}</Text>
                            <Ionicons name={'chevron-forward'} size={18} color={Theme.WHITE_COLOR} />
                            <Ionicons name={'chevron-forward'} size={18} color={Theme.WHITE_COLOR} />
                            <Ionicons name={'chevron-forward'} size={18} color={Theme.WHITE_COLOR} />
                        </TouchableOpacity>),
                })
            }} />
    </PBookStack.Navigator>)

// const PassengerBookStack = createStackNavigator({
//     PassengerHome: { screen: Home },
//     ScheduleTrip: { screen: ScheduleTrip },
//     DriverList: { screen: DriverList },
//     DriverBooking: { screen: DriverBooking },
//     DriverOnRoute: { screen: DriverOnRoute },
//     PlaceJob: { screen: PlaceJob },
//     PassengerFeedback: { screen: PassengerFeedback }
// }, {
//     initialRouteName: 'PassengerHome',
//     // initialRouteName: 'PassengerFeedback',
//     headerMode: "float",
//     defaultNavigationOptions: {
//         headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
//         headerTintColor: Theme.WHITE_COLOR,
//         headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
//     }
// });

const AccStack = createNativeStackNavigator();
const PassengerAccountStack = () => (
    <AccStack.Navigator
        initialRouteName={'Account'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
        }}>
        <AccStack.Screen name="Account" component={Account} options={{ headerShown: false, tabBarVisible: false }} />
        <AccStack.Screen name="Billing" component={Billing} options={{ title: "Billing" }} />
        <AccStack.Screen name="BillingTripDetail" component={BillingTripDetail} options={{ title: "Invoice Screen" }} />
        <AccStack.Screen name="Wallet" component={Wallet} options={{ title: "Wallet" }} />
        <AccStack.Screen name="DepositPayment" component={DepositPayment} options={{ title: "Deposit Cash" }} />
    </AccStack.Navigator>)

// const PassengerAccountStack = createStackNavigator({
//     Account: { screen: Account },
//     Billing: { screen: Billing },
//     BillingTripDetail: { screen: BillingTripDetail },
//     Wallet: { screen: Wallet },
//     DepositPayment: { screen: DepositPayment }
// }, {
//     initialRouteName: 'Account',
//     headerMode: "float",
//     defaultNavigationOptions: {
//         headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
//         headerTintColor: Theme.WHITE_COLOR,
//         headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
//     }
// });

// PassengerTripStack.navigationOptions = ({ navigation }) => {
//     const currentRoute = navigation.state.routes[navigation.state.index];
//     const { routeName } = currentRoute;
//     let tabBarVisible = true;
//     if (routeName === 'PassengerDuringTrip') {
//         tabBarVisible = false;
//     }
//     return {
//         tabBarVisible
//     }
// };

const Tab = createBottomTabNavigator();

const PassengerTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                const { name } = route;
                let iconName;
                if (name === 'Book') {
                    iconName = focused ? 'reader' : 'reader';
                } else if (name === 'My Trips') {
                    iconName = focused ? 'briefcase' : 'briefcase';
                } else if (name === 'Accounts') {
                    iconName = focused ? 'person' : 'person';
                }
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: Theme.SECONDARY_COLOR,
            tabBarInactiveTintColor: Theme.BORDER_COLOR,
        })}>
        <Tab.Screen name="Book" component={PassengerBookStack} />
        <Tab.Screen name="My Trips" component={PassengerTripStack} 
         options={({ route }) => {
            const name = getFocusedRouteNameFromRoute(route) ?? 'PassengerDuringTrip';
            let tabBarStyle = { display: 'flex' };
            if (name === 'PassengerDuringTrip') { tabBarStyle = {display: 'none'} }
            return { tabBarStyle }
        }} />
        {/* <Tab.Screen name="Accounts" component={PassengerAccountStack} /> */}
    </Tab.Navigator>)

// const PassengerTabs = createBottomTabNavigator({
//     'Book': PassengerBookStack,
//     'My Trips': PassengerTripStack,
//     // Accounts: PassengerAccountStack
// },
//     {
//         resetOnBlur: true,
//         defaultNavigationOptions: ({ navigation }) => ({
//             tabBarIcon: ({ focused, horizontal, tintColor }) => {
//                 const { routeName } = navigation.state;
//                 let iconName;
//                 if (routeName === 'Book') {
//                     iconName = focused ? 'reader' : 'reader';
//                 } else if (routeName === 'My Trips') {
//                     iconName = focused ? 'briefcase' : 'briefcase';
//                 } else if (routeName === 'Accounts') {
//                     iconName = focused ? 'person' : 'person';
//                 }
//                 // You can return any component that you like here!
//                 return <Ionicons name={iconName} size={25} color={tintColor} />;
//             },
//             tabBarOptions: {
//                 activeTintColor: Theme.SECONDARY_COLOR,
//                 inactiveTintColor: Theme.BORDER_COLOR,
//             }
//         }),
//     }
// );

export default PassengerTabs;