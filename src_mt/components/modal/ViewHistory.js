import React, { Component } from "react";
import {
    Modal,
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import Theme from '../../Theme/Theme';
import Header from "../header/Header";

const ViewHistory = (props) => {

    return (
        <View>
            <Modal
                animationType="fade"
                visible={props.modalVisible}
                onRequestClose={() => props.setModalVisible(false)}
            >
                <View style={styles.container}>
                    {/* <View style={styles.containerView}> */}
                    <Header text={"View History"} onBackPress={() => { props.setModalVisible(false) }} />
                    {/* <View style={styles.content}> */}
                    {props.children}
                    {/* </View> */}
                </View>
                {/* </View> */}
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        // backgroundColor: "rgba(0,0,0,0.4)"
    },
    containerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22
        // marginTop: 22

    },
    content: {
        width: "70%",
        height: "30%",
        borderRadius: 20,//25,
        paddingVertical: 20,
        justifyContent: "space-around",
        alignItems: "center",

        // backgroundColor: "#fff"
    }
});

export default ViewHistory;
