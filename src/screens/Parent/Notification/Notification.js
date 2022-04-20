import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { getNotifications, getUnseenNotifications } from '../../../../store/actions/dataAction';
import { setUnseenNotifications } from '../../../../store/actions/Map';
import TextWithStyle from '../../../components/TextWithStyle';
import Loader from '../../../components/Loader';
import Header from '../Parent Profile/Header';

class Notification extends Component {
    static navigationOptions = (props) => {
        return {
            headerShown: false,
            drawerIcon: ({ tintColor }) => (
                <View>
                    <Image source={require('../../../../assets/icons/notification.png')} style={{ width: 23, height: 23, }} />
                    {props.screenProps.unseenNotifications > 0 ?
                        <View style={styles.badgeIconView}>
                            <TextWithStyle style={styles.badge}>{props.screenProps.unseenNotifications}</TextWithStyle>
                        </View>
                        : null}
                </View>
            )
        }
    };

    state = {
        isLoading: false,
        notifications: [],
        unseenNotifications: 0
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
           this.didMount()
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
      }

    didMount = async () => {
        this.setState({ isLoading: true })
        this.decoded = this.props.userData

        this.props.getNotifications(this.decoded.id)
            .then(res => {
                this.setState({ notifications: res, isLoading: false })
                this.props.onSetUnseenNotifications(0)
                console.warn(this.state.notifications.length)
            })

        // // database hit to get number of unseen notifications
        // this.props.getUnseenNotifications(this.decoded.id)
        //   .then(res => {
        //     if (res.status === 200) {
        //       this.props.onSetUnseenNotifications(res._bodyInit[0]['unseenNotification'])
        //     }
        //   })
    }

    tConvert = (time) => {
        if (time !== undefined & time !== null) {
            time = time.slice(0, -3)
            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) { // If time format correct
                time = time.slice(1);  // Remove full string match value
                time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours
            }

            return (time.join('')); // return adjusted time or original string
        }
    }

    formatDate = (date) => {
        date = date.split('-')
        return `${date[2]}-${date[1]}-${date[0]}`
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        if (this.state.isLoading === false) {
            return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.headerContainer} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText='Notifications' />
                    </View >

                    <View style={{ flex: 1, backgroundColor: 'white', marginTop: 20 }}>
                        {this.state.notifications.length > 0 ?
                            <FlatList
                                data={this.state.notifications}
                                renderItem={({ item, index }) =>
                                    <View style={styles.notificationContainer}>
                                        <View style={{ flex: 0.15 }}>
                                            <Image source={require('../../../../assets/icons/parent/bell.png')} style={{ width: 38, height: 38, borderRadius: 50, backgroundColor: '#143459', }} />
                                        </View>

                                        <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                            <TextWithStyle style={{ fontSize: wp(4), color: 'black', flex: 1 }}>{item.notify_msg}</TextWithStyle>

                                            <View style={{ flex: 0.45 }}>
                                                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start', }}>
                                                    <Ionicons name="md-time" size={18} color="#143459" />
                                                    <TextWithStyle style={{ marginLeft: 5, alignSelf: 'center', }}>{this.tConvert(item.time.split('T')[1].split('.')[0])}</TextWithStyle>
                                                </View>

                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
                                                    <Ionicons name="md-calendar" size={18} color="#143459" />
                                                    <TextWithStyle style={{ marginLeft: 5, alignSelf: 'center', }}>{this.formatDate(item.time.split('T')[0])}</TextWithStyle>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                }
                                keyExtractor={(index) => JSON.stringify(index)}
                            />
                            :
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../../assets/icons/no_notification.png')} style={{ width: 200, height: 200 }} />
                                </View>

                                <View style={{ flex: 0.2, alignItems: 'center' }}>
                                    <TextWithStyle style={{ fontSize: 20 }}>No message notifications</TextWithStyle>
                                </View>

                                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }} style={{ backgroundColor: '#14345A', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 8 }}>
                                        <TextWithStyle style={{ fontSize: 15, color: 'white' }}>Return to home page</TextWithStyle>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.headerContainer, { flex: 1 }]} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText='Notifications' />
                    </View>
                    <Loader />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: 10,
        backgroundColor: '#ececec',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 0.3
    },

    notificationContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingHorizontal: 5,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: '#EDECED',
        borderRadius: 5,
        marginBottom: 10
    },

    badgeIconView: {
        position: "absolute",
        width: wp("5%"),
        height: wp("5%"),
        borderRadius: 50,
        backgroundColor: "rgb(238,61,60)",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        top: -5,
        left: -5,
    },

    badge: {
        color: '#fff',
        fontSize: 12,
        alignSelf: 'center',
    },

    headerContainer: {
        width: '100%',
        marginBottom: 20,
        top: 0,
        left: 0,
        zIndex: 100,
    },
})

mapStateToProps = (state) => {
    return {
        unseenNotifications: state.map.unseenNotifications,
        userData: state.user.userData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getNotifications: (id) => dispatch(getNotifications(id)),
        onSetUnseenNotifications: (number) => dispatch(setUnseenNotifications(number)),
        getUnseenNotifications: (parent_id) => dispatch(getUnseenNotifications(parent_id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
