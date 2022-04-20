import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Clipboard, Image, Dimensions } from "react-native";
import TextWithStyle from "./TextWithStyle"
import HeaderWithText from "./Header/HeaderWithText"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from "react-native-vector-icons/Ionicons";
import Accordion from './Accordion';
import { phonecall, email } from 'react-native-communications';
import { Linking } from 'react-native'
import Header from '../screens/Parent/Parent Profile/Header';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import HeaderWithoutDrawer from './Header/HeaderWithoutDrawer';
import Toast from 'react-native-simple-toast';

class DriverPrivacy extends Component {
    static navigationOptions = {
        headerShown: false,
    }
    // static navigationOptions = ({ navigation }) => HeaderWithText(navigation, "Need Help?", true);
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'FAQ',
            index: 0,
            faqs: [
                {
                    title: "How do I sign up?",
                    details: `Download “VanWala” app. Register with your child’s details. Our representative will link you with your child’s van driver.`,
                    isShow: false,
                },
                {
                    title: "Do I need a separate account for each of my children?",
                    details: `No, you need just one Vanwala app account for multiple children.`,
                    isShow: false,
                },
                {
                    title: "Is my information and data secure?",
                    details: `All your personal information and data shared are confidential and secured.`,
                    isShow: false,
                },
                {
                    title: "Can I know how far my child is?",
                    details: `Yes, of course. With our real time tracking system, all the parents will receive real time notifications regarding the school van on Vanwala app.`,
                    isShow: false,
                },
                {
                    title: "How does it track?",
                    details: `Vanwala app uses global positioning system (GPS) technology to locate and track your child’s school van on each move.`,
                    isShow: false,
                },
                {
                    title: "Will I receive any notification or update for van delays?",
                    details: `Yes, you’ll receive instant notification in case of route deviation or delays in trip.`,
                    isShow: false,
                },
                {
                    title: "Is Vanwala app easy to install?",
                    details: `Yes, it’s easy to install. In case, if you face any difficulty during installation, then we shall provide you with installation guide`,
                    isShow: false,
                },
                {
                    title: "Internet connection is needed to access the application?",
                    details: `It’s necessary to have internet connection on your phone. Parents can take advantage of the Mobile App by tracking, in real-time, their children's movements in the school van.`,
                    isShow: false,
                },
                {
                    title: "Is there any additional charges for tracking and real time notifications?",
                    details: `No, our school bus tracking is included with all those features.`,
                    isShow: false,
                },
                {
                    title: "Is it possible to communicate with a driver?",
                    details: `Yes, why not. You can communicate with the driver by calling them via a mobile app as our software is integrated with customized apps for both parents and drivers.`,
                    isShow: false,
                },
                {
                    title: "How can we update for students vacation or holidays?",
                    details: `We have an additional feature for marking student vacation of one or more days.`,
                    isShow: false,
                },
                {
                    title: "Can I change my mobile number?",
                    details: `No, parent can’t change their mobile number that is registered to the system for children safety, but you can contact the school admin to update your mobile number in the system.`,
                    isShow: false,
                },
            ],
        }
        this.number = "+92 345 8269252";
        this.customercareEmail = "customercare@myvanwala.com";
        this.complainEmail = "complain@myvanwala.com";
    }

    setAccordion = (show, i) => {
        let array = [...this.state.faqs]
        array.map((item, index) => {
            item.isShow = (index == i ? show : false)
        })
        this.setState({ faqs: array })
    }

    setClipboard = (email) => {
        Clipboard.setString(email);
        Toast.show(`${email} copied to clipboard`, Toast.LONG);
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        const FirstRoute = () => (
            <ScrollView >
                {this.state.faqs.map((faq, index) => (
                    <View style={[styles.list]}>
                        <TouchableOpacity
                            onPress={() => { this.setAccordion(!faq.isShow, index) }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TextWithStyle style={{ fontSize: wp(4), flex: 1, fontWeight: "bold", color: '#14345A' }}>{faq.title}</TextWithStyle >
                                <View style={{ borderWidth: 1, borderRadius: 20, width: 23, alignItems: 'center' }}>
                                    <Ionicons style={{}} name={!faq.isShow ? "ios-arrow-down" : "ios-arrow-up"} size={20} color={'#143459'} />
                                </View>
                            </View>
                            {faq.isShow && <View>
                                <TextWithStyle style={{ fontSize: wp(4), paddingTop: 8 }}>{faq.details}</TextWithStyle >
                            </View>}
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView >
        );

        const SecondRoute = () => (
            <View style={{ marginTop: 30, flex: 1}}>
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 0.4}}>
                    <Image source={require('../../assets/icons/reach_us.png')} style={{ width: 120, height: 120, marginLeft: 5 }} />
                </View>
                <View style={{ borderRadius: 8, marginHorizontal: 20, flex: 0.3, justifyContent: 'center', }}>
                    <TouchableOpacity onPress={() => { phonecall(this.number, true) }} style={{ flexDirection: "row", borderRadius: 8, alignItems: "center", backgroundColor: '#14345A', paddingVertical: 7 }}>
                        {/* <TextWithStyle style={{ fontSize: wp(5) }}>Call Us at </TextWithStyle > */}
                        <Image source={require('../../assets/icons/parent/call_w.png')} style={{ width: 25, height: 25, marginLeft: 5 }} />
                        <TextWithStyle style={{ fontSize: wp(4.5), color: "white", marginLeft: 10, }}>{this.number}</TextWithStyle>
                    </TouchableOpacity>

                    {/* <TextWithStyle style={{ fontSize: wp(4), paddingBottom: 10 }}>OR</TextWithStyle > */}

                    <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${this.customercareEmail}`) }} style={{ flexDirection: "row", borderRadius: 8, backgroundColor: '#14345A', alignItems: 'center', paddingVertical: 5, marginTop: 20 }}>
                        {/* <TextWithStyle style={{ fontSize: wp(5) }}>Email Us at </TextWithStyle > */}
                        <Image source={require('../../assets/icons/parent/email_w.png')} style={{ width: 30, height: 30, marginLeft: 5 }} />
                        <TextWithStyle style={{ fontSize: wp(4.5), color: "white", marginLeft: 10, }}>{this.customercareEmail}</TextWithStyle>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 0.3, marginHorizontal: 20, justifyContent: 'center',}}>
                    <TextWithStyle>For complain email us at:</TextWithStyle>
                    <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${this.complainEmail}`) }} style={{ flexDirection: "row", borderRadius: 8, backgroundColor: '#14345A', alignItems: 'center', paddingVertical: 5, marginTop: 5 }}>
                        <Image source={require('../../assets/icons/parent/email_w.png')} style={{ width: 30, height: 30, marginLeft: 5 }} />
                        <TextWithStyle style={{ fontSize: wp(4.5), color: "white", marginLeft: 10, }}>{this.complainEmail}</TextWithStyle>
                    </TouchableOpacity>
                </View>

                {/* <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${this.complainEmail}`) }} style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                    <TextWithStyle style={{ fontSize: wp(4), color: '#14345A' }}>For complaints, email us at </TextWithStyle >
                    <TextWithStyle style={{ fontSize: wp(4), color: "#14345A", fontWeight: 'bold', }}>{this.complainEmail}</TextWithStyle>
                </TouchableOpacity> */}
            </View>
        );

        // const renderScene = SceneMap({
        //     first: FirstRoute,
        //     second: SecondRoute,
        // });

        const routes = [
            { key: 'first', title: 'FAQs' },
            { key: 'second', title: 'Reach Us' },
        ];
        const initialLayout = { width: Dimensions.get('window').width };
        const renderTabBar = (props) => (
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#14345A' }}
                style={{ backgroundColor: 'white', color: '#14345A' }}
                activeColor='#14345A'
                inactiveColor='#bfbfbf'
            />
        );

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer} >
                    <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText='Need Help' />
                </View >

                {/* <View style={{ flexDirection: 'row', flex: 0.06, marginTop: 10, marginHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'FAQ' }) }} style={{ flex: 0.5, alignItems: 'center', borderBottomWidth: 2, borderColor: this.state.selectedOption === 'FAQ' ? '#14345A' : '#bfbfbf' }}>
                        <TextWithStyle style={{ color: this.state.selectedOption === 'FAQ' ? '#14345A' : '#bfbfbf' }}>FAQs</TextWithStyle>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ selectedOption: 'Reach' }) }} style={{ flex: 0.5, alignItems: 'center', borderBottomWidth: 2, borderColor: this.state.selectedOption === 'Reach' ? '#14345A' : '#bfbfbf' }}>
                        <TextWithStyle style={{ color: this.state.selectedOption === 'Reach' ? '#14345A' : '#bfbfbf' }}>Reach Us</TextWithStyle>
                    </TouchableOpacity>
                </View> */}

                <View style={{ flex: 1 }}>
                    <TabView
                        navigationState={{ index: this.state.index, routes }}
                        // renderScene={renderScene}
                        renderScene={({ route }) => { 
                            switch (route.key) {
                            case 'first':
                                return FirstRoute();
                            case 'second':
                                return SecondRoute();
                            default:
                                return null;
                            }
                        }}
                        onIndexChange={(index) => {this.setState({index})}}
                        initialLayout={initialLayout}
                        renderTabBar={renderTabBar}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5
    },

    headerContainer: {
        width: '100%',
        marginBottom: 10,
        top: 0,
        left: 0,
        zIndex: 100,
    },

    list: {
        // backgroundColor: "#ddd",
        borderRadius: 8,
        margin: 5,
        padding: 10
    },
});

export default DriverPrivacy;



// <View style={styles.container}>
//     <View style={{ flex: 0.7, borderRadius: 8, marginHorizontal: 10 }}>
//         <ScrollView >

//             <TextWithStyle style={{ fontSize: wp(4.5), color: "#000", paddingBottom: 10, }}>Frequently Asked Questions(FAQs)</TextWithStyle >

//             {this.state.faqs.map((item, index) => (
//                 <Accordion key={index}
//                     title={item.title}
//                     details={item.details}
//                     showAccordion={item.isShow}
//                     setAccordion={(show) => { this.setAccordion(show, index) }} />
//             ))}
//         </ScrollView>
//     </View>

//     <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
//         <View style={{ borderRadius: 8, marginHorizontal: 10 }}>
//             <TouchableOpacity onPress={() => { phonecall(this.number, true) }} style={{ flexDirection: "row", borderRadius: 8, alignItems: "center", backgroundColor: '#14345A', paddingVertical: 7 }}>
//                 {/* <TextWithStyle style={{ fontSize: wp(5) }}>Call Us at </TextWithStyle > */}
//                 <Image source={require('../../assets/icons/parent/call_w.png')} style={{ width: 25, height: 25, marginLeft: 5 }} />
//                 <TextWithStyle style={{ fontSize: wp(4.5), color: "white", marginLeft: 10, }}>{this.number}</TextWithStyle>
//             </TouchableOpacity>

//             {/* <TextWithStyle style={{ fontSize: wp(4), paddingBottom: 10 }}>OR</TextWithStyle > */}

//             <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${this.customercareEmail}`) }} style={{ flexDirection: "row", borderRadius: 8, backgroundColor: '#14345A', alignItems: 'center', paddingVertical: 5, marginTop: 10 }}>
//                 {/* <TextWithStyle style={{ fontSize: wp(5) }}>Email Us at </TextWithStyle > */}
//                 <Image source={require('../../assets/icons/parent/email_w.png')} style={{ width: 30, height: 30, marginLeft: 5 }} />
//                 <TextWithStyle style={{ fontSize: wp(4.5), color: "white", marginLeft: 10, }}>{this.customercareEmail}</TextWithStyle>
//             </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${this.complainEmail}`) }} style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center', marginTop: 10 }}>
//             <TextWithStyle style={{ fontSize: wp(4), color: '#14345A' }}>For complaints, email us at </TextWithStyle >
//             <TextWithStyle style={{ fontSize: wp(4), color: "#14345A", fontWeight: 'bold', }}>{this.complainEmail}</TextWithStyle>
//         </TouchableOpacity>
//     </View>
// </View>