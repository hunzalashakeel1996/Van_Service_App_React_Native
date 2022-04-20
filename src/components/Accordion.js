import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {RFPercentage as RF} from 'react-native-responsive-fontsize';
import TextWithStyle from "./TextWithStyle"
import Ionicons from "react-native-vector-icons/Ionicons";

// class Accordion extends PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {
//             showAccordion: false,
//         }
//     }
//     render() {
//         return (
//             <View style={[styles.container, this.props.style]}>
//                 <TouchableOpacity
//                     onPress={() => { this.setState({ showAccordion: !this.state.showAccordion }) }}>
//                     <View style={{ flexDirection: "row", alignItems: "center" }}>
//                         <TextWithStyle style={{ fontSize: wp(4.5), flex: 1 }}>{this.props.title}</TextWithStyle >
//                         <Ionicons style={{ paddingHorizontal: 10 }} name={!this.state.showAccordion ? "ios-arrow-down" : "ios-arrow-up"} size={25} color={'#143459'} />
//                     </View>
//                     {this.state.showAccordion && <View>
//                         <TextWithStyle style={{ fontSize: wp(4), paddingTop: 8 }}>{this.props.details}</TextWithStyle >
//                     </View>}
//                 </TouchableOpacity>
//             </View>
//         );
//     }
// }

// export default Accordion;

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: "#ccc",
//         borderRadius: 8,
//         margin: 5,
//         padding: 10
//     },
// });

const Accordion = (props) => {
    return (
        <View style={[styles.container, props.style]}>
            <TouchableOpacity
                onPress={() => { props.setAccordion(!props.showAccordion) }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextWithStyle style={{ fontSize: wp(4), flex: 1, fontWeight: "bold" }}>{props.title}</TextWithStyle >
                    <Ionicons style={{ paddingHorizontal: 10 }} name={!props.showAccordion ? "ios-arrow-down" : "ios-arrow-up"} size={25} color={'#143459'} />
                </View>
                {props.showAccordion && <View>
                    <TextWithStyle style={{ fontSize: wp(4), paddingTop: 8 }}>{props.details}</TextWithStyle >
                </View>}
            </TouchableOpacity>
        </View>
    );
};


export default Accordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ddd",
        borderRadius: 8,
        margin: 5,
        padding: 10
    },
});






