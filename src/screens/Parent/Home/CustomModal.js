import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextWithStyle from './../../../components/TextWithStyle';

class CustomModal extends Component {
    state = {
        isModalOpen: true,
    }

    closeModalHandler = () => {
        this.setState({ isModalOpen: false })
        setTimeout(() => { this.props.onCloseModel }, 800)


    }

    render() {
        return (
            <Modal isVisible={this.state.isModalOpen} onBackdropPress={this.closeModalHandler} animationInTiming={1500} animationIn='fadeIn' animationOut='fadeOut' animationOutTiming={800}>
                <View style={styles.modal}>
                    <Ionicons name={this.props.iconName} size={80} style={styles.busIcon} />
                    <TextWithStyle style={styles.modalText}>{this.props.text}</TextWithStyle>

                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 20
    },

    modalText: {
        fontFamily: 'Lato-Regular',
        fontSize: RF(4),
        color: 'black',
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center',
    },

    busIcon: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgb(206, 206, 206)',
        borderRadius: 50
    }
})

export default CustomModal;
