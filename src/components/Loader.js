import React, { Component } from 'react';
import { Image, View } from 'react-native';

const Loader = () => {
  return (
    <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.0)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {/* <Image
          source={require('../../assets/icons/app_icon.png')}
          style={{ width: 50, height: 50, }}
        /> */}
        {/* <Image
          source={require('../../assets/icons/round-gif.gif')}
          style={{ width: 150, height: 150, marginTop: 10 }}
        /> */}
        <Image
          source={require('../../assets/icons/loader.gif')}
          style={{ width: 70, height: 70, marginTop: 10 }}
        />
      </View>

    </View>
  );
}

export default Loader;