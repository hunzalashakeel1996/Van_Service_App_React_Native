import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Theme from '../../Theme/Theme';

const Segment = (props) => {
    return (
        <TouchableOpacity
            style={[styles.segment, props.selectedSegment ? { borderColor: Theme.SECONDARY_COLOR, } : null, props.segmentStyle]}
            onPress={props.onPress}>
            <View>
                <Text style={[styles.title, props.selectedSegment ? { color: Theme.BLACK_COLOR, } : null]}>
                    {props.text}
                </Text>
                {props.length > 0 ? <View style={{ position: "absolute", justifyContent: "center", alignItems: "center", right: -16, top: -5, textAlign: "center", height: 16, width: 16, borderWidth: 1, borderColor: Theme.SECONDARY_COLOR, borderRadius: 16 / 2 }}>
                    <Text style={{ fontSize: 10, color: Theme.SECONDARY_COLOR }}>{props.length}</Text>
                </View> : null}
            </View>
        </TouchableOpacity>
    );
};


export default Segment;

const styles = StyleSheet.create({
    segment: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        borderColor: Theme.PRIMARY_COLOR,
        borderBottomWidth: 2,
    },
    title: {
        fontSize: Theme.FONT_SIZE_LARGE,
        color: Theme.BORDER_COLOR,
    },
});
