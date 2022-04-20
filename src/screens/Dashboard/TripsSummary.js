import React, { useEffect, useState, Fragment } from 'react';
import { ScrollView, View, Dimensions, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { VWGeneralGetStatus, VWGeneralGetTripsData } from '../../../store/actions/dataAction';
import HeaderWithoutDrawer from '../../components/Header/HeaderWithoutDrawer';
import Loader from '../../components/Loader';
import TripCard from '../../../src_mt/components/card/TripCard';
import VWTripCard from '../../components/card/VWTripCard';
import Theme from '../../../src_mt/Theme/Theme';
import LoaderModal from '../../../src_mt/components/modal/LoaderModal';

const TripsSummary = (props) => {
    const [trips, setTrips] = useState([])
    const [MTTrips, setMTTrips] = useState([])
    const [loader, setLoader] = useState(false)
    const { userData } = props

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'today', title: 'Today' },
        { key: 'upcoming', title: 'Upcoming' },
    ]);
    useEffect(() => {
        setLoader(true)
        props.VWGeneralGetTripsData(userData.id).then(trips => {
            updateTripStatus(trips);
        })
        // setJobs_detail();
        return () => { };
    }, [])

    const updateTripStatus = (trips) => {
        props.VWGeneralGetStatus({user_id: userData.id, isMT: true}).then(tripLog => {
            if (tripLog.VWTrips.length > 0) {
                trips.map((trip, index) => {

                    let temp = tripLog.VWTrips.filter((val) => { return val.shift_id === trip.shift_id })
                    // if we get some object after filter then add values on that trip object else do nothing 

                    if (temp.length > 0) {
                        temp = temp[0]
                        let splitIndex = ['Picked', 'ParentLeft', 'Left'].includes(temp.status.split('-vw-')[0]) ? 1 : 0
                        trips[index] = {
                            ...trips[index],
                            status: temp.status,
                            shift_end_time: temp.shift_end_time,
                            splitIndex,
                            pick_time: temp.pick_time,
                            drop_time: temp.drop_time
                        }
                    }
                })
            }

            let todayMTTrips = []
            todayMTTrips = tripLog.MTTrips.filter((singleTrip, index) => {
                if (new Date(singleTrip.departure_date).getDate() == new Date().getDate()) {
                    tripLog.MTTrips.splice(index, 1);
                    return singleTrip
                }
            })
            setTrips([...todayMTTrips, ...trips,])
            setMTTrips(tripLog.MTTrips)
            setLoader(false)
        })
    }

    const initialLayout = { width: Dimensions.get('window').width };

    const TodayTripRoute = () => {
        return (<>
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                {trips.map(trip => (
                    trip.request_id != null ? <TripCard data={{ ...trip, isNew: true }}></TripCard> : <VWTripCard item={trip} />
                ))}
            </ScrollView>


        </>
        )
    }

    const UpcomingTripRoute = () => {
        return (
            <>
                <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                    {MTTrips.map(trip => (
                        <TripCard data={{ ...trip, isNew: false }}></TripCard>
                    ))}
                </ScrollView>
            </>
        )
    }


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: Theme.SECONDARY_COLOR }}
            style={{ backgroundColor: Theme.WHITE_COLOR, color: Theme.SECONDARY_COLOR }}
            activeColor={Theme.SECONDARY_COLOR}
            inactiveColor={Theme.BORDER_COLOR}
        />
    );


    return (

        <Fragment>
            <StatusBar backgroundColor={Theme.SECONDARY_COLOR} barStyle="light-content" />
            <LoaderModal modalVisible={loader} />

            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={SceneMap({
                    today: TodayTripRoute,
                    upcoming: UpcomingTripRoute,
                })}
                onIndexChange={(index) => { setIndex(index); }}
                initialLayout={initialLayout}
            />

        </Fragment >
    )
}

TripsSummary.navigationOptions = {
    headerShown: true,
    headerTitle: "Today/Upcoming Trips",
};

mapStateToProps = (state) => {
    return {
        userData: state.user.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        VWGeneralGetTripsData: (user_id) => dispatch(VWGeneralGetTripsData(user_id)),
        VWGeneralGetStatus: (user_id) => dispatch(VWGeneralGetStatus(user_id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsSummary);