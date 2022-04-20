import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
  Image
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {RFPercentage as RF} from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp,heightPercentageToDP as hp} from "react-native-responsive-screen";
import TextWithStyle from '../TextWithStyle'

// const HeaderLogo = () => {
//     return (
//         <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
//         <View style={{ justifyContent: "center", alignItems: "center" }}>
//           <TouchableOpacity>
//             <Ionicons name="md-pin" size={RF(8)} color="#fedd00" />
//           </TouchableOpacity>
//         </View>
//         <View style={{ flexDirection: "column" }}>
//           <TextWithStyle
//             style={{
//               marginLeft: wp("4%"),
//               fontWeight: "900",
//               fontSize: RF(2.8),
//               color: "#143459",
//               fontFamily: "Lato"
//             }}
//           >
//             VAN
//           </TextWithStyle>
//           <TextWithStyle
//             style={{
//               marginLeft: wp("4%"),
//               fontWeight: "900",
//               fontSize: RF(2.8),
//               color: "#143459",
//               fontFamily: "Lato"
//             }}
//           >
//             WALA
//           </TextWithStyle>
//         </View>
//       </View>
//      );
// }

// export default HeaderLogo;

const DriverHeader = (navigation, isHeaderVisible = false) => {
  return {
    header: isHeaderVisible ? null : false,
    headerTitle: (
      // <View style={styles.picAndNameContainer}>
        <View style={styles.profileImage}>
          <TouchableOpacity>
            <Image  
              source={require('../../../assets/icons/menu-logo1.png')}
              style={{ width: 80, height: 30, marginLeft: 10}}
            />
            {/* <Ionicons name="md-pin" size={RF(8)} color="#fedd00" /> */}
          </TouchableOpacity>
        </View>
        //  <View style={{ flexDirection: 'column' }}>
        //   <TextWithStyle style={styles.headingText}>VAN</TextWithStyle>
        //   <TextWithStyle style={styles.headingText}>WALA</TextWithStyle>
        // </View> 
      // </View>
    ),
    headerTitleContainerStyle: {
      // paddingLeft: wp("4%")
    },
    headerRightContainerStyle: { paddingRight: wp("4%") },
    // headerLeftContainerStyle:{borderWidth: 1},
    headerTransparent: true,
    headerStyle: {backgroundColor: "rgba(20, 52, 89,0.3)",},
    // headerTintColor: 'rgba(255,255,255,0.5)',
    headerTitleStyle: { fontWeight: "bold" },
    headerRight: (
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => navigation.toggleDrawer()}
      >
        <Ionicons name="md-menu" size={RF(4)} color="#fff" />
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  // picAndNameContainer: {
  //   flex: 0.9,
  //   alignItems: "flex-start",
  //   flexDirection: "row",
  // },
  profileImage: {
    
  },
  menu: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    backgroundColor: "#143459",
    justifyContent: "center",
    alignItems: "center",
    width: RF(5.5),
    // aspectRatio : 1,
    height: RF(5.5),
    borderRadius: 50,
  },
  headingText: {
    marginLeft: wp('4%'),
    fontWeight: '900',
    fontSize: RF(2.8),
    color: "#143459",
    fontFamily: "Lato"
  },


});

export default DriverHeader;
