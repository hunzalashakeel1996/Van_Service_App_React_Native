/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    FlatList, Dimensions
} from 'react-native';
import Theme from '../../Theme/Theme';
import Segment from '../../components/segment/Segment';
import TripCard from '../../components/card/TripCard';
import Text from '../../components/text/TextWithStyle';
import { connect } from "react-redux";
import { getMTTrips, retrieveBid } from "../../../store/actions/dataAction";
import LoaderModal from './../../components/modal/LoaderModal';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { convertDatetime } from './../../components/time/datetimeConventer';
import OfferCard from './../../components/card/OfferCard';
import currencyFormat from './../../components/currency/currencyFormat';

const DriverConfirmation = (props) => {

    const [driverConfirmation, setDriverConfirmation] = useState([]);
    const request_details = props.route.params?.request_details;
    const driverConfirmation_detail = props.trips["MT"+request_details.request_id].data.driverConfirmation;
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'active', title: 'Active' },
        { key: 'inactive', title: 'Inactive' },
    ]);
    const [timeCompleted, setTimeCompleted] = useState(false);

    useEffect(() => {
        setDriverConfirmation(driverConfirmation_detail);

        return () => {
            // console.warn("ScheduleTrip unMount")
        };
    }, [])


    const navigateScreen = (screen, data) => {
        props.navigation.navigate(screen, data)
    }

    const payTrip = (item) => {
        navigateScreen("Payment", { item, request_details })
    }

    const needMoreTime = () => {
    }

    //@conf get selected driver confirmation customer time limit
    const calcCustomerTimeLimit = (conf) => {
        return (conf.customer_time_limit * 3600) - (convertDatetime(conf.driver_confirm_at).diff);
    }


    const initialLayout = { width: Dimensions.get('window').width };



    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: Theme.SECONDARY_COLOR }}
            style={{ backgroundColor: Theme.WHITE_COLOR, color: Theme.SECONDARY_COLOR }}
            activeColor={Theme.SECONDARY_COLOR}
            inactiveColor={Theme.BORDER_COLOR}
        />
    );

    const ActiveRoute = () => (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={driverConfirmation}
                renderItem={({ item, index }) => <OfferCard data={{ ...item }} cardButton={() => timeCompleted ? needMoreTime() : payTrip(item)} cardButtonText={timeCompleted ? "Need More Time" : `Pay Now for Php ${currencyFormat(item.payment)}`} customer_time_limit={timeCompleted ? 0 : calcCustomerTimeLimit(item)} timeCompleted={() => { setTimeCompleted(true) }} datetime={item.request_at} index={index} />}
                // renderItem={({ item, index }) => <OfferCard data={{ ...item }} cardButton={() => timeCompleted ? needMoreTime() : payTrip(item)} cardButtonText={timeCompleted ? "Need More Time" : `Pay Now for Php ${currencyFormat(item.payment)}`} customer_time_limit={timeCompleted ? 0 : calcCustomerTimeLimit(item)} timeCompleted={() => { setTimeCompleted(true) }} datetime={item.request_at} index={index} />}
                keyExtractor={item => item.quote_id.toString()}
            />
        </SafeAreaView>
    )

    const InactiveRoute = () => (
        <SafeAreaView style={{ flex: 1 }}>
        </SafeAreaView>
    )

    const renderScene = SceneMap({
        active: ActiveRoute,
        inactive: InactiveRoute,
    });

    return (
        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
            {/* show a loader when any activity in process */}
            {/* <LoaderModal modalVisible={props.loading} /> */}

            <View style={{ flex: 1 }}>
                <TripCard data={{ ...request_details }} showBlock={true} ContainerStyle={{ backgroundColor: Theme.BORDER_COLOR_OPACITY }} />
                <TabView
                    renderTabBar={renderTabBar}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                />

            </View>
        </Fragment >
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
    },
    text: {
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.SECONDARY_COLOR,
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        // backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
        padding: 25,
        borderRadius: 10,
        marginVertical: 5,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        // backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginVertical: 5,
        marginHorizontal: 15,
    },
    backRightBtn: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backLeftBtn: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backRightBtnLeft: {
        backgroundColor: Theme.RED_COLOR,
        left: 0,
    },
    backRightBtnRight: {
        backgroundColor: Theme.SECONDARY_COLOR,
        right: 0,
    },
    controls: {
        alignItems: 'center',
        marginBottom: 30,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: 100,
    },
});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        trips: state.data.trips,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getMTTrips: user_id => dispatch(getMTTrips(user_id)),
        retrieveBid: quote_id => dispatch(retrieveBid(quote_id)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverConfirmation);