import React, { Component } from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {RFPercentage as RF} from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextWithStyle from './../TextWithStyle';

class DriverHeaderCustomComponent extends Component {
  state = {};
  // open = () => {
  //   alert("pressed");
  // };
  render() {
    return (
      <View style={styles.DriverContainer}>
        <View style={styles.picAndNameContainer}>
          <View style={styles.profileImage}>
            <TouchableOpacity>
              <Image
                source={require('../../../assets/icons/app_icon.png')}
                style={{ width: 40, height: 40, }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <TextWithStyle style={styles.headingText}>VAN</TextWithStyle>
            <TextWithStyle style={styles.headingText}>WALA</TextWithStyle>
          </View>
        </View>
        <View style={styles.menu}>
          {/* <View style={styles.menuIcon}> */}
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={() => this.props.headProps.navigation.toggleDrawer()}
          >
            <Ionicons name="md-menu" size={wp('6.5%')} color="#fff" />
          </TouchableOpacity>
          {/* </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  DriverContainer: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: wp('2%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  picAndNameContainer: {
    flex: 0.9,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  profileImage: {
    justifyContent: "center",
    alignItems: "center",
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
    width: wp('10%'),
    // aspectRatio : 1,
    height: wp('10%'),
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

export default DriverHeaderCustomComponent;
