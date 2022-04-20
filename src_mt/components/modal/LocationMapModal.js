import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    ActivityIndicator, Platform
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../Theme/Theme';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ButtonBorder from '../../components/button/ButtonBorder';
import Text from './../text/TextWithStyle';


const LocationMapModal = (props) => {

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState([]);
    const [loader, setLoader] = useState(null);
    const [currentSavedLocations, setCurrentSavedLocations] = useState([{
        name: "Set location on map",
        location: props.selectedLocation ? props.selectedLocation : props.coordinate,
        selected: props.selectedLocation ? true : false
    }]);

    let userLoc = props.coordinate;
    let mapDrag = false;
    let myInput = null;
    const currentLoc = {
        name: "Set location on map",
        location: props.coordinate
    }

    const chkUserLocBtnPressed = (e) => {
        return (e.latitude.toFixed(4) == userLoc?.latitude.toFixed(4) && e.longitude.toFixed(4) == userLoc?.longitude.toFixed(4));
    }

    const setUserLoc = (loc) => {
        if (loc.latitude.toFixed(5) == userLoc?.latitude.toFixed(5) && loc.longitude.toFixed(5) == userLoc?.longitude.toFixed(5)) {
            userLoc = loc;
        }
    }

    const searchLocation = (input) => {
        if (input.trim().length >= 2) {
            let radius = 50;
            // let location = `${props.coordinate.latitude},${props.coordinate.longitude}`;
            const loc = props.coordinate != undefined ? `&location=${props.coordinate.latitude},${props.coordinate.longitude}` : '';
            // let components = "country:ph|country:pk";
            let components = "country:pk";
            fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}${loc}&radius=${radius}&components=${components}&key=AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8`)
                .then((response) => response.json())
                .then((responseJson) => {
                    setSearchedLocations(responseJson.predictions);
                })
            // fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${location}&radius=${radius}&components=${components}&key=AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8`)
            //     .then((response) => response.json())
            //     .then((responseJson) => {
            //         setSearchedLocations(responseJson.predictions);
            //     })
        } else {
            setSearchedLocations([]);
        }

    }

    const LocationDetails = (place) => {
        setLoader(place.id);
        let fields = "name,geometry";
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${fields}&key=AIzaSyDFLe5y94aN43o9ag33KfObyNgt_ezdEp8`)
            .then((response) => response.json())
            .then((responseJson) => {
                let loc = { latitude: responseJson.result.geometry.location.lat, longitude: responseJson.result.geometry.location.lng, latitudeDelta: 0.005, longitudeDelta: 0.005 };
                setSelectedLocation({ name: place.structured_formatting.main_text, detailName: place.structured_formatting.secondary_text, location: loc });
                setLoader(null);
            })
    }

    const selectCurrentLocation = (item) => {
        let loc;
        if (item.name === "Set location on map") {
            if (item.selected) {
                let coords = item.location.location.split(","),
                    coordinate = {
                        latitude: JSON.parse(coords[0]),
                        longitude: JSON.parse(coords[1]), latitudeDelta: 0.01, longitudeDelta: 0.01,
                    }
                loc = { name: item.location.name, location: coordinate }
            } else {
                mapDrag = true
                loc = item;
            }
        }
        setSelectedLocation({ name: loc.name, location: loc.location });
    }

    return (
        <View >
            <Modal
                animationType="fade"
                visible={props.modalVisible}
                onRequestClose={() => props.setModalVisible(false)}
                onShow={() => myInput.focus()}
            >
                <View style={[styles.container, {marginTop: Platform.OS=='ios'?35:0}]}>
                    <View style={styles.containerView}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            initialRegion={{ latitude: 24.9355, longitude: 67.0755, latitudeDelta: 0.005, longitudeDelta: 0.005, }}
                            region={selectedLocation ? selectedLocation.location : props.coordinate}
                            moveOnMarkerPress={true}
                            showsUserLocation={true}
                            onRegionChangeComplete={(e) => { props.onMarkerDrag(e), chkUserLocBtnPressed(e) ? mapDrag = true : null }}
                            onPanDrag={(e) => { mapDrag ? null : mapDrag = true }}
                            onUserLocationChange={(e) => setUserLoc(e.nativeEvent.coordinate)}
                        >
                        </MapView>
                        {!selectedLocation && <View style={[styles.map, { backgroundColor: Theme.WHITE_COLOR, }]}>
                            <View style={{ height: 50, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: Theme.BORDER_COLOR_OPACITY, borderRadius: 5, }}>
                                <View style={{ flex: 0.15, alignItems: "center" }}><Ionicons name={"search"} color={Theme.BORDER_COLOR} size={25} /></View>
                                <TextInput
                                    style={{ flex: 0.85, height: 50, fontSize: Theme.FONT_SIZE_LARGE }}
                                    onChangeText={text => searchLocation(text)}
                                    placeholder={props.locationType == "pickupLoc" ? "Pickup Location" : "Drop Off Location"}
                                    ref={(input) => { myInput = input }}
                                    returnKeyType={'search'}
                                />
                            </View>
                            <View style={{}}>
                                {/* list of searched locations */}
                                <FlatList
                                    keyboardShouldPersistTaps={'handled'}
                                    data={searchedLocations}
                                    renderItem={({ item, index }) => <TouchableOpacity onPress={() => LocationDetails(item)} style={{ height: 50, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Theme.BORDER_COLOR_OPACITY }}>
                                        <View style={{ flex: 0.85, justifyContent: "space-evenly", marginHorizontal: 10 }}>
                                            <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM }} numberOfLines={1}>{item.structured_formatting.main_text}</Text>
                                            {item.structured_formatting.secondary_text && <Text style={{ fontSize: Theme.FONT_SIZE_SMALL }} numberOfLines={1}>{item.structured_formatting.secondary_text}</Text>}
                                        </View>
                                        {loader === item.id && <View style={{ flex: 0.15, justifyContent: "center" }}>
                                            <ActivityIndicator color={Theme.SECONDARY_COLOR} />
                                        </View>}
                                    </TouchableOpacity>}
                                    keyExtractor={item => item.id}
                                />

                                {/* saved locations and current location List */}
                                <FlatList
                                    keyboardShouldPersistTaps={'handled'}
                                    data={currentSavedLocations}
                                    renderItem={({ item, index }) => <TouchableOpacity onPress={() => selectCurrentLocation(item)} style={{ height: 50, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Theme.BORDER_COLOR_OPACITY }}>
                                        <View style={{ flex: 0.85, justifyContent: "space-evenly", marginHorizontal: 10 }}>
                                            <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM }} numberOfLines={1}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>}
                                    keyExtractor={index => index}
                                />
                                {searchedLocations.length > 0 && <View style={{ height: 50, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginRight: 10 }}>
                                    <Image
                                        style={{}}
                                        resizeMode='contain'
                                        source={require('../../../assets/google/powered_by_google_on_white.png')}
                                    />
                                </View>}

                            </View>
                        </View>}

                        {selectedLocation && <Ionicons name="pin" style={{ position: 'absolute', bottom: '50%', left: '47%' }} size={40} color={Theme.PRIMARY_COLOR} />}

                        {selectedLocation && <View style={[styles.button]}>
                            <TouchableOpacity style={{ width: '100%' }} onPress={() => props.setLocation(selectedLocation, mapDrag)}>
                                <View style={[styles.nextButton, { backgroundColor: `rgba(${Theme.SECONDARY_COLOR_RGB},1)` }]}>
                                    <Text style={{ color: 'white', fontSize: 15 }}>Set {props.locationType == "pickupLoc" ? "Pickup" : "Drop Off"} Location</Text>
                                </View>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    containerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22
    },
    map: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        position: "absolute",
        alignSelf: 'center',
        bottom: 10,
    },

    nextButton: {
        alignItems: 'center',
        padding: 15,
        width: '100%',
        // backgroundColor: "#143459",
        borderRadius: 10,
    },
});

export default LocationMapModal;
