import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Theme from '../../Theme/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Text from './../text/TextWithStyle';

const data = [
  {
    title: 'Book Accredited Tourist Vehicles',
    text: "We are choosy. We want to make sure that the vehicles available on our platform are current models not older than five years. Most of our vans are also accredited tourist vehicles. ",
    image: require('../../../assets/intro_slider/tourist-Vehicle.png'),
    logo: require('../../../assets/intro_slider/logo.png'),
    // bg: `rgba(${Theme.SECONDARY_COLOR_RGB}, 0.7)`,
  },
  {
    title: 'Trained Tour Drivers',
    text: "On top of the rigorous safety driving programs, MyTsuper partner drivers go through regular training that includes tour guiding",
    image: require('../../../assets/intro_slider/trained-tour-driver.png'),
    logo: require('../../../assets/intro_slider/logo.png'),
    // bg: `rgba(${Theme.SECONDARY_COLOR_RGB}, 0.7)`,
  },
  {
    title: 'Choose Your Ride',
    text: "MyTsuper is a marketplace where you have a choice - you can choose your driver and vehicles based on your preferences and needs.",
    image: require('../../../assets/intro_slider/Choose-Your-Ride.png'),
    logo: require('../../../assets/intro_slider/logo.png'),
    // bg: `rgba(${Theme.SECONDARY_COLOR_RGB}, 0.7)`,
  },
  {
    title: 'Upcoming Features',
    text: "Watch out for more exciting features such as multi-city stops, instant taxi bookings, and packaged tours.",
    image: require('../../../assets/intro_slider/Upcoming-Features.png'),
    logo: require('../../../assets/intro_slider/logo.png'),
    // bg: `rgba(${Theme.SECONDARY_COLOR_RGB}, 0.7)`,
  },
];

// type Item = typeof data[0];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120, // Add padding to offset large buttons and pagination in bottom of page
  },
  image: {
    width: 320,
    height: 320,
    marginTop: 32,
  },
  logo: {
    width: 260,
    height: 40,
  },
  title: {
    fontSize: 22,
    // color: 'white',
    paddingHorizontal: 10,
    color: Theme.BLACK_COLOR,
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    color: Theme.BLACK_COLOR,
    paddingHorizontal: 20,
    // color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: `rgba(${Theme.SECONDARY_COLOR_RGB}, .9)`,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentBottomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
buttonText: {
  color: `rgba(${Theme.SECONDARY_COLOR_RGB}, .9)`,
    fontSize: 18,
    padding: 12,
},
});

export default class IntroSlider extends React.Component {
  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.bg,
        }}>
        <SafeAreaView style={styles.slide}>
          <Image source={item.logo} style={styles.logo} />
          <Image source={item.image} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </SafeAreaView>
      </View>
    );
  };

  _keyExtractor = (item) => item.title;

  _renderNextButton = () => {
    return (
      <View style={styles.transparentBottomButton}>
        <Text style={styles.buttonText}>Next</Text>
      </View>
    );
  };

  _renderSkipButton = () => {
    return (
      <View style={styles.transparentBottomButton}>
        <Text style={styles.buttonText}>Skip</Text>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons name="checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          //   bottomButton
          showSkipButton
          // showPrevButton
          data={data}
          // onSkip={this.props.onSkip}
          onDone={this.props.onDone}
          dotStyle={{ backgroundColor: `rgba(${Theme.SECONDARY_COLOR_RGB}, .2)` }}
          activeDotStyle={{ backgroundColor: `rgba(${Theme.SECONDARY_COLOR_RGB}, .9)` }}
          renderNextButton={this._renderNextButton}
          renderDoneButton={this._renderDoneButton}
          renderSkipButton={this._renderSkipButton}
        />
      </View>
    );
  }
}