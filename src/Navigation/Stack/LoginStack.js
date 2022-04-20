import Login from "../../screens/Login/Login";
import Password from "../../screens/Login/Password";
import Verification from "../../screens/Login/Verification";
import LocationMap from "../../screens/Parent/Parent Profile/LocationMap";
import ParentChildSignUp from "../../screens/SignUp/ParentChildSignUp";
import ParentSignUp from "../../screens/SignUp/ParentSignUp";
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import React from 'react'

const Stack = createNativeStackNavigator();
const LoginStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ gestureEnabled: false }}
            headerMode="float"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
            />
            <Stack.Screen
                name="Verification"
                component={Verification}
            />
            <Stack.Screen
                name="Password"
                component={Password}
            />
            <Stack.Screen
                name="ParentSignUp"
                component={ParentSignUp}
            />
            <Stack.Screen
                name="LocationMap"
                component={LocationMap}
            />
        </Stack.Navigator>
    )
}

// const LoginStack = createNativeStackNavigator ({
//     // Login: { screen: Help },
//     Login: { screen: Login },
//     Verification: { screen: Verification },
//     Password: { screen: Password },
//     ParentSignUp: { screen: ParentSignUp },
//     ParentChildSignUp: { screen: ParentChildSignUp },
//     LocationMap: { screen: LocationMap },
// }, { initialRouteName: 'Login', headerMode: "float" });

export default LoginStack;