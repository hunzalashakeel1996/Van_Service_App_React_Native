import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View,Platform} from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import TextWithStyle from '../../../components/TextWithStyle';

class HeaderComponent extends Component {
    state = {}

    render() {
        return (
            <View style={[styles.parentProfileContainer,  { paddingTop: Platform.OS == 'ios' ? 35 : 0 }]}>
                <View style={styles.picAndNameContainer}>
                    <View style={styles.profileImage}>
                        <TouchableOpacity style={{ marginTop: 5 }}>
                            <Image
                                source={require('../../../../assets/icons/menu-logo1.png')}
                                style={{ width: 80, height: 30, }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View >
                    <TouchableOpacity style={styles.menu} onPress={this.props.openDrawer}>
                        {this.props.unseenNotifications > 0 ?
                            <View style={styles.badgeIconView}>
                                <TextWithStyle style={styles.badge}>{this.props.unseenNotifications}</TextWithStyle>
                            </View>
                            : null}
                        <Ionicons name="md-menu" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // headingText: {
    //   marginLeft: "5%",
    //   fontWeight: "bold",
    //   fontSize: RF(2.5),
    //   color: "black",
    //   fontFamily: "Lato-Regular"
    // },

    menu: {
        backgroundColor: "#143459",
        // paddingVertical: RF(1.2),
        // paddingHorizontal: RF(1.7),
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
        margin: 5
    },

    picAndNameContainer: {
        flex: 1,
        width: 100,
        flexDirection: 'row',
        alignContent: 'space-between'
    },

    parentProfileContainer: {
        padding: 3,
        flexDirection: "row",
        // alignContent: "space-between",
        alignItems: "flex-start",
        justifyContent: 'center',
        backgroundColor: "rgba(20,52,89,0.2)"
    },

    profileImage: {
        margin: 5,
        marginLeft: 10,
        justifyContent: 'center',
    },

    // badgeIconView: {
    //   position: 'relative',
    // },

    // badge: {
    //   fontWeight: '900',
    //   fontSize: wp(3),
    //   color: '#fff',
    //   position: 'absolute',
    //   zIndex: 10,
    //   top: -10,
    //   right: 10,
    //   padding: 1,
    //   backgroundColor: 'red',
    //   borderRadius: 10
    // }

    badgeIconView: {
        position: "absolute",
        width: wp("5%"),
        height: wp("5%"),
        borderRadius: 50,
        backgroundColor: "rgb(238,61,60)",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        top: -5,
        left: -5,
    },

    badge: {
        color: '#fff',
        fontSize: 12
    }

});


mapStateToProps = (state) => {
    return {
        unseenNotifications: state.map.unseenNotifications,
    }
}


export default connect(mapStateToProps, null)(HeaderComponent);