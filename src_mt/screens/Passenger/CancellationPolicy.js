import React from 'react';
import { ScrollView, SafeAreaView, View } from 'react-native';
import Text from '../../components/text/TextWithStyle';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CancellationPolicy = ({
    params,
}) => {
    const policyList = [
        `20% cancellation fee will be charged to customers for cancelling confirmed trips (customer initiated).`,
        `No cancellation fee will be charged for driver initiated cancellation, or driver no-show.`,
        `No refund will be honored for no-show customers. Appeals can be submitted through customer help center.`,
        `Customers with excessive cancellation may result to 24hrs suspension from the app.`,
        `Drivers with excessive cancellation will be locked our from the app for 30 days.`,
        `In any event of wrong charging, MT will be refund within 48 hours after reporting to help center.`,
    ]
    const Para = ({ title, message }) => (<View style={{ marginVertical: 5 }}>
        {title != "" && <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM, marginBottom: 10 }}>
            {title}
        </Text >}
        <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, }}>
            {message}
        </Text >
    </View>
    );
    const ParaPoint = ({ title, list }) => (<View style={{ marginVertical: 5 }}>
        {title != "" && <Text style={{ fontSize: Theme.FONT_SIZE_MEDIUM, marginBottom: 10 }}>
            {title}
        </Text >}
        {list.map(item => <View style={{ flexDirection: "row", marginBottom: 5, marginLeft: 10 }}>
            <Ionicons style={{ flex: 0.08 }} name={'ellipse'} size={10} color={Theme.SECONDARY_COLOR} />
            <Text style={{ flex: 0.92, fontSize: Theme.FONT_SIZE_XSMALL, }}>
                {item}
            </Text >
        </View>)}

    </View>
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={{ flex: 1, marginHorizontal: 15 }}>
                    <Text style={{ fontSize: Theme.FONT_SIZE_XXLARGE, marginVertical: 10 }}>
                        MyTsuper Cancellation Policy
                    </Text>
                    <Para
                        title={""}
                        message={`Cancellations can be frustrating for everyone - whether for a passenger who has already spent some time looking for a vehicle or for a driver who has already reserved a specific day to accommodate a trip request.`}
                    />
                    <Para
                        title={""}
                        message={`As part of our commitment to make MyTsuper a harmonious marketplace, we continue to intensify our efforts to reduce cancellations by promoting responsible use of our services.`}
                    />
                    <ParaPoint
                        title={"Here are the specific points of our Cancellation Policy: "}
                        list={policyList}
                    />
                    <Para
                        title={""}
                        message={`A marketplace of responsible drivers and passengers will help reduce unreasonable cancellations as everyone gets to enjoy harmonious travel experience. `}
                    />

                    {/* <Text style={{ fontSize: Theme.FONT_SIZE_LARGE, color: 'black', fontFamily: "lato.bold", padding: 5 }}>
                        Contact Us
                        </Text >
                    <Text style={{ fontSize: Theme.FONT_SIZE_SMALL, }}>
                        For any queries and concerns regarding the Privacy Policy, please contact us at our helpline
                        <Text onPress={() => { phonecall('0345-8269252', true) }} style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, }}>
                            {` 0345-8269252`}
                        </Text > or email us at
                        <Text onPress={() => { Linking.openURL(`mailto:customerservice@vanwala.pk`) }} style={{ color: Theme.PRIMARY_COLOR, fontSize: Theme.FONT_SIZE_MEDIUM, }}>
                            {` customerservice@vanwala.pk`}
                        </Text >.
                        </Text > */}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default CancellationPolicy;
