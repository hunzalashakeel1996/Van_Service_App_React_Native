import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {RFPercentage as RF} from 'react-native-responsive-fontsize';

class StartPage extends Component {
  state = {}

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#143459', justifyContent: 'center', alignItems: 'center', }}>
        <View style={{ flex: 1, marginHorizontal: 20, width: '80%' }}>
          <View style={{ flex: 0.5, justifyContent: 'flex-start', marginTop: 40 }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../../assets/icons/app_icon.png')}
                style={{ width: 100, height: 100 }}
              />
            </View>
                  
            <View style={{ alignItems: 'center', }}>
              <Text style={{ fontSize: RF(6.5), color: 'white', fontWeight: 'bold', fontFamily: "Lato-Regular" }}>VAN WALA</Text>
            </View>
          </View>

          <View style={{ flex: 0.5, justifyContent: 'flex-end', marginBottom: 40 }}>
            <View style={[styles.button, { marginTop: 50, }]}>
              <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.props.navigation.navigate('Login') }} activeOpacity={.5}>
                <View style={[styles.loginButton, { backgroundColor: 'white' }]}>
                  <Text>I have an account</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.button, { marginTop: 30 }]}>
              <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.props.navigation.navigate('SignUp') }} activeOpacity={.5} >
                <View style={[styles.loginButton, { backgroundColor: "white" }]}>
                  <Text>Create an Account</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButton: {
    alignItems: 'center',
    padding: 15,
    // backgroundColor: "#143459",
    borderRadius: 10,
  },
})
export default StartPage;