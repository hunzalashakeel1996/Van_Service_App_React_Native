import React, { PureComponent } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {RFPercentage as RF} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextWithStyle from "../TextWithStyle";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

class ModalHeader extends PureComponent {

    render() {
        return (
            <View style={{ flex: 0.07, flexDirection: "row", paddingVertical: wp('2%'), paddingHorizontal: wp('3%'), backgroundColor: "#143459" }}>
                <View style={styles.Image}>
                    <TouchableOpacity>
                        <Image
                            source={require('../../../assets/icons/app_icon.png')}
                            style={{ width: 40, height: 40, }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <TextWithStyle style={styles.headingText}>{this.props.text}</TextWithStyle>
                </View>
                <View style={{alignItems: "flex-end", justifyContent: "center", alignItems: "center",}}>
                    {!this.props.isBackBtn == true ? (
                        <TouchableOpacity style={[styles.menuIcon]} onPress={() => this.props.modalClose(false)}>
                            <Ionicons name="md-arrow-round-back" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                            <TouchableOpacity
                                style={[styles.menuIcon, { backgroundColor: "#fff" }]}
                                onPress={() => this.props.navigation.toggleDrawer()}
                            >
                                <Ionicons name="md-menu" size={RF(3.5)} color="#143459" />
                            </TouchableOpacity>
                        )}
                </View>

            </View>

            //     {/* </View>
            // <View style={styles.parentProfileContainer}>
            //     <View style={styles.picAndNameContainer}>
            //         <View style={styles.profileImage}>
            //             <TouchableOpacity>
            //                 <Image
            //                     source={require('../../../assets/icons/app_icon.png')}
            //                     style={{ width: 40, height: 40 }}
            //                 />
            //             </TouchableOpacity>
            //         </View>

            //         <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            //             <Text style={styles.headingText}>{this.props.text}</Text>
            //         </View>
            //     </View>

            //     {!this.props.isBackBtn ?
            //         <View >
            //             <TouchableOpacity style={styles.menu} onPress={() => this.props.navigation.toggleDrawer()}>
            //                 <Ionicons name="md-menu" size={25} color="#143459" />
            //             </TouchableOpacity>
            //         </View>
            //         :
            //         <View style={styles.backButton}>
            //             <TouchableOpacity onPress={() => navigation.goBack()}>
            //                 <Ionicons name="md-arrow-round-back" size={23} color="white" />
            //             </TouchableOpacity>
            //         </View>
            //     }

            // </View> */}
        );
    }
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    Image: {
        // marginLeft: wp('4%'),
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
        // fontFamily: "Lato"
    },


});

export default ModalHeader;