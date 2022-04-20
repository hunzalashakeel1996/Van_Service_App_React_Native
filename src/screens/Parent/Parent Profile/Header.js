import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextWithStyle from '../../../components/TextWithStyle';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import Theme from '../../../components/Theme';

class HeaderComponent extends Component {
    state = {}

    render() {
        return (
            <View style={[styles.menu, { height: Platform.OS == 'ios' ? 90 : 55, }]}>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Theme.PRIMARY_COLOR, paddingTop: Platform.OS == 'ios' ? 40 : 0 }}>
                    <TouchableOpacity style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', }} onPress={this.props.back}>
                        <Ionicons name="arrow-back-outline" size={25} color="white" />
                    </TouchableOpacity>

                    <View style={{ flex: 0.6, justifyContent: 'center' }}>
                        <TextWithStyle style={styles.headingText}>{this.props.headerText}</TextWithStyle>
                    </View>

                    {this.props.openDrawer && <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={this.props.openDrawer}>
                            {this.props.unseenNotifications > 0 ?
                                <View style={styles.badgeIconView}>
                                    <TextWithStyle style={styles.badge}> {this.props.unseenNotifications} </TextWithStyle>
                                </View>
                                : null}
                            <Ionicons name="md-menu" size={35} color="white" />

                        </TouchableOpacity>
                    </View>}
                </View>
            </View>
            // <View style={styles.parentProfileContainer}>
            //   <View style={styles.picAndNameContainer}>
            //     <View style={styles.profileImage}>
            //       <TouchableOpacity>
            //         <Ionicons name="md-arrow-round-back" size={23} color="white" />
            //       </TouchableOpacity>
            //     </View>

            //     <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            //       <Text style={styles.headingText}>{this.props.headerText || ''}</Text>
            //     </View>
            //   </View>

            //   {this.props.isDrawer === 'true' ?
            //     <View >
            //       <TouchableOpacity style={styles.menu} onPress={this.props.openDrawer}>
            //         {this.props.unseenNotifications > 0 ? 
            //         <View style={styles.badgeIconView}>
            //           <TextWithStyle style={styles.badge}> {this.props.unseenNotifications} </TextWithStyle>
            //           {/* <Image source={require('./images/icon.png')} style={{ width: 30, height: 30 }} /> */}
            //         </View>
            //         : null}
            //         <Ionicons name="md-menu" size={25} color="#143459" />

            //       </TouchableOpacity>
            //     </View>
            //     :
            //     <View style={styles.backButton}>
            //       <TouchableOpacity onPress={this.props.navigateBack}>
            //         <Ionicons name="md-arrow-round-back" size={23} color="white" />

            //       </TouchableOpacity>
            //     </View>
            //   }

            // </View>
        );
    }
}

const styles = StyleSheet.create({
    headingText: {
        marginLeft: 20,
        fontSize: 17,
        color: "white",
        fontFamily: "Lato-Regular"
    },

    menu: {
        backgroundColor: "white",
        // paddingVertical: RF(3),


        // paddingHorizontal: RF(1.7),
        // borderRadius: 50,
        // justifyContent: 'center',
        // alignItems: 'center',
        elevation: 5,
        // margin: 5
    },

    backButton: {
        alignSelf: 'center',
        marginRight: 10,
        padding: 10
    },

    picAndNameContainer: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between'
    },

    parentProfileContainer: {
        padding: 7,
        flexDirection: "row",
        alignContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#143459"
    },

    profileImage: {
        margin: 5,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    badgeIconView: {
        position: 'relative',
    },

    badge: {
        fontWeight: '900',
        fontSize: wp(3),
        color: '#fff',
        position: 'absolute',
        zIndex: 10,
        top: -5,
        right: 25,
        padding: 1,
        backgroundColor: 'red',
        borderRadius: 10
    }

});

mapStateToProps = (state) => {
    return {
        unseenNotifications: state.map.unseenNotifications,
    }
}


export default connect(mapStateToProps, null)(HeaderComponent);
