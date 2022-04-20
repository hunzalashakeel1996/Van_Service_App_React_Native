import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import TextWithStyle from '../../components/TextWithStyle';

class NoInternet extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    }
  };

  state = {}
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{flex: 0.6, justifyContent: 'flex-end', alignItems: 'center'}}>
          <Image style={{ width: 300, height: 300 }}
            source={require('../../../assets/icons/oops.png')}
          />
        </View>
        <View style={{flex: 0.4, alignItems: 'center'}}>
          <TextWithStyle style={{fontSize: 25, color: '#14345A'}}>Oops!</TextWithStyle>
          <TextWithStyle style={{fontSize: 17, color: '#14345A'}}>There should be a problem with </TextWithStyle>
          <TextWithStyle style={{fontSize: 17, color: '#14345A'}}>your Network connection </TextWithStyle>
          
          <TouchableOpacity onPress={() => {this.props.navigation.navigate('Auth')}} style={{marginTop: 30, borderWidth: 2, backgroundColor: '#14345A', paddingVertical: 8, paddingHorizontal: 40, borderRadius: 8}}>
            <TextWithStyle style={{color: 'white', fontSize: 20}}>Retry</TextWithStyle>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
 
export default NoInternet;