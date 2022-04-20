import React, { Component } from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Theme from "../../Theme/Theme";
import Text from './../../components/text/TextWithStyle';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

const GooglePlacesInput = (props) => {
    return (
        <View>
            <Modal
                animationType="fade"
                visible={props.modalVisible}
                onRequestClose={() => props.setModalVisible(false)}
            >
                <View style={styles.container}>
                    <View style={styles.containerView}>
                        <Text>{JSON.stringify(props.coordinate)}</Text>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            minLength={2} // minimum length of text to search
                            autoFocus={true}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            listViewDisplayed='auto'    // true/false/undefined
                            fetchDetails={true}
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            }}

                            getDefaultValue={() => ''}

                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: '',
                                language: 'en', // language of the results
                                // types: 'geocode', // default: 'geocode'
                                location: {latitude : `${props.coordinate.latitude}`, longitude: `${props.coordinate.longitude}`},
                                components: "country:pk|country:ph",
                                fields: ['name', "geometry"]
                            }}

                            //   styles={{
                            //     textInputContainer: {
                            //       width: '100%'
                            //     },
                            //     description: {
                            //       fontWeight: 'bold'
                            //     },
                            //     predefinedPlacesDescription: {
                            //       color: '#1faadb'
                            //     }
                            //   }}
                            styles={{
                                textInputContainer: {
                                    // backgroundColor: 'rgba(0,0,0,0)',
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                    // marginLeft: 20,
                                    paddingHorizontal: 10,
                                    // marginHorizontal: 10,
                                    // borderRadius: 5,
                                    height: 54,
                                },
                                textInput: {
                                    // marginLeft: 0,
                                    // marginRight: 0,
                                    height: 40,
                                    color: '#5d5d5d',
                                    fontSize: 16
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                },
                            }}

                            // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                            // currentLocationLabel="Current location"
                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            // GoogleReverseGeocodingQuery={{
                            //     // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            // }}
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                // rankby: 'distance',
                                // types: 'food',
                                fields: ['name', "geometry"]
                            }}

                            // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                            predefinedPlaces={[homePlace, workPlace]}

                            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                            //   renderLeftButton={()  => <Image source={require('../../../assets/passenger/from.png')} />}
                            renderLeftButton={() => <Ionicons name="search" size={30} color={Theme.BORDER_COLOR} style={{ alignSelf: "center" }} />}
                        // renderRightButton={() => <Text>Custom text after the input</Text>}
                        />
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
        // backgroundColor: "rgba(0,0,0,0.5)"
    },
    containerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22
    },
});

export default GooglePlacesInput;
