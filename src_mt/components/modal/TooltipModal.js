import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    ActivityIndicator,
    Image,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import Theme from '../../Theme/Theme';
import OutlineButton from '../button/OutlineButton';
import AsyncStorage from '@react-native-community/async-storage';

const TooltipModal = (props) => {

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('tooltip').then((val) => {
            if(val === null){
                setModalVisible(true);
            }
        });
    }, [])

    const hideModalVisible = (visible) => {
        AsyncStorage.setItem('tooltip', "false").then(() => {
            setModalVisible(visible);
        });
    }

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.container}>
                    <View style={styles.containerView}>
                        <View style={styles.content}>
                            <Image style={{ width: '100%', height: '100%' }} source={require('../../../assets/how_it_works/swap.png')} />
                        </View>
                        {/* <View style={styles.buttonView}> */}
                        <TouchableOpacity style={styles.buttonView} onPress={() => { hideModalVisible(false); }}>
                            <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: Theme.WHITE_COLOR }}>{`OK, GOT IT`}</Text>
                        </TouchableOpacity>
                        {/* </View> */}
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
        backgroundColor: "rgba(0,0,0,0.8)"
    },
    containerView: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        marginTop: 30
        // marginTop: 22

    },
    content: {
        flex: 0.75,
        flexDirection: 'row',
        // justifyContent:'center',
    },
    buttonView: {
        flex: 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Theme.WHITE_COLOR,
        marginHorizontal: 60,
    }
});

export default TooltipModal;
