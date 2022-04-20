import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    ActivityIndicator,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet
} from "react-native";
import Theme from '../../Theme/Theme';
import OutlineButton from '../button/OutlineButton';
import AsyncStorage from '@react-native-community/async-storage';
import Text from './../text/TextWithStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';


const NotificationPopupModal = (props) => {

    return (
        <View>
            <Modal
                animationType="slide"
                // animationType="fade"
                transparent={true}
                visible={props.data.modalVisible}
                onRequestClose={() => props.setModalVisible({modalVisible: false})}
            >
                <TouchableWithoutFeedback
                    onPress={() => props.setModalVisible({modalVisible: false})}
                >
                    <View style={styles.container}>
                        <View style={styles.containerView}>
                            <View style={styles.content}>
                                {/* <Ionicons onPress={() => props.setModalVisible({modalVisible: false})} style={styles.closeIcon} name='md-close-circle' size={30} /> */}
                                <Image style={{ width: 120, height: 120 }} source={require('../../../assets/util/notification.png')} />
                                <Text style={styles.title}>{props.data?.title}</Text>
                                <Text style={styles.msg}>{props.data?.message}</Text>
                                <TouchableHighlight
                                    style={styles.button}
                                    onPress={() => { props.setModalVisible({modalVisible: false});props.navigation() }}
                                >
                                    <Text style={{ color: '#fff' }}>{props.data?.btnText}</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
        // <View>
        //     <Modal
        //         animationType="fade"
        //         transparent={true}
        //         visible={modalVisible}
        //     >
        //         <View style={styles.container}>
        //             <View style={styles.containerView}>
        //                 <View style={styles.content}>
        //                     <Image style={{ width: '100%', height: '100%' }} source={require('../../../assets/how_it_works/swap.png')} />
        //                 </View>
        //                 {/* <View style={styles.buttonView}> */}
        //                 <TouchableOpacity style={styles.buttonView} onPress={() => { hideModalVisible(false); }}>
        //                     <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.WHITE_COLOR }}>{`OK, GOT IT`}</Text>
        //                 </TouchableOpacity>
        //                 {/* </View> */}
        //             </View>
        //         </View>
        //     </Modal>
        // </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    containerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    content: {
        width: "80%",
        // height: "30%",
        borderRadius: 20,//25,
        paddingVertical: 20,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
    },
    button: {
        width: '60%',
        alignItems: "center",
        marginTop: 15,
        paddingVertical: 8,
        // paddingHorizontal: '20%',
        borderRadius: 10,//25,
        backgroundColor: Theme.SECONDARY_COLOR,
    },
    title: { fontSize: Theme.FONT_SIZE_LARGE, fontFamily: Theme.FONT_FAMILY_BOLD, textAlign: "center", marginVertical: 8 },
    msg: { fontSize: Theme.FONT_SIZE_MEDIUM, textAlign: "center" },
    closeIcon: {position: 'absolute', alignSelf: "flex-end", right: "-1%", top: "-2%"}
});

export default NotificationPopupModal;
