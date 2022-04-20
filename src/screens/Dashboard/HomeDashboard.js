import React, { Component } from 'react';
import { View, StatusBar, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import TextWithStyle from '../../components/TextWithStyle';
import FullLengthButton from '../../components/FullLengthButton';
import { getChilds } from '../../../store/actions/dataAction';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { setChilds } from '../../../store/actions/Map';
import Loader from './../../components/Loader';
// import { connectSocket } from '../../../store/actions/socketAction';

class HomeDashboard extends Component {

    state = {
        isLoading: false
    }

    // componentDidMount = () => {
    //     this.props.connectSocket(this.props.userData.id);
    // }

    // static navigationOptions = {
    //     title: 'Dashboard',
    //     headerStyle: {
    //       backgroundColor: '#14345a',
    //     },
    //     headerTintColor: '#ffff',
    //     headerTitleStyle: {
    //       fontFamily: 'Lato-Regular',
    //     },
    //   };

    //   navigatetToAccount = () => {
    //     this.props.navigation.push('AccountSetting');
    // };
    navigateScreen = (screenName) => {
        this.props.navigation.navigate(screenName)
    }

    // navigateToChildScreen = async () => {
    //     this.setState({isLoading: true})
    //     this.decoded = this.props.userData
    //     this.props.getChilds(this.decoded.id,this.decoded.access).then(data => {
    //         // console.warn(this.decoded.emergency_number)
    //         let id = this.decoded.id
    //         let user_data= {
    //             id: this.decoded.id,
    //             coordinates: this.decoded.coordinates,
    //             // emergency_number: this.decoded.emergency_number
    //         }
    //         // let address = 
    //         this.setState({isLoading: false})
    //         if(data.length <= 0) {
    //             this.props.navigation.navigate('ParentChildSignUp', { user_data });
    //         } else {
    //             this.props.onSetChilds(data);
    //             this.props.navigation.navigate('HomeParentApp')
    //         }
    //     })
    // }


    render() {
        if(!this.state.isLoading){
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="#14345a" />
                <View style={{ height: 55, backgroundColor: '#14345A', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={require('../../../assets/icons/dashboard/dashboard_logo.png')}
                        style={{ width: 150, height: 35, }}
                    />
                </View>

                <View style={{ flex: 0.8 }}>
                    <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <TouchableOpacity style={{ flex: 0.5, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('HomeParentApp')}>
                            {/* <View style={[styles.square]}>
                                <View> */}
                            <Image
                                source={require('../../../assets/icons/dashboard/vanwala-pickdrop.png')}
                                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                            />
                            {/* </View>
                            </View> */}
                            {/* <View style={{borderWidth: 0.3, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, width: '86%', height: 50, justifyContent: 'center'}}>
                            <TextWithStyle style={{ textAlign: 'center', color: 'black', fontSize: 16}}> {`Vanwala School`} </TextWithStyle>
                        </View> */}
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flex: 0.5, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('PassengerApp')} >
                            {/* <View style={[styles.square]}>
                            <View > */}
                            <Image
                                source={require('../../../assets/icons/dashboard/vanwala-trip.png')}
                                style={{ width: '100%', height: '100%',resizeMode: 'contain' }}
                            />
                            {/* </View>
                        </View> */}
                            {/* <View style={{ borderWidth: 0.3, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, width: '86%', height: 50, justifyContent: 'center' }}>
                            <TextWithStyle style={{ textAlign: 'center', color: 'black', fontSize: 15 }}> {`Vanwala Schedule Ride`} </TextWithStyle>
                        </View> */}
                        </TouchableOpacity>
                    </View>
         
                </View>

                <View style={{ flex: 0.2, marginBottom: 10 }}>
                    <TouchableOpacity style={{ width: '100%', marginBottom: 15 }} >
                        <FullLengthButton onPress={() => { this.navigateScreen('TripsSummary') }}>Today/Upcoming Trips</FullLengthButton>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '100%' }} >
                        <FullLengthButton  onPress={() => { this.navigateScreen('AccountStack') }}>Account</FullLengthButton>
                    </TouchableOpacity>
                </View>

            </View>
        )}
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
    square: {
        flex: 0.7,
        // borderWidth: 0.5,
        // flexDirection: 'row',
        width: '87%',
        // height: '50%'
        // backgroundColor: '#878787',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
        borderRadius: 10,
        borderWidth: 1,
        marginRight: 20,
        marginLeft: 15,
        marginVertical:5,
    },
});

HomeDashboard.navigationOptions = {
    headerShown: false,
};

mapStateToProps = (state) => {
    return {
        userData: state.user.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getChilds: (id, access) => dispatch(getChilds(id, access)),
        // connectSocket: (userId, dispatchFunc) => dispatch(connectSocket(userId, dispatchFunc)),
        onSetChilds: (childs) => dispatch(setChilds(childs)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeDashboard);