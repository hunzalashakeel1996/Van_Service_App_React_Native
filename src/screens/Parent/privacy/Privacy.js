import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View, SafeAreaView, ScrollView, Linking,Platform } from 'react-native';
import TextWithStyle from '../../../components/TextWithStyle';
import Header from '../Parent Profile/Header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Theme from '../../../components/Theme';
import { email, phonecall } from 'react-native-communications';
import HeaderWithoutDrawer from '../../../components/Header/HeaderWithoutDrawer';

class Privacy extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        }
    };

    state = {}

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.headerContainer} >
                    <HeaderWithoutDrawer onBack={() => { this.props.navigation.goBack(null) }} headerText='Privacy Policies' />
                </View >
                <SafeAreaView style={{ flex: 1, marginHorizontal: 10 }}>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <View style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 10, marginVertical: 15 }}>
                            {/* <TextWithStyle style={{ fontSize: 20, color: 'black' }}>
                            USER PRIVACY STATEMENT
                        </TextWithStyle > */}
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                The policy specifies the use of information when using the mobile application, website, or any other digital services and products. Thereby, all information rendered under the Van Wala mandate is collected to be used for improving the quality of service, marketing purposes, etc. The Van Wala service is a brainchild of NOLIN BPO SERVICES LTD., and this Privacy Statement is directly applicable to the information collected and used by the company.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Scope and Application
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                The Privacy Statement is applicable to all those individuals who use the Van Wala app or services regardless of their location. However, this information is not applicable to the information we collect from drivers, contractors, partner logistic companies, or any other commercial vendor.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Collection of Information
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Information Shared By Users
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Van Wala collects all information shared directly with us, such as information gathered during account setup, request for services, communication with our support agents or any other form of communication. This information may include demographics: name, phone number, address, email, mode of payment, picture or any other information shared.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Information Collected Throughout the Use of Our Services
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                When you make use of our Services, information is collected via the following generic categories:
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Location:                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                When our service is used, we collect the location data of your child’s trip via the Van Wala app used by the Driver. If a user grants permission to our app, we can also access their location information when the app is running in the background or foreground. Moreover, we can also derive location information via the IP address.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Contact:                      </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                If you grant permission to our application from your mobile device, we can access your contact list and use the information for promotional or marketing purposes. The sole purpose of using this data is social interaction through our service.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Transaction Data:
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                All transaction details pertaining to the use of service such as subscription charges by parents duly agreed while using the service are recorded.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                App and Site Usage Information:
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                All information regarding how site visitors and users interact with our digital services in the form of settings selected or preferences. This can be done via pixel tags, cookies, and other relevant technologies.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Devices:
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Van Wala may collect information regarding your mobile device such as the operating system and version, preferred language, hardware model, serial number, mobile network information, etc.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Call and SMS Data:
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                With our service, parents can communicate with drivers and contractors. Therefore, any communication done through our medium in the form of texts or calls is recorded.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                History:
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                When any user interacts with our Service, we collect all server logs such as IP address, pages viewed, date and time of access, browser type and other relevant system activities are collected.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Children:
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Van Wala does not collect information from children or teenagers knowingly. If you are a minor, please ask your parents or guardian for consent. Van Wala will not take responsibility for usage by a minor not authenticated to use the Service.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Platform Permission:
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Mobile operating systems have specific device data that cannot be accessed without consent.  The platforms have their own permission systems for consent. On Android, you will be notified to give your permission when you use the app for the first time.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Information Acquired From Other Sources
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                We can also receive information from other sources and use them in sync with the data we have already gathered. For instance, if you create an account with Van Wala via Facebook, or through website API, we may receive information from third party sites.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Use of Information
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                {`The information you share may be used to:

Improve services by designing newer features that improve user experience, provide customer support, ensure safety, generate push notifications and streamline operations.

Perform internal operations including fraud prevention, troubleshooting software bugs, data analysis, research, testing, and monitoring.

Publish marketing collateral including information regarding services, promotions, news, and events regarding Van Wala. This content is permissible as per local laws. Personalize Services for recommendations, social connections, and advertisements.

The information may be used by third-party vendors locally or internationally. However, appropriate measures to be taken to protect your information from any privacy breaches.`}

                            </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Sharing of Information
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                The information collected from you may be shared for the following purposes:
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Via Our Services
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                {`We may share your provided information with:

Drivers and contractors enabling them to fulfil their commitments as expressed in the terms of Service.

Third-party vendors for partnerships, marketing, and promotions.

Masses, if you submit content on public sites in the form of media posts, blog comments, or any other service viewable by general public.

Third-party vendors with whom you choose to share information.

Van Wala subsidiaries and other entities that help in conducting data processing, data centralization or other logistical purposes.

Consultants, marketing partners, service providers and other similar entities that require access to information in order to carry out work-related projects.

In response to a request by the court of law, if we believe that the information desired adheres to our policies.

With law enforcing bodies if we believe that our actions are inconsistent or non-compliant to policies, Services or any other guidelines that are specified in our policies.

In case of a merger, acquisition, restructuring or financing of the business with another company. 

If we otherwise notify you and you consent to the sharing, and other forms in which your anonymity is ensured. 
`}
                            </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Social Sharing Features
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Our Service may be integrated with social sharing tools that enable you to share actions on other Services and applications. Such features are pre-approved by the social sharing services depending on the permissions you set. It is advised to review the privacy policy of those social sharing services to get a better idea.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Third-Party Analytics and Advertising
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Van Wala may use the services of third-party vendors for analytics and performance measurement. This will help us to improve our overall services and keep abreast of the expectations and requirements of our patrons. The service provider may use cookies, SDKs, web beacons, etc. to identify your device when you use our site, similarly, to improve customer experience, we may contact you regarding the issues you face whilst browsing.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Account Information
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Our patrons can correct their account information by logging to our site and app. For account cancellation, please mail at
                            <TextWithStyle onPress={() => { Linking.openURL(`mailto:deactivate@vanwala.pk`) }} style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, }}>
                                    {` deactivate@vanwala.pk`}
                                </TextWithStyle >
                . Upon cancellation, please note that we may retain some information if we have doubts regarding privacy violation or fraud till the issue gets resolved.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Access Rights
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Van Wala believes in complete compliance with the request of individuals regarding correction, access or deletion of personal data as per local laws and policies.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Location Information
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                We seek permission for collection of the location details from the operating system of your device. If you grant permission to collect the information, you can disable it later by amending the location settings of your mobile device. However, by disabling, the functionality of our Service may be limited.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Contact Information
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                We may require your permission to collect and sync contact information from the operating system of your device. For iOS users, you can disable the contact settings later if desired. However, such functionality has not yet been introduced for Android users.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Privacy Rights
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                Van Wala does not share your personal information with third-party vendors for marketing purposes unless we have been given the consent to do so.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Changes to the Statement
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                The Privacy Policy is subject to alteration. In case, we make some major changes to our privacy policy, our patrons will be informed via a formal media i.e. emails. However, for minor changes, your continued use of the Service is a validation of your consent. It is advised to review the privacy policy at regular intervals to remain abreast of the changes.
                        </TextWithStyle >

                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: Platform.OS=='ios'?'Lato-Bold':'lato.bold', padding: 5 }}>
                                Contact Us
                        </TextWithStyle >
                            <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_SMALL, color: 'black' }}>
                                For any queries and concerns regarding the Privacy Policy, please contact us at our helpline
                        <TextWithStyle onPress={() => { phonecall('0345-8269252', true) }} style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, }}>
                                    {` 0345-8269252`}
                                </TextWithStyle > or email us at
                        <TextWithStyle onPress={() => { Linking.openURL(`mailto:customerservice@vanwala.pk`) }} style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, }}>
                                    {` customerservice@vanwala.pk`}
                                </TextWithStyle >.
                        </TextWithStyle >

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        // width: '100%',
        // marginBottom: 10,
        // top: 0,
        // left: 0,
        // zIndex: 100,
    },
})

export default Privacy;