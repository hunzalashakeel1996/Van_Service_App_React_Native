import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Theme from '../../Theme/Theme';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../../screens/Driver/Home'
import Account from '../../screens/Driver/Account'
import QuotationList from '../../screens/Driver/QuotationList';
import QuotePrice from '../../screens/Driver/QuotePrice';
import MyTrips from '../../screens/Driver/MyTrips';
import BidList from '../../screens/Driver/BidList';
import BidDetails from '../../screens/Driver/BidDetails';
import ConfirmationList from '../../screens/Driver/ConfirmationList';
import ConfirmationDetails from '../../screens/Driver/ConfirmationDetails';
import ContractList from '../../screens/Driver/ContractList';
import ContractDetails from '../../screens/Driver/ContractDetails';
import AvailableJobs from '../../screens/Driver/RideNow/AvailableJobs';
import JobAcceptance from '../../screens/Driver/RideNow/JobAcceptance';
import CustomerPickup from '../../screens/Driver/RideNow/CustomerPickup';
import DropPay from '../../screens/Driver/RideNow/DropPay';
import AccountProfile from '../../screens/Driver/MyAccount/AccountProfile';
import AccountBusinessDocuments from '../../screens/Driver/MyAccount/AccountBusinessDocuments';
import AccountVehicle from '../../screens/Driver/MyAccount/AccountVehicle';
import AccountDrivers from '../../screens/Driver/MyAccount/AccountDrivers';
import AddVehicle from '../../screens/Driver/MyAccount/AddVehicle';
import AddDriver from '../../screens/Driver/MyAccount/AddDriver';
import BusinessDocument from '../../screens/Driver/MyAccount/Documents/BusinessDocument';
import BusinessDocumentFB from '../../screens/Driver/MyAccount/Documents/BusinessDocumentFB';
import ValidOwnerID from '../../screens/Driver/MyAccount/Documents/ValidOwnerID';
import VehicleDocument from '../../screens/Driver/MyAccount/Documents/VehicleDocument';
import AddVehicleDocuments from '../../screens/Driver/MyAccount/AddVehicleDocuments';
import DuringTrip from '../../screens/Driver/Trip/DuringTrip';
import EditVehicle from '../../screens/Driver/MyAccount/EditVehicle';
import Wallet from '../../screens/Payment/Wallet';

const DHomeStack = createNativeStackNavigator();
const DriverHomeStack = () => (
    <DHomeStack.Navigator
        initialRouteName={'DriverHome'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE },
        }}>
        <DHomeStack.Screen name="DriverHome" component={Home} options={{ headerShown: false }} />
        <DHomeStack.Screen name="QuotationList" component={QuotationList} options={{ title: "AVAILABLE JOBS" }} />
        <DHomeStack.Screen name="QuotePrice" component={QuotePrice}
            options={({ route, navigation }) => {
                const { params = {} } = navigation.state;
                return ({
                    title: `${route.params?.confirmations_detail.destination} Trip Confirmation`,
                    headerLeft: (<HeaderBackButton tintColor={Theme.WHITE_COLOR} onPress={params.handleBackBtn} />)
                })
            }} />
        <DHomeStack.Screen name="BidList" component={BidList} options={{ title: "BIDS PLACED" }} />
        <DHomeStack.Screen name="BidDetails" component={BidDetails} options={({ route }) => ({ title: `${route.params?.bids_detail.destination} Trip Bid` })} />
        <DHomeStack.Screen name="ConfirmationList" component={ConfirmationList} options={{ title: "CONFIRMATION" }} />
        <DHomeStack.Screen name="ConfirmationDetails" component={ConfirmationDetails} options={({ route }) => ({ title: `${route.params?.confirmations_detail.destination} Trip Confirmation` })} />
        <DHomeStack.Screen name="ContractList" component={ContractList} options={{ title: "CONTRACT" }} />
        <DHomeStack.Screen name="ContractDetails" component={ContractDetails} options={{ title: "CONTRACT" }} />

        <DHomeStack.Screen name="AvailableJobs" component={AvailableJobs} options={{ title: "AVAILABLE JOBS" }} />
        <DHomeStack.Screen name="JobAcceptance" component={JobAcceptance} options={{ headerShown: false, }} />
        <DHomeStack.Screen name="CustomerPickup" component={CustomerPickup} options={{ headerShown: false, }} />
        <DHomeStack.Screen name="DropPay" component={DropPay} options={{ title: "DROP PAY" }} />
    </DHomeStack.Navigator>)

const TripStack = createNativeStackNavigator();
const DriverTripStack = () => (
    <TripStack.Navigator
        initialRouteName={'MyTrips'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
        }}>
        <TripStack.Screen name="MyTrips" component={MyTrips} options={{ title: "MY TRIPS" }} />
        <TripStack.Screen name="DuringTrip" component={DuringTrip} options={{ title: "TRIP STARTING" }} />
    </TripStack.Navigator>)

const DriverAccStack = createNativeStackNavigator();
const DriverAccountStack = () => (
    <DriverAccStack.Navigator
        initialRouteName={'Account'}
        screenOptions={{
            headerMode: "float",
            headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
            headerTintColor: Theme.WHITE_COLOR,
            headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE },
        }}>
        <DriverAccStack.Screen name="Account" component={Account} options={{ headerShown: false, }} />
        <DriverAccStack.Screen name="AccountProfile" component={AccountProfile} options={{ title: `PROFILE DETAILS`, tabBarVisible: false }} />
        <DriverAccStack.Screen name="AccountBusinessDocuments" component={AccountBusinessDocuments} options={{ title: `BUSINESS DOCUMENTS` }} />
        <DriverAccStack.Screen name="AccountVehicle" component={AccountVehicle} options={{ title: 'VEHICLES' }} />
        <DriverAccStack.Screen name="AddVehicle" component={AddVehicle} options={{ title: `ADD VEHICLE` }} />
        <DriverAccStack.Screen name="AccountDrivers" component={AccountDrivers} options={{ title: 'DRIVERS' }} />
        <DriverAccStack.Screen name="AddDriver" component={AddDriver} options={{ title: `ADD DRIVER` }} />
        <DriverAccStack.Screen name="BusinessDocument" component={BusinessDocument} options={{ title: `UPLOAD DOCUMENT` }} />
        <DriverAccStack.Screen name="BusinessDocumentFB" component={BusinessDocumentFB} options={{ title: `UPLOAD DOCUMENT` }} />
        <DriverAccStack.Screen name="ValidOwnerID" component={ValidOwnerID} options={{ title: `VALID ID OF OWNER` }} />
        <DriverAccStack.Screen name="VehicleDocument" component={VehicleDocument} options={{ title: `UPLOAD DOCUMENT` }} />
        <DriverAccStack.Screen name="AddVehicleDocuments" component={AddVehicleDocuments} options={{ title: `VEHICLE DOCUMENTS` }} />
        <DriverAccStack.Screen name="EditVehicle" component={EditVehicle} options={{ title: `EDIT VEHICLE` }} />
        <DriverAccStack.Screen name="Wallet" component={Wallet} options={{ title: `Wallet` }} />
    </DriverAccStack.Navigator>)

const Tab = createBottomTabNavigator();

const DriverTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                const { name } = route;
                let iconName;
                if (name === 'Home') {
                    iconName = focused ? 'home-sharp' : 'home-sharp';
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
        <Tab.Screen name="Home" component={DriverHomeStack}
            options={({ route }) => {
                const name = getFocusedRouteNameFromRoute(route) ?? 'DriverHome';
                let tabBarStyle = { display: 'none' }; //display=> 'none' remove the tabBar else 'flex'
                if (name === 'DriverHome') { tabBarStyle = { display: 'flex' } }
                return { tabBarStyle }
            }} />
        <Tab.Screen name="My Trips" component={DriverTripStack}
            options={({ route }) => {
                const name = getFocusedRouteNameFromRoute(route) ?? 'MyTrips';
                let tabBarStyle = { display: 'none' };
                if (name === 'MyTrips') { tabBarStyle = { display: 'flex' } }
                return { tabBarStyle }
            }} />
        {/* <Tab.Screen name="Accounts" component={DriverAccountStack}
            options={({ route }) => {
                const name = getFocusedRouteNameFromRoute(route) ?? 'Account';
                let tabBarStyle = { display: 'none' };
                if (name === 'Account') { tabBarStyle = { display: 'flex' } }
                return { tabBarStyle }
            }} /> */}
    </Tab.Navigator>)

// const RideNowStack = createNativeStackNavigator();
// const DriverRideNowStack = () => (
//     <RideNowStack.Navigator
//         initialRouteName={'AvailableJobs'}
//         screenOptions={{
//             headerMode: "float",
//             headerStyle: { backgroundColor: Theme.SECONDARY_COLOR, },
//             headerTintColor: Theme.WHITE_COLOR,
//             headerTitleStyle: { fontSize: Theme.FONT_SIZE_LARGE }
//         }}>
//         {/* <RideNowStack.Screen name="RideNow" component={RideNow}  options={{ title: "RIDE NOW" }}/> */}
//         <RideNowStack.Screen name="AvailableJobs" component={AvailableJobs}  options={{ title: "AVAILABLE JOBS" }}/>
//         <RideNowStack.Screen name="JobAcceptance" component={JobAcceptance}  options={{ headerShown: false, }}/>
//         <RideNowStack.Screen name="CustomerPickup" component={CustomerPickup}  options={{ headerShown: false }}/>
//         <RideNowStack.Screen name="DropPay" component={DropPay} options={{ title: "DROP PAY" }}/>
//     </RideNowStack.Navigator>)

export default DriverTabs;