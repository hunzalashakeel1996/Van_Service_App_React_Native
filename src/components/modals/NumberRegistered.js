import React, { Component } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, Image, Linking, TouchableOpacity } from 'react-native';
import TextWithStyle from '../TextWithStyle';

const NumberRegistered = (props) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.isParentModal}
            onRequestClose={() => props.setModalVisible(false)}
        >
            <TouchableWithoutFeedback
                onPress={() => props.setModalVisible(false)}
            >
                <View style={styles.container}>
                    <View style={styles.containerView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.content}>
                                <View style={{ flex: 0.35, position: 'absolute', top: -35 }}>
                                    <Image
                                        source={require('../../../assets/icons/error_cross.png')}
                                        style={{ width: 70, height: 70, }}
                                    />
                                </View>

                                <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 0.35 }}>
                                    <TextWithStyle style={{ color: 'red', fontSize: 25 }}>Oops!</TextWithStyle>
                                </View>

                                <View>
                                    <TextWithStyle style={{ fontSize: 18, marginBottom: 5 }}>Your number is already</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: 18, alignSelf: 'center' }}>registered as a driver</TextWithStyle>
                                </View>

                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ backgroundColor: '#14345A', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 8 }}
                                        onPress={() => { Linking.openURL('https:play.google.com/store/apps/details?id=com.vanwalay') }}>
                                        <TextWithStyle style={{ fontSize: 15, color: 'white' }}>Go to Van Walay App</TextWithStyle>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

            </TouchableWithoutFeedback>
        </Modal>
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
        marginTop: 22
    },

    content: {
        width: "80%",
        height: "50%",
        borderRadius: 5,//25,
        // paddingVertical: 20,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff"
    },
})

export default NumberRegistered;