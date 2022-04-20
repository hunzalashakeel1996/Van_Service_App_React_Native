import React, { Component } from 'react';
import { DatePickerAndroid, Alert, Image, Modal, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { childInfo } from '../../../../store/actions/dataAction';
import Loader from '../../../components/Loader';
// import { NavigationEvents } from 'react-navigation';
import TextWithStyle from '../../../components/TextWithStyle';
import Header from '../Parent Profile/Header';
import { connect } from 'react-redux';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';

class SingleChild extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    state = {
        isLoading: true,
        childData: null
    }

    didMount = () => {
        this.props.childInfo(this.props.route.params.id)
            .then(data => {
                this.setState({ childData: data[0], isLoading: false })
            })
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    formatDate = (date) => {
        let dob = date.split('-');
        let month = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return `${dob[2]}-${month[parseInt(dob[1]) - 1]}- ${dob[0]}`
    }

    render() {
        if (this.state.isLoading === false) {
            return (
                <View style={{ flex: 1 }}>
                    {/* <NavigationEvents onDidFocus={() => this.didMount()} /> */}
                    <View style={[styles.headerContainer, { marginBottom: 20 }]} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText={`${this.props.route.params.name} Details`} />
                    </View >

                    <View style={{ flex: 1 }}>
                        <View style={{}}>
                            {this.state.childData.profile_picture ?
                                <View style={{ borderRadius: 50, backgroundColor: '#c4c4c4', alignSelf: 'center' }}>
                                    <Image style={{ borderRadius: 50, width: 70, height: 70, resizeMode: "cover" }} source={{ uri: `${this.props.uploadUrl + this.state.childData.profile_picture}` }} />
                                </View>
                                :
                                <View style={{ borderRadius: 50, backgroundColor: '#14345A', alignSelf: 'center' }}>
                                    <Image source={this.state.childData.gender === 'Male' ? require('../../../../assets/icons/male-child.png') : require('../../../../assets/icons/girl-child.png')} style={{ width: 70, height: 68, }} />
                                </View>
                            }
                        </View>

                        <View style={{ marginHorizontal: 10 }}>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../../../assets/icons/signup/user.png')} style={{ width: 25, height: 25 }} />
                                </View>
                                <View>
                                    <TextWithStyle style={styles.headingText}>Name:</TextWithStyle>
                                    <TextWithStyle style={styles.dataText}>{this.state.childData.name}</TextWithStyle>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../../../assets/icons/signup/cake.png')} style={{ width: 23, height: 23 }} />
                                </View>
                                <View>
                                    <TextWithStyle style={styles.headingText}>DOB:</TextWithStyle>
                                    <TextWithStyle style={styles.dataText}>{this.formatDate(this.state.childData.dob.split('T')[0])}</TextWithStyle>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../../../assets/icons/signup/gender.png')} style={{ width: 25, height: 25 }} />
                                </View>
                                <View>
                                    <TextWithStyle style={styles.headingText}>Gender:</TextWithStyle>
                                    <TextWithStyle style={styles.dataText}>{this.state.childData.gender}</TextWithStyle>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../../../assets/icons/signup/locator.png')} style={{ width: 25, height: 25 }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextWithStyle style={styles.headingText}>Address:</TextWithStyle>
                                    <TextWithStyle style={styles.dataText}>{this.state.childData.address}</TextWithStyle>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../../../assets/icons/signup/mobile-2.png')} style={{ width: 25, height: 25 }} />
                                </View>
                                <View>
                                    <TextWithStyle style={styles.headingText}>Emergency Number:</TextWithStyle>
                                    <TextWithStyle style={styles.dataText}>{this.state.childData.emergency_number}</TextWithStyle>
                                </View>
                            </View>

                        </View>

                        <View style={[styles.button]}>
                            <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.props.navigation.navigate('ChildAttendance', { id: this.state.childData.id, name: this.state.childData.name }) }}>
                                <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                    {/* <Text style={{ color: 'white', fontSize: RF(3.5) }}>Save</Text> */}
                                    <TextWithStyle style={{ fontSize: 18, color: "white" }}>View Trips</TextWithStyle>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <NavigationEvents onDidFocus={() => this.didMount()} /> */}
                    <View style={[styles.headerContainer, { flex: 1 }]} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText={`${this.props.route.params.name} Details`} />
                    </View>
                    <Loader />

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        marginBottom: 20,
        top: 0,
        left: 0,
        zIndex: 100,
    },

    iconContainer: {
        marginRight: 10,
        justifyContent: 'center'
    },

    headingText: {
        fontSize: RF(2.5),
        fontWeight: '400',
        color: "#686969",
        fontFamily: "Lato-Regular"
    },

    dataText: {
        marginTop: 3,
        fontSize: RF(2.5),
        fontWeight: 'normal',
        color: "#143459",
        fontFamily: "Lato-Regular"
    },

    button: {
        flex: 1,
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '50%'
    },

    nextButton: {
        alignItems: 'center',
        padding: 8,
        width: '100%',
        borderRadius: 5,
    },
})

const mapStateToProps = state => {
    return {
        uploadUrl: state.data.uploadUrl,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        childInfo: (id) => dispatch(childInfo(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleChild);