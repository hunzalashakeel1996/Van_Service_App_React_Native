import React, { Component } from 'react';
import { AppState, BackHandler, Dimensions, Image, ScrollView, Linking, TouchableOpacity, View } from 'react-native';
import TextWithStyle from '../../../components/TextWithStyle';

class Update extends Component {
    static navigationOptions = {
        headerShown: false,
    };
    componentDidMount = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true });
    }

    state = {}

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../../../assets/icons/app_update.png')} style={{ width: 200, height: 200, marginBottom: 10 }} />

                    <TextWithStyle style={{ marginBottom: 10, fontSize: 20, fontWeight: 'bold', }}>Update Van Wala App Now!</TextWithStyle>
                    <TextWithStyle style={{ marginBottom: 5, }}>Adding new features in the App to </TextWithStyle>
                    <TextWithStyle style={{ marginBottom: 5, }}>make the App more user friendly </TextWithStyle>
                    <TextWithStyle>and easier to use</TextWithStyle>
                </View>

                <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { Linking.openURL(Platform.OS=='ios'?'https://apps.apple.com/pk/app/vanwala/id1562975143' : 'https://play.google.com/store/apps/details?id=com.vanwala') }} style={{ backgroundColor: '#14345A', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 8 }}>
                        <TextWithStyle style={{ fontSize: 20, color: 'white' }}>UPDATE APP</TextWithStyle>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Update;