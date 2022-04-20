import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextWithStyle from './../../../components/TextWithStyle';

class ArrivedModal extends Component {
    state = {
        isModalOpen: true,
        counter: 120
    }

    closeModalHandler = () => {
        setTimeout(() => {
            this.props.onCloseModal();
            this.setState({ isModalOpen: false })
            clearInterval(this.timer)
        }, 800)
    }

    componentDidMount = () => {
        this.timer = setInterval(() => {
            this.setState({ counter: this.state.counter - 1 })
            if (this.state.counter === 0) {
                clearInterval(this.timer)
            }
        }, 1000)
    }

    onDrop = () => {
        this.closeModalHandler();
    }

    render() {
        return (
            <Modal isVisible={this.state.isModalOpen} onBackdropPress={this.closeModalHandler} animationInTiming={1500} animationIn='fadeIn' animationOut='fadeOut' animationOutTiming={800}>
                <View style={styles.modal}>
                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Ionicons name={this.props.iconName} size={80} style={styles.busIcon} color='white' />
                    </View>

                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <TextWithStyle style={[styles.modalText]}>{this.props.text}</TextWithStyle>

                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name='md-stopwatch' style={{ marginRight: 10 }} size={20} color='red' />

                            <TextWithStyle style={{ fontFamily: 'Lato-Regular', fontSize: RF(3), color: 'red', }}>
                                {this.state.counter} sec
              </TextWithStyle>
                        </View>

                        <View style={styles.buttonContainer}>

                            <TouchableOpacity style={[styles.button, { marginRight: '5%', backgroundColor: 'rgb(255,59,48)' }]} onPress={this.onDrop}>
                                <TextWithStyle style={styles.buttonText}>Drop</TextWithStyle>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, { backgroundColor: 'rgb(255,59,48)' }]} onPress={this.onDrop}>
                                <TextWithStyle style={styles.buttonText}>Leave</TextWithStyle>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        flex: 0.55,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'space-around'
    },

    modalText: {
        fontFamily: 'Lato-Regular',
        fontSize: RF(4),
        color: '#143459',
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center',
    },

    busIcon: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#143459',
        borderRadius: 50
    },

    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '6%',
    },

    button: {
        paddingVertical: 7,
        paddingHorizontal: '10%',
        borderRadius: 50
    },

    buttonText: {
        fontSize: RF(3),
        color: 'white',
        fontFamily: 'Lato-Regular'
    }
})

export default ArrivedModal;
