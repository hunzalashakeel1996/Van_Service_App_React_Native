import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';

import { getAccountDetails } from '../../../../store/actions/dataAction';
import TextWithStyle from '../../../components/TextWithStyle';
import Header from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../../../components/Loader';
import HeaderWithoutDrawer from '../../../components/Header/HeaderWithoutDrawer';

class ParentProfile extends Component {
    state = {
        loader: true,
        profilePicture: null
    }

    static navigationOptions = {
        headerShown: false,
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../../../assets/icons/parents.png')}
                style={{ width: 20, height: 20, }}
            />
        )
    };
    
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
           this.didMount()
          });
    }

    didMount = () => {
        // get id of current user and send fetch req to get complete details of current user
        this.setState({ loader: true })
        this.value = this.props.userData
        this.props.getAccountDetails(this.value.id)
            .then(res => {
                this.details = res
                this.setState({ loader: false })
            })
    };

    componentWillUnmount() {
        this._unsubscribe();
      }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    navigateToChangePassword = () => {
        this.props.navigation.navigate('ChangePassword')
    }

    openCamera = () => {
        // More info on all the options is below in the API Reference... just some common use cases shown here
        Alert.alert(
            'Would you like to open Camera or select from Gallery',
            '',
            [
                {
                    text: 'Open Camera', onPress: () => {
                        ImagePicker.openCamera({
                            width: 500,
                            height: 600,
                            includeBase64: true,
                            cropping: true,
                        }).then(image => {
                            this.setState({ profilePicture: { mime: image.mime, data: image.data, path: image.path } })
                        });
                    }
                },
                {
                    text: 'Open Gallery', onPress: () => {
                        ImagePicker.openPicker({
                            width: 500,
                            height: 600,
                            includeBase64: true,
                            cropping: true,
                        }).then(image => {
                            this.setState({ profilePicture: { mime: image.mime, data: image.data, path: image.path } })
                        });
                    }
                },
            ],
            { cancelable: true },
        );
    }

    render() {
        if (this.state.loader === false)
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer} >
                        <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText='My Profile' />
                    </View>

                    <ScrollView style={{ marginLeft: 10, flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                            <View style={{ flex: 0.8, }}>
                                {this.details.profile_picture ?
                                    <View style={{ borderRadius: 50, backgroundColor: '#c4c4c4', alignSelf: 'center', marginTop: 20 }}>
                                        <Image style={{ borderRadius: 50, width: 70, height: 70, resizeMode: "cover" }} source={{ uri: `${this.props.uploadUrl + '/'+ this.details.profile_picture}` }} />
                                    </View>
                                    :
                                    <View style={{ borderRadius: 50, backgroundColor: '#14345A', alignSelf: 'center', marginTop: 20 }}>
                                        <Image style={{ width: 70, height: 68 }} source={require('../../../../assets/icons/parent/parent_profile_icon.png')} />
                                    </View>}
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('EditProfile', { details: this.details }) }}>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 15, }}>Edit</TextWithStyle>
                                </TouchableOpacity >
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../../assets/icons/signup/user.png')} style={{ width: 25, height: 25 }} />
                            </View>
                            <View>
                                <TextWithStyle style={styles.headingText}>Name:</TextWithStyle>
                                <TextWithStyle style={styles.dataText}>{this.details.name}</TextWithStyle>
                            </View>
                        </View>

                        <View style={styles.dataView}>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../../assets/icons/signup/gender.png')} style={{ width: 25, height: 25 }} />
                            </View>
                            <View>
                                <TextWithStyle style={styles.headingText}>Gender:</TextWithStyle>
                                <TextWithStyle style={styles.dataText}>{this.details.gender}</TextWithStyle>
                            </View>
                        </View>

                        {(this.details.email !== null && this.details.email.length > 2) &&
                            <View style={styles.dataView}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../../../assets/icons/signup/email.png')} style={{ width: 25, height: 25 }} />
                                </View>
                                <View>
                                    <TextWithStyle style={styles.headingText}>Email:</TextWithStyle>
                                    <TextWithStyle style={styles.dataText}>{this.details.email}</TextWithStyle>
                                </View>
                            </View>}

                        <View style={styles.dataView}>
                            <View style={[styles.iconContainer]}>
                                <Image source={require('../../../../assets/icons/signup/locator.png')} style={{ width: 25, height: 25 }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextWithStyle style={styles.headingText}>Address:</TextWithStyle>
                                <TextWithStyle style={styles.dataText}>{this.details.address}</TextWithStyle>
                            </View>
                        </View>

                        <View style={styles.dataView}>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../../assets/icons/signup/mobile-2.png')} style={{ width: 25, height: 25 }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextWithStyle style={styles.headingText}>Mobile Number:</TextWithStyle>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <TextWithStyle style={[styles.dataText, { flex: 1 }]}>{this.details.mobile_number}</TextWithStyle>
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 30 }}>
                                        <Ionicons name="md-checkmark-circle" size={20} color="#00a652" style={{ alignSelf: 'center', marginRight: 5 }} />
                                        <TextWithStyle style={{ alignSelf: 'center' }}>Verified</TextWithStyle>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.dataView}>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../../assets/icons/signup/mobile.png')} style={{ width: 25, height: 25 }} />
                            </View>
                            <View>
                                <TextWithStyle style={styles.headingText}>Emergency Number:</TextWithStyle>
                                <TextWithStyle style={styles.dataText}>{this.details.emergency_number}</TextWithStyle>
                            </View>
                        </View>



                        <View style={styles.dataView}>
                            <View style={{ marginRight: 10, justifyContent: 'center' }}>
                                <Image source={require('../../../../assets/icons/signup/passsword.png')} style={{ width: 25, height: 25 }} />
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity onPress={this.navigateToChangePassword}>
                                    <TextWithStyle style={[styles.headingText, { color: "#143459" }]}>Change Password</TextWithStyle>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* <View style={[styles.dataView, { marginBottom: 20 }]}>
                            <View style={{ marginRight: 12, justifyContent: 'center' }}>
                                <Image source={require('../../../../assets/icons/signup/home.png')} style={{ width: 25, height: 25 }} />
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('LocationMap') }}>
                                    <TextWithStyle style={[styles.headingText, { color: "#143459" }]}>Set Home Location</TextWithStyle>
                                </TouchableOpacity>
                            </View>
                        </View> */}

                    </ScrollView>
                </View>
            );
        else
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.headerContainer, { flex: 1 }]} >
                        <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText='My Profile' />
                    </View>
                    <Loader />
                </View>
            )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
    },

    dataView: {
        flexDirection: 'row',
        marginTop: 25
    },

    headingText: {
        fontSize: RF(2.5),
        fontWeight: '400',
        // color: "black",
        fontFamily: "Lato-Regular"
    },

    dataText: {
        marginTop: 3,
        fontSize: RF(2.5),
        fontWeight: 'normal',
        color: "#143459",
        fontFamily: "Lato-Regular"
    },

    iconContainer: {
        marginRight: 10,
        justifyContent: 'center'
    }
})

const mapStateToProps = state => {
    return {
        uploadUrl: state.data.uploadUrl,
        userData: state.user.userData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAccountDetails: (id) => dispatch(getAccountDetails(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParentProfile);