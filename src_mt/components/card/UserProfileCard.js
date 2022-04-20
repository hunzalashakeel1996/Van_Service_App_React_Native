import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, Switch } from 'react-native';
import Theme from '../../Theme/Theme';
import timeConverter from '../time/timeConverter';
import { formatDatetimeAgo, formatDatetime } from '../time/datetimeConventer';
import Button from '../button/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import currencyFormat from '../currency/currencyFormat';
import TripNameFormat from '../util/TripNameFormat';
import Rating from '../rating/Rating';
import momentDate from '../time/momentDate';
import { connect } from "react-redux";
import { uploadUrl, singleImage, updateUserProfilePicture } from './../../../store/actions/dataAction';
import { setUserData } from './../../../store/actions/userAction';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

const UserProfileCard = (props) => {
    const data = props.data;
    const [loader, setLoader] = useState(false);
    const getImage = () => {
        Alert.alert(
            'Would you like to open Camera or select from Gallery',
            '',
            [
                { text: 'Open Camera', onPress: () => ImagePicker.openCamera(imageOptions).then(image => updateProfilePicture(image)) },
                { text: 'Open Gallery', onPress: () => ImagePicker.openPicker(imageOptions).then(image => updateProfilePicture(image)) },
            ],
            { cancelable: true }
        )

    }

    const imageOptions = {
        mediaType: 'photo',
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 0.8,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
    };

    const updateProfilePicture = (image) => {
        if (image == null) {
            return alert(`Please select image`)
        }
        let formData = new FormData();
        formData.append("user_id", props.userData.id);
        formData.append("type", "profilePicture");
        formData.append("name", props.userData.id);
        formData.append("mt_image", {
            name: `${props.userData.id}${image.mime === "image/png" ? ".png" : ".jpg"}`,
            type: image.mime,
            uri:
                Platform.OS === "android" ? image.path : image.path.replace("file://", "")
        });

        setLoader(true)
        props.singleImage(formData).then(res => {
            let data = {
                id: props.userData.id,
                profilePicture: res.path
            }

            props.updateUserProfilePicture(data).then(res => {
                setLoader(false);
                props.setUserData({ ...props.userData, profile_picture: data.profilePicture })
                Toast.show("Profile Picture Upload Success", Toast.SHORT)
            })
        })
    }

    return (
        <View style={{ height: 120, flexDirection: "row" }}>
            {props.editProfilePic ? <View style={{ flex: 0.3, marginVertical: 10, justifyContent: "center", alignItems: "center" }}>
                {!loader ? <TouchableOpacity onPress={() => getImage()}>

                    <Image style={{ height: 85, width: 85, borderRadius: data.profile_picture != null ? 85 / 2 : 0 }} source={data.profile_picture != null ? { uri: `${uploadUrl}/${data.profile_picture}` } : require("../../../assets/login/userprofile.png")} />
                    <View style={{ position: "absolute", zIndex: 1, alignSelf: "flex-end", justifyContent: "center", alignItems: "center", height: 25, width: 25, borderRadius: 25 / 2, backgroundColor: Theme.SECONDARY_COLOR }}>
                        <Ionicons name={'pencil'} size={15} color={Theme.WHITE_COLOR} />
                    </View>
                </TouchableOpacity> :
                    <View style={{ position: "absolute", justifyContent: "center", height: 85, width: 85, borderRadius: data.profile_picture != null ? 85 / 2 : 0, backgroundColor: Theme.BORDER_COLOR_OPACITY }}>
                        <ActivityIndicator size={"large"} color={Theme.SECONDARY_COLOR} />
                    </View>}
            </View> :
                <View style={{ flex: 0.3, justifyContent: "center", alignItems: "flex-end" }}>
                    {data && <Image style={{ width: 85, height: 85, borderRadius: 85 / 2 }} source={data.profile_picture != null ? { uri: `${uploadUrl}/${data.profile_picture}` } : require("../../../assets/login/userprofile.png")} />}
                </View>}

            <View style={{ flex: 0.7 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 0.05, }}></View>
                    <View style={{ flex: 0.95, justifyContent: "center" }}>
                        <View style={{ flex: 0.2 }}></View>
                        <View style={{ flex: 0.45, justifyContent: "space-between" }}>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between"}}>
                                <Text style={[{ fontSize: Theme.FONT_SIZE_MEDIUM, paddingBottom: 5, color: Theme.RED_COLOR }]}>Hello!</Text>
                                {props.language && <View style={{ flexDirection: 'row', marginRight: 20}}>
                                    <Text style={{ color: 'black'}}>English</Text>
                                    <View>
                                        <Switch value={props.language === 'en' ? false : true} onValueChange={(value) => { props.languageChange(value) }} trackColor={{ false: '#14345A', true: '#14345A' }} thumbColor={'white'}></Switch>
                                    </View>
                                    <Text style={{ color: 'black' }}>Urdu</Text>
                                </View>}
                            </View>
                            <Text style={[styles.boldText, { fontSize: Theme.FONT_SIZE_XLARGE }]} numberOfLines={1}>{data.name}</Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ flex: 0.5, fontSize: Theme.FONT_SIZE_SMALL }}>Joined {momentDate(data.created_at)}</Text>
                            <View style={{ flex: 0.5, flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: Theme.FONT_SIZE_SMALL }}>Verified</Text>
                                <Image style={{ width: 20, height: 20 }} source={require('../../../assets/passenger/telephone.png')} />
                                <Image style={{ width: 20, height: 20 }} source={require('../../../assets/passenger/mail.png')} />
                                <Image style={{ width: 20, height: 20 }} source={require('../../../assets/passenger/facebook.png')} />
                            </View>
                        </View>
                        <View style={{ flex: 0.15 }}></View>
                    </View>
                </View>
            </View>
        </View>
    );
};


const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        singleImage: (data) => dispatch(singleImage(data)),
        updateUserProfilePicture: (data) => dispatch(updateUserProfilePicture(data)),
        setUserData: (data) => dispatch(setUserData(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileCard);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        zIndex: 1
    },
    containerRadius: {
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 5,
    },
    button: {
        width: '100%',
        // height: 45,
        flex: 0.7,
        backgroundColor: Theme.RED_COLOR,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center',
    },

    borderShadow: {
        backgroundColor: Theme.WHITE_COLOR,
        elevation: 5,
    },

    text: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_MEDIUM,
    },
    textSmall: {
        alignSelf: 'center',
        fontSize: Theme.FONT_SIZE_SMALL,
    },
    icon: {
        width: 15,
        height: 15
    },
    boldText: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_MEDIUM,

    },
    boldTextSmall: {
        fontFamily: Theme.FONT_FAMILY_BOLD,
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_SMALL,

    },
    blackText: {
        color: Theme.BLACK_COLOR,
        fontSize: Theme.FONT_SIZE_MEDIUM,
    },
    iconTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
