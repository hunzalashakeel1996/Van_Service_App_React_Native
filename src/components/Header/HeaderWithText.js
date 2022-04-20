import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {RFPercentage as RF} from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import TextWithStyle from "../TextWithStyle";

// const HeaderLogo = () => {
//     return (
//         <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
//         <View style={{ justifyContent: "center", alignItems: "center" }}>
//           <TouchableOpacity>
//             <Ionicons name="md-pin" size={RF(8)} color="#fedd00" />
//           </TouchableOpacity>
//         </View>
//         <View style={{ flexDirection: "column" }}>
//           <Text
//             style={{
//               marginLeft: wp("4%"),
//               fontWeight: "900",
//               fontSize: RF(2.8),
//               color: "#143459",
//               fontFamily: "Lato"
//             }}
//           >
//             VAN
//           </Text>
//           <Text
//             style={{
//               marginLeft: wp("4%"),
//               fontWeight: "900",
//               fontSize: RF(2.8),
//               color: "#143459",
//               fontFamily: "Lato"
//             }}
//           >
//             WALA
//           </Text>
//         </View>
//       </View>
//      );
// }

// export default HeaderLogo;

const DriverHeader = (navigation, text, isBackBtn = false, backBtn = null) => {
    // console.log(navigation);
    return {
        headerTitle: (
            <View style={styles.textContainer}>
                <TextWithStyle style={styles.headingText}>{text}</TextWithStyle>
            </View>
        ),
        headerLeft: (
            <View style={styles.Image}>
                <TouchableOpacity>
                    <Image
                        source={require('../../../assets/icons/app_icon.png')}
                        style={{ width: 30, height: 30, }}
                    />
                    {/* <Ionicons name="md-pin" size={RF(8)} color="#fedd00" /> */}
                </TouchableOpacity>
            </View>
        ),
        headerRight: isBackBtn == true ? (
            <TouchableOpacity style={[styles.menuIcon]} onPress={()=> backBtn == null ? navigation.goBack(null) : backBtn}>
                <Ionicons name="md-arrow-round-back" size={20} color="#fff" />
            </TouchableOpacity>
        ) : (
                <TouchableOpacity
                    style={[styles.menuIcon, { backgroundColor: "#fff" }]}
                    onPress={() => navigation.toggleDrawer()}
                >
                    <Ionicons name="md-menu" size={RF(3.5)} color="#143459" />
                </TouchableOpacity>
            ),
        headerTitleContainerStyle: {
            paddingLeft: wp("4%"),
            //   backgroundColor: "#143459"
        },
        headerRightContainerStyle: { paddingRight: wp("4%") },
        // headerLeftContainerStyle:{borderWidth: 1},
        // headerTransparent: true,
        headerStyle: { backgroundColor: "#143459" },
        // headerTintColor: 'rgba(255,255,255,0.5)',
        // headerTitleStyle: { fontWeight: "bold" },

    };
};

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
    },
    Image: {
        marginLeft: wp('4%'),
        justifyContent: "center",
        alignItems: "center",
    },
    menu: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
    },
    menuIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: wp('10%'),
        // aspectRatio : 1,
        height: wp('10%'),
        borderRadius: 50,
    },
    headingText: {
        // marginLeft: wp('4%'),
        // fontWeight: '900',
        fontSize: RF(2.5),
        color: "#fff",
        fontFamily: "Lato"
    },


});

export default DriverHeader;
