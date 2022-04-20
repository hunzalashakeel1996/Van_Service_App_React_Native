import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TripDetailItem = ({
    onPress,
    status,
    statusText,
    newCount,
    allCount,
    isCompleted,

}) => {
    // const bgColor = (newCount > 0 || allCount > 0) ? styles.inProcessColor : styles.pendingColor;
    const bgColor = styles.pendingColor;
    const doneIconColor = isCompleted ? Theme.SECONDARY_COLOR : Theme.BORDER_COLOR;
    const colorNewAll = status == "Offers" && Theme.SECONDARY_COLOR ||
        status == "My Confirmation" && Theme.BLUE_COLOR ||
        status == "Driver Confirmation" && Theme.PRIMARY_COLOR ||
        Theme.BLUE_COLOR
    // const colorNewAll =
    //     Theme.BLUE_COLOR
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, bgColor]}>
            <View style={{ flex: 0.15, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name={"checkmark-circle"} size={30} color={doneIconColor} />
            </View>
            <View style={{ flex: 0.55, justifyContent: "center" }}>
                <Text style={[{ fontSize: Theme.FONT_SIZE_LARGE, fontFamily: Theme.FONT_FAMILY_BOLD }]}>{status}
                    {/* <Ionicons name={"checkmark-circle"} size={20} color={doneIconColor} /> */}
                </Text>
                <Text style={{ fontSize: Theme.FONT_SIZE_SMALL }}>{statusText}</Text>
            </View>
            <View style={{ flex: 0.4, flexDirection: "row", alignItems: "center" }}>
                {/* New Fill Style */}
                {/* <View style={{ flex: 1, }}>
                    {newCount > 0 && <View style={{ height: 60, width: 60, borderRadius: 60 / 2, justifyContent: "center", alignItems: "center", backgroundColor: colorNewAll }}>
                        <Text style={{ color: Theme.WHITE_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, }}>NEW</Text>
                        <Text style={{ color: Theme.WHITE_COLOR, fontSize: Theme.FONT_SIZE_LARGE, }}>{newCount}</Text>
                    </View>}
                </View> */}
                {/* New Fill Style End*/}

                {/* New Outline Style */}
                <View style={{ flex: 1 }}>
                    {newCount > 0 && <View style={{ height: 60, width: 60, borderRadius: 60 / 2, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: colorNewAll }}>
                        <Text style={{ color: colorNewAll, fontSize: Theme.FONT_SIZE_MEDIUM, }}>NEW</Text>
                        <Text style={{ color: colorNewAll, fontSize: Theme.FONT_SIZE_LARGE, }}>{newCount}</Text>
                    </View>}
                </View>
                {/* New Outline Style End*/}

                {/* All Outline Style */}
                <View style={{ flex: 1 }}>
                    {allCount > 0 && <View style={{ height: 60, width: 60, borderRadius: 60 / 2, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: colorNewAll }}>
                        <Text style={{ color: colorNewAll, fontSize: Theme.FONT_SIZE_MEDIUM, }}>ALL</Text>
                        <Text style={{ color: colorNewAll, fontSize: Theme.FONT_SIZE_LARGE, }}>{allCount}</Text>
                    </View>}
                </View>
                {/* All Outline Style End*/}
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        height: hp(10),
        flexDirection: "row",
        marginVertical: 5,
        //  borderTopColor: Theme.BORDER_COLOR,
        //   borderTopWidth: 1, 
    },
    pendingColor: {
        backgroundColor: Theme.BORDER_COLOR_OPACITY_2,
    },
    inProcessColor: {
        // backgroundColor: `rgba(${Theme.PRIMARY_COLOR_RGB},0.7)`,
        backgroundColor: Theme.SECONDARY_COLOR,
    }
});
export default TripDetailItem;
