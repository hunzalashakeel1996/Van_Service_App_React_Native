import React, { Component } from "react";
import {
    Modal,
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native";

class LoaderModal extends Component {

    render() {
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.props.modalVisible}
                >
                    <View style={styles.container}>
                        <View style={styles.containerView}>
                            {/* <View style={styles.content}> */}
                                <ActivityIndicator size={80} color="#143459" />
                            {/* </View> */}
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

export default LoaderModal;
