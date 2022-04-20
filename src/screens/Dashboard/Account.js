import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, Image, Linking, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderWithoutDrawer from '../../components/Header/HeaderWithoutDrawer';
import { connect } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import { DeviceTokenInactive } from '../../../store/actions/dataAction';
import AsyncStorage from '@react-native-community/async-storage';
import { setUserLogout } from '../../../store/actions/userAction';
import TextWithStyle from './../../components/TextWithStyle';
import UserProfileCard from '../../../src_mt/components/card/UserProfileCard';

class Account extends Component {
    state = {}

    static navigationOptions = {
        title: 'Account Setting',
        headerStyle: {
            backgroundColor: '#14345a',
        },
        headerTintColor: '#ffff',
        headerTitleStyle: {
            fontFamily: 'Lato-Regular',
        },
    };

    chkLogout = () => {
        Alert.alert(
            'Log out',
            'Do you want to logout?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                { text: 'Confirm', onPress: () => this.logout() },
            ],
            { cancelable: false }
        )
    }

    logout = () => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: (token) => {
                // save device token to server
                this.props.DeviceTokenInactive(token.token).then(data=>{
                        AsyncStorage.clear();
                        this.props.navigation.navigate("Login");
                        this.props.setUserLogout();
                })
                // this.token = token.token
            },
        })

    }

    navigateScreen = (screenName, props) => {
        this.props.navigation.navigate(screenName)
    }

    render() {
        const {userData, uploadUrl} = this.props
        return (
            <View style={{ flex: 1 }}>
                <View style={{ marginBottom: 20 }}>
                    <HeaderWithoutDrawer headerText={'My Account'} onBack={() => { this.props.navigation.goBack() }} />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0.15, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <UserProfileCard data={this.props.userData} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.itemView]}>
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => this.navigateScreen('parentProfileStack')}>
                                <TextWithStyle style={{ color: "#878787", fontSize: 16, marginLeft: 20 }}>My Profile</TextWithStyle>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                            <Ionicons name={'ios-arrow-forward'} size={25} color={"#14345a"} />
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.itemView]}>
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => this.navigateScreen('Privacy')}>
                                <TextWithStyle style={{ color: "#878787", fontSize: 16, marginLeft: 20 }}>Privacy Policy</TextWithStyle>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                            <Ionicons name={'ios-arrow-forward'} size={25} color={"#14345a"} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.itemView]}>
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => this.navigateScreen('Help')}>
                                <TextWithStyle style={{ color: "#878787", fontSize: 16, marginLeft: 20 }}>Need Help?</TextWithStyle>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                            <Ionicons name={'ios-arrow-forward'} size={25} color={"#14345a"} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.itemView]} onPress={() => {Linking.openURL('https://play.google.com/store/apps/details?id=com.vanwala') }}>
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <TextWithStyle style={{ color: "#878787", fontSize: 16, marginLeft: 20 }}>{`Rate & Review`} </TextWithStyle>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                            <Ionicons name={'ios-arrow-forward'} size={25} color={"#14345a"} />
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={[styles.itemView]} onPress={() => {Linking.openURL('https://play.google.com/store/apps/details?id=com.vanwala') }}>
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <TextWithStyle style={{ color: "#878787", fontSize: 16, marginLeft: 20 }}>Request Account Deletion </TextWithStyle>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                            <Ionicons name={'ios-arrow-forward'} size={25} color={"#14345a"} />
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => { this.chkLogout() }} style={[styles.itemView]}>
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <TextWithStyle style={{ color: "#878787", fontSize: 16, marginLeft: 20 }}>Log Out</TextWithStyle>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: "center", alignItems: "flex-end" }}>
                            <Ionicons name={'ios-arrow-forward'} size={25} color={"#14345a"} />
                        </View>
                    </TouchableOpacity>
                    
                    {/* <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}>
                        <TextWithStyle style={{ color: "#f5c607", fontSize: 16, marginLeft: 20 }}>Happy with My VanWala? Rate Us!</TextWithStyle>
                    </View> */}
                </View >

            </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    itemView: {
        flex: 0.1,
        borderBottomColor: "#878787",
        borderBottomWidth: 1,
        flexDirection: "row",
        marginHorizontal: 20,
    },
    boldText: {
        fontFamily: "Lato-Bold",
        color: '#000000',
    },
});

Account.navigationOptions = {
    headerShown: false
};

mapStateToProps = (state) => {
    return {
        url: state.data.url,
        uploadUrl: state.data.uploadUrl,
        userData: state.user.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        DeviceTokenInactive: (token) => dispatch(DeviceTokenInactive(token)),
        setUserLogout: () => dispatch(setUserLogout()),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Account);
