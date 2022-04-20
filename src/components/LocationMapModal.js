import React, { Component } from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from "react-native";
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextWithStyle from './TextWithStyle';

class LocationMapModal extends Component {

    render() {
        return (
            <View>
                <Modal
                    animationType="fade"
                    visible={this.props.modalVisible}
                    onRequestClose={() => this.props.setModalVisible(false)}
                >
                    <View style={styles.container}>
                        <View style={styles.containerView}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={styles.map}
                                initialRegion={{ latitude: 24.9069, longitude: 67.0814, latitudeDelta: 0.005, longitudeDelta: 0.005, }}
                                region={this.props.coordinate}
                                moveOnMarkerPress={true}
                                showsUserLocation={true}
                                onRegionChangeComplete={(e) => { this.props.onMarkerDrag(e) }}
                            >
                            </MapView>

                            <Ionicons name="md-pin" style={{ position: 'absolute', bottom: '50%', left: '47%' }} size={40} color="#143459" />

                            <View style={[styles.button]}>
                                <TouchableOpacity style={{ width: '100%' }} onPress={this.props.setLocation}>
                                    <View style={[styles.nextButton, { backgroundColor: "rgba(20, 52, 89,1)" }]}>
                                        <TextWithStyle style={{ color: 'white', fontSize: 15 }}>Set Location</TextWithStyle>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
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
