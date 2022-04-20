import React, { Component } from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';

import TextWithStyle from '../TextWithStyle';

const ChildAbsent = (props) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.isModal}
            onRequestClose={() => props.modalClose()}
        >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ backgroundColor: 'white', marginHorizontal: 20, height: RF(50), borderRadius: 20, padding: 10 }}>
                    <View style={{ margin: 10 }}>
                        <TextWithStyle style={{ paddingBottom: 5, borderBottomWidth: 1, color: '#143459', fontSize: RF(3), fontWeight: 'bold' }}>Select Date</TextWithStyle>

                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <TouchableOpacity onPress={() => { props.openDate('start') }} style={styles.date}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TextWithStyle style={{ fontSize: 13 }}>Start Date</TextWithStyle>
                                    {props.vacationStartDate ? <TextWithStyle style={{ color: '#14345A' }}>{props.vacationStartDate}</TextWithStyle> : null}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { props.openDate('end') }} style={styles.date}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TextWithStyle style={{ fontSize: 13 }}>End Date</TextWithStyle>
                                    {props.vacationEndDate ? <TextWithStyle style={{ color: '#14345A' }}>{props.vacationEndDate}</TextWithStyle> : null}
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => { props.optionSelected('Only Pick') }} style={{ flex: 0.3, alignItems: 'center' }}>
                                {props.selectedOption === 'Only Pick' ?
                                    <Image source={require('../../../assets/icons/children_profile/onlyPickupSelected.png')} style={styles.imageStyle} />
                                    :
                                    <Image source={require('../../../assets/icons/children_profile/onlyPickupUnselected.png')} style={styles.imageStyle} />}
                                <TextWithStyle style={{ color: props.selectedOption === 'Only Pick' ? '#14345A' : '#ababab', marginTop: 5 }}>Only Pickup</TextWithStyle>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { props.optionSelected('Only Drop') }} style={{ flex: 0.3, alignItems: 'center' }}>
                                {props.selectedOption === 'Only Drop' ?
                                    <Image source={require('../../../assets/icons/children_profile/onlyDropSelected.png')} style={styles.imageStyle} />
                                    :
                                    <Image source={require('../../../assets/icons/children_profile/onlyDropUnselected.png')} style={styles.imageStyle} />}
                                <TextWithStyle style={{ color: props.selectedOption === 'Only Drop' ? '#14345A' : '#ababab', marginTop: 5 }}>Only Drop</TextWithStyle>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { props.optionSelected('Both Way') }} style={{ flex: 0.3, alignItems: 'center' }}>
                                {props.selectedOption === 'Both Way' ?
                                    <Image source={require('../../../assets/icons/children_profile/bothwaySelected.png')} style={styles.imageStyle} />
                                    :
                                    <Image source={require('../../../assets/icons/children_profile/bothwayUnselected.png')} style={styles.imageStyle} />}
                                <TextWithStyle style={{ color: props.selectedOption === 'Both Way' ? '#14345A' : '#ababab', marginTop: 5 }}>Both Way</TextWithStyle>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 30, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {props.onSubmit()}} style={{ backgroundColor: '#143459', paddingHorizontal: RF(10), paddingVertical: RF(1.5), borderRadius: 8 }} >
                                <TextWithStyle style={{ fontSize: RF(3), color: 'white' }}>{props.vacationEndDate && props.vacationStartDate ? 'Save' : 'Cancel'}</TextWithStyle>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    date: {
        flex: 0.5,
        borderColor: '#ababab',
        borderWidth: 1,
        height: 50,
        borderRadius: 8
    },

    imageStyle: {
        width: 50, 
        height: 50, 
        backgroundColor: 'white', 
        borderRadius: 50
    }
})

export default ChildAbsent;