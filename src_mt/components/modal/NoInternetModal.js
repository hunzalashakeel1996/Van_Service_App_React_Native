import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import Theme from '../../Theme/Theme';
import OutlineButton from '../button/OutlineButton';
import Text from './../text/TextWithStyle';
import NetInfo from "@react-native-community/netinfo";

const NoInternetModal = (props) => {

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        if(state.isInternetReachable !== null)
          setModalVisible(!(state.isConnected ? state.isInternetReachable : state.isConnected))
        // console.log("Connection type", state.type);
        // console.log("Is connected?", state.isInternetReachable);
      });
    

    return () => {
      // console.log("un")
      unsubscribe();
    };
  }, [])

  // const hideModalVisible = (visible) => {
  //   AsyncStorage.setItem('tooltip', "false").then(() => {
  //     setModalVisible(visible);
  //   });
  // }

  return (
    <View >
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={{ flex: 1, backgroundColor: Theme.WHITE_COLOR }}>
          <View style={{ flex: 0.6, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Image style={{ width: 300, height: 300 }}
              source={require('../../../assets/icons/oops.png')}
            />
          </View>
          <View style={{ flex: 0.4, alignItems: 'center' }}>
            <Text style={{ fontSize: 25, color: '#14345A' }}>Oops!</Text>
            <Text style={{ fontSize: 17, color: '#14345A' }}>There should be a problem with </Text>
            <Text style={{ fontSize: 17, color: '#14345A' }}>your Network connection </Text>

            <TouchableOpacity onPress={() => { console.log("Not Connected") }} style={{ marginTop: 30, borderWidth: 2, backgroundColor: '#14345A', paddingVertical: 8, paddingHorizontal: 40, borderRadius: 8 }}>
              <Text style={{ color: 'white', fontSize: 20 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)"
  },
  containerView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 30
    // marginTop: 22

  },
  content: {
    flex: 0.75,
    flexDirection: 'row',
    // justifyContent:'center',
  },
  buttonView: {
    flex: 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Theme.WHITE_COLOR,
    marginHorizontal: 60,
  }
});

export default NoInternetModal;
