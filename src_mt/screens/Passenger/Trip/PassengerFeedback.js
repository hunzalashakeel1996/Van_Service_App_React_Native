import React, { Fragment, useState, useEffect, Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TouchableOpacity,
    Image, TextInput
} from 'react-native';
import Theme from '../../../Theme/Theme';
import { connect } from 'react-redux';
import Rating from './../../../components/rating/Rating';
import momentDate from './../../../components/time/momentDate';
import { uploadUrl } from '../../../../store/actions/dataAction';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Button from '../../../components/button/Button';
import { postFeedback } from './../../../../store/actions/dataAction';
import Toast from 'react-native-simple-toast';
import TripNameFormat from './../../../components/util/TripNameFormat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Text from '../../../components/text/TextWithStyle';


const PassengerFeedback = (props) => {
    // const [index, setIndex] = React.useState(0);
    const data = props.userData;
    const activity = ["Service", "Navigation", "Conversation", "Driving", "Pickup"];
    const ratingStatus = [`This is a disaster \n Tell us in detail`, `This is a disaster \n Tell us in detail2`, `This is a disaster \n Tell us in detail3`, `Good! \n What did you like the most`, `Awesome! \n What did you like the most`];
    const [selectedActivity, setSelectedActivity] = React.useState(null);
    const [selectedRating, setSelectedRating] = React.useState(0);
    const [review, setReview] = React.useState("");
    const tripDetails = props.route.params?.trip;


    useEffect(() => {
        return () => {
            // console.warn("ScheduleTrip unMount")

            //set params to handle skip button
            props.navigation.setParams({ handleSkipBtn });
        };
    }, [])

    const navigateScreen = (screen, params={}) => {
        props.navigation.navigate(screen, params)
    }

    const handleSkipBtn = () => {
        // props.navigation.goBack();
        navigateScreen("MyTrips");
        console.warn("fdf")
    }

    const submitFeedback = () => {
        let data = {
            trip_id: tripDetails.trip_id,
            driver_id: tripDetails.driver_id,
            user_id: tripDetails.user_id,
            // trip_id: 5,
            // driver_id: 46,
            // user_id: 150,
            rating: selectedRating,
            review: review,
            compliment: selectedActivity,
        }
        props.postFeedback(data).then(data => {
            console.warn(data)
        });
        Toast.show("Thanks for your valuable feedback", Toast.LONG)
        navigateScreen("MyTrips");
    }

    const ActivityBtn = (props) => (<TouchableOpacity
        onPress={() => setSelectedActivity(activity[props.index])}
        style={[styles.activityBtn, selectedActivity === activity[props.index] && { backgroundColor: Theme.BORDER_COLOR_2 }]}>
        <Text style={[styles.activityBtnText, selectedActivity === activity[props.index] && { color: Theme.SECONDARY_COLOR }]}>{activity[props.index]}
        </Text>
    </TouchableOpacity>);

    return (

        <Fragment>
            <StatusBar barStyle="light-content" />
            {/* show a loader when any activity in process */}
            {/* <LoaderModal modalVisible={props.loading} /> */}
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={{ flex: 1 }}>
                    <View style={{ justifyContent: "center", marginHorizontal: 20, marginVertical: 20 }}>
                        <View style={{ alignItems: "center", paddingHorizontal: 5 }}>
                            {data && <Image style={{ width: 100, height: 100, borderRadius: 100 / 2, backgroundColor: Theme.BORDER_COLOR }} source={{ uri: `${uploadUrl}/${tripDetails.profile_picture}` }} />}
                            <Text style={[styles.boldText, { fontSize: Theme.FONT_SIZE_XLARGE, marginTop: 5 }]} numberOfLines={1}>{tripDetails.driver_name}</Text>
                        </View>
                        <View style={{ marginVertical: 10, alignItems: "center", justifyContent: "center", }}>
                            <Rating starCount={5} rating={selectedRating} starSize={50} onPress={(i) => setSelectedRating(i)} />
                            {selectedRating != 0 && <Text style={[styles.boldText, { fontSize: Theme.FONT_SIZE_LARGE, textAlign: "center" }]}>{ratingStatus[selectedRating - 1]}</Text>}
                        </View>
                        <View style={{ height: hp(15), justifyContent: 'center', justifyContent: 'space-evenly' }}>
                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>
                                <ActivityBtn index={0} />
                                <ActivityBtn index={1} />
                                <ActivityBtn index={2} />
                            </View>
                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>
                                <ActivityBtn index={3} />
                                <ActivityBtn index={4} />
                            </View>
                        </View>
                        <View
                            style={{
                                height: hp(15),
                                marginTop: 10,
                                borderWidth: 1,
                                borderColor: Theme.BORDER_COLOR_OPACITY,
                                borderRadius: 5
                            }}>
                            <TextInput
                                style={{}}
                                multiline
                                numberOfLines={4}
                                maxLength={200}
                                onChangeText={text => setReview(text)}
                                placeholder={`Enter your review`}
                                textAlignVertical={'top'}
                            />
                        </View>
                    </View >
                </ScrollView>
                {selectedRating > 0 && <View style={{ height: hp(7), justifyContent: "center", backgroundColor: Theme.WHITE_COLOR, elevation: 5 }}>
                    <Button onPress={() => submitFeedback()} styleButton={{ width: "90%", alignSelf: 'center' }} >Submit</Button>
                </View>}
            </SafeAreaView>
        </Fragment >
    );
}

const styles = StyleSheet.create({
    activityBtn: {
        height: 40,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Theme.BORDER_COLOR_OPACITY
    },
    activityBtnText: {
        fontSize: Theme.FONT_SIZE_MEDIUM,
        color: Theme.BORDER_COLOR,
        textAlign: "center",
    }
});


const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        postFeedback: (data) => dispatch(postFeedback(data)),
        // setUserLogout: () => dispatch(setUserLogout()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PassengerFeedback);