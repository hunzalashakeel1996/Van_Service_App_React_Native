import React, { Component } from 'react';
import { Alert, Image, Platform, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';

import { createUser, uploadImages } from '../../../store/actions/dataAction';
import TextWithStyle from '../../components/TextWithStyle';
import Header from '../Parent/Parent Profile/Header';
import { NavigationActions } from 'react-navigation';
import { passwordLogin, setDeviceToken } from '../../../store/actions/dataAction';
import { setUserData, setDriverId } from '../../../store/actions/Map';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';

class Documents extends Component {
  state = {
    page: 0,
    loader: false,
    licenseFrontUri: null,
    isLoading: false,
    // variables to store image jsx of images
    licenseFrontImage: null, licenseBackImage: null,
    cnicFrontImage: null, cnicBackImage: null,
    registrationFrontImage: null,
    // array to store string of which image is currently uploaded (used this array because to avoid different render for each document)
    imageArray: [
      ['cnicFrontImage', 'cnicBackImage'],
      ['registrationFrontImage'],
      ['licenseFrontImage', 'licenseBackImage'],
    ]
  }

  imageNameArray = [
    'cnicFrontImage', 'cnicBackImage',
    'registrationFrontImage', 'licenseFrontImage', 'licenseBackImage'
  ];
  imagesArray = [];

  static navigationOptions = {
    headerShown: false,
  };

  onBackButton = () => {
    if (this.state.page !== 0)
      this.setState({ page: --this.state.page })
    else
      this.props.navigation.goBack(null);
  }

  openCamera = (imageName, type) => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    Alert.alert(
      'Would you like to open Camera or select from Gallery',
      '',
      [
        {
          text: 'Open Camera', onPress: () => {
            ImagePicker.openCamera({
              width: 500,
              height: 600,
              includeBase64: true,
              cropping: true,
            }).then(image => {
              let imageJSX = <Image style={{ width: 180, height: 110, borderRadius: 5 }} source={{ uri: `data:${image.mime};base64,${image.data}` }} />
              this.setState({ loader: true, [imageName]: imageJSX, licenseFrontUri: `data:${image.mime};base64,${image.data}` })
              this.setState({ loader: false })
              this.imagesArray.push(image);
            });
          }
        },
        {
          text: 'Open Gallery', onPress: () => {
            ImagePicker.openPicker({
              width: 500,
              height: 600,
              includeBase64: true,
              cropping: true,
            }).then(image => {
              let imageJSX = <Image style={{ width: 180, height: 110, borderRadius: 5 }} source={{ uri: `data:${image.mime};base64,${image.data}` }} />
              this.setState({ loader: true, [imageName]: imageJSX })
              this.setState({ loader: false })
              this.imagesArray.push(image);
            });
          }
        },
      ],
      { cancelable: true },
    );
  }

  onChangePage = () => {
    // if user is in last page i.e terms and condition page
    if (this.state.page >= 2) {
      if ((this.state.licenseFrontImage !== null && this.state.licenseBackImage !== null) || (this.state.licenseFrontImage === null && this.state.licenseBackImage === null)) {
        this.setState({ isLoading: true })
        const formData = new FormData();
        let imagesName = this.state.licenseFrontImage === null ?
          ['cnicFrontImage', 'cnicBackImage', 'registrationFrontImage']
          : ['licenseFrontImage', 'licenseBackImage', 'cnicFrontImage', 'cnicBackImage', 'registrationFrontImage'];

        imagesName.map((imageName, index) => {
          formData.append('imagesData', {
            name: `${imageName}${this.imagesArray[index].mime === "image/png" ? ".png" : ".jpg"}`,
            type: this.imagesArray[index].mime,
            uri:
              Platform.OS === "android" ? this.imagesArray[index].path : this.imagesArray[index].path.replace("file://", "")
          })
        })


        // driver data sign up 
        this.props.createUser(this.props.route.params.driverFormData)
          .then((res) => {
            resp = res._bodyInit
            // this.setState({ isLoading: false })
            if (res.status !== 200){
              this.setState({ isLoading: false })
              alert(JSON.stringify(res._bodyInit));
            }
            else
              formData.append('driver_id', resp.insertId)

              // upload images to database for current user
            this.props.uploadImages(formData).then(() => {
              // if (this.props.route.params.data) {
                Toast.show('New User Created', Toast.LONG);
                let data = this.props.route.params.data;
                // login the driver to home page
                this.props.passwordLogin(data.number, data.password, data.token)
                  .then(token => {
                    this.setState({ isLoading: false })
                    if (token.status === 200 && token._bodyInit) {
                      jsonWebToken = token._bodyInit.token; //Json web token recieve
                      // save jwt in local storage
                      AsyncStorage.setItem('jwt', jsonWebToken);
                      let decodedJwt = jwtDecode(jsonWebToken)

                      this.props.onSetUserData(decodedJwt);
                      this.props.onSetDriverId(decodedJwt.id);

                      this.props.navigation.navigate('DriverStartShift');
                    }
                  })
              // }
              // else {
              //   Toast.show('Successfully Created', Toast.LONG);
              //   if (this.props.navigation.getParam('fromAuth'))
              //     this.props.navigation.navigate('DriverStartShift');
              //   else
              //     this.props.navigation.navigate('SignUp')
              // }
            })
          })
      }
      else
        alert("Please Upload Both Images")
    }
    // if block for page cnic and registration page in which user have to upload both images
    else if (this.state.page < 2)
      if ((this.state[this.state.imageArray[this.state.page][0]] !== null && this.state[this.state.imageArray[this.state.page][1]] !== null))
        this.setState({ page: ++this.state.page })
      else
        alert("Please Upload Both Images")

  }


  render() {
    if (this.state.isLoading === false) {
      return (
        <View style={{ flex: 1 }}>
          {/* <View>
            <Header isDrawer='false' navigateBack={this.onBackButton} headerText={`${this.state.page >= 3 ? 'Terms & Condition': 'Upload Documents'}`} />
          </View> */}
          <View style={[styles.dragHeaderContainer]} >
            <View style={{ flexDirection: 'row' }}>
              {/* {/ <Image style={{ width: 30, height: 30, marginLeft: 10 }} source={require('../../../assets/icons/app_icon.png')} /> /} */}
              <TouchableOpacity onPress={this.onBackButton} style={{marginLeft: 10}}>
                <Ionicons name="md-arrow-back" size={25} color="white" />
              </TouchableOpacity>
              <TextWithStyle style={{ fontSize: 18, color: 'white', marginLeft: 15, alignSelf: 'center', }}>Upload Documents</TextWithStyle>
            </View>
            {/* {/ <ParentProfileHeader openDrawer={this.onOpenDrawer} headerText={`Today's Trip History`} /> /} */}
          </View >

          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 20, marginHorizontal: 20, flex: 1 }}>
              {this.state.page < 3 &&
                <View style={{}}>

                  {this.state.page === 0 ?
                    <View><TextWithStyle style={[styles.textContainer, { fontSize: RF(3), color: 'black' }]}>CNIC</TextWithStyle>
                      <TextWithStyle style={[styles.textContainer, { fontSize: RF(2.5), color: 'black', marginTop: 10 }]}>1. Get your CNIC Front and Back Side</TextWithStyle></View> : null}
                  {this.state.page === 1 ?
                    <View><TextWithStyle style={[styles.textContainer, { fontSize: RF(3), color: 'black' }]}>Car Registration</TextWithStyle>
                      <TextWithStyle style={[styles.textContainer, { fontSize: RF(2.5), color: 'black', marginTop: 10 }]}>1. Get your Car Registration</TextWithStyle></View> : null}
                  {this.state.page === 2 ?
                    <View><TextWithStyle style={[styles.textContainer, { fontSize: RF(3), color: 'black' }]}>Driving License (OPTIONAL)</TextWithStyle>
                      <TextWithStyle style={[styles.textContainer, { fontSize: RF(2.5), color: 'black', marginTop: 10 }]}>1. Get your Driving License Front and Back Side</TextWithStyle></View> : null}

                  <View>
                    <TextWithStyle style={[styles.textContainer, { fontSize: RF(2.5), color: 'black' }]}>2. Make sure entire image is in frame</TextWithStyle>
                    <TextWithStyle style={[styles.textContainer, { fontSize: RF(2.5), color: 'black' }]}>3. Take Photo</TextWithStyle>
                    <TextWithStyle style={[styles.textContainer, { fontSize: RF(2.5), color: 'black' }]}>1. Uplaod the photo</TextWithStyle>
                  </View>
                </View>}

              {this.state.page < 3 &&
                <View>
                  <View style={{ marginTop: 30, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.openCamera(this.state.imageArray[this.state.page][0])} >
                      {this.state[this.state.imageArray[this.state.page][0]] === null ?
                        <Image source={this.state.page === 2 ? require('../../../assets/icons/driving-license-front.png') : this.state.page === 0 ? require('../../../assets/icons/cnic-front.png') : this.state.page === 1 ? require('../../../assets/icons/car-registration.png') : null} style={this.state.page !== 1 ? { width: 180, height: 110 } : { width: 180, height: 250 }} />
                        :
                        this.state[this.state.imageArray[this.state.page][0]]}
                    </TouchableOpacity>
                  </View>
                </View>}

              {this.state.page < 3 &&
                <View style={{ marginTop: 30, alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.openCamera(this.state.imageArray[this.state.page][1])} >
                    {this.state[this.state.imageArray[this.state.page][1]] === null ?
                      <Image source={this.state.page === 2 ? require('../../../assets/icons/driving-license-back.png') : this.state.page === 0 ? require('../../../assets/icons/cnic-back.png') : null} style={{ width: 180, height: 110 }} />
                      :
                      this.state[this.state.imageArray[this.state.page][1]]}
                  </TouchableOpacity>
                </View>}

              {
                // this.state.page === 3 &&
                // <ScrollView style={{ flex: 1 }}>
                //   {/* <TextWithStyle style={{ color: 'black', fontSize: RF(3), }}>Terms & Condition</TextWithStyle> */}
                //   <TextWithStyle style={{ color: 'black', marginTop: 10 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</TextWithStyle>
                // </ScrollView>
              }
            </View>

            {/* <View style={{ marginTop: 30, marginHorizontal: 20, flex: 1 }}>
              <View style={{ alignItems: 'center' }}>
                {this.state.page === 0 ?
                  <TextWithStyle style={[styles.textContainer, { fontSize: RF(3.5), fontWeight: 'bold' }]}>Upload Driving License</TextWithStyle> : null}
                {this.state.page === 1 ?
                  <TextWithStyle style={[styles.textContainer, { fontSize: RF(3.5), fontWeight: 'bold' }]}>Upload CNIC</TextWithStyle> : null}
                {this.state.page === 2 ?
                  <TextWithStyle style={[styles.textContainer, { fontSize: RF(3.5), fontWeight: 'bold' }]}>Upload Registration Certificate</TextWithStyle> : null}
              </View>

              <View style={{ marginTop: 30, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.openCamera(this.state.imageArray[this.state.page][0])} style={{ backgroundColor: '#d6d6d6', paddingVertical: 21, paddingHorizontal: 29, borderRadius: 50, marginBottom: 10 }}>
                  {this.state[this.state.imageArray[this.state.page][0]] === null ?
                    <Ionicons name="md-image" size={50} color="white" />
                    :
                    this.state[this.state.imageArray[this.state.page][0]]}
                </TouchableOpacity>
                <TextWithStyle style={styles.textContainer}>Upload picture from front</TextWithStyle>
              </View>

              <View style={{ marginTop: 30, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.openCamera(this.state.imageArray[this.state.page][1])} style={{ backgroundColor: '#d6d6d6', paddingVertical: 21, paddingHorizontal: 29, borderRadius: 50, marginBottom: 10 }}>
                  {this.state[this.state.imageArray[this.state.page][1]] === null ?
                    <Ionicons name="md-image" size={50} color="white" />
                    :
                    this.state[this.state.imageArray[this.state.page][1]]}
                </TouchableOpacity>
                <TextWithStyle style={styles.textContainer}>Upload picture from back</TextWithStyle>
              </View>
            </View> */}

            {this.state.page === 2 ?
              <View style={{ alignSelf: 'center', marginBottom: 20, flexDirection: 'row', paddingTop: 10 }}>
                <TextWithStyle>By clicking Sign up you are accepting </TextWithStyle>
                <TextWithStyle style={{ color: '#14345A' }}>Terms and Condition</TextWithStyle>
              </View>
              : null}

            <View style={[styles.button, { justifyContent: 'flex-end', alignItems: 'center' }]}>
              <TouchableOpacity style={{ backgroundColor: '#143459', width: '50%', borderRadius: 8, marginBottom: 20 }} onPress={this.onChangePage}>
                <View style={styles.nextButton}>
                  <TextWithStyle style={[styles.textContainer, { fontSize: RF(3), color: 'white' }]}>{this.state.page < 2 ? 'Next' : 'Signup'}</TextWithStyle>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={{ flex: 1, backgroundColor: '#143459', justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <Image
              source={require('../../../assets/icons/app_icon.png')}
              style={{ width: 70, height: 70, }}
            />
            <Image
              source={require('../../../assets/icons/loading2.gif')}
              style={{ width: 70, height: 20, marginTop: 10 }}
            />
          </View>

        </View>
      )
    }
    // }
    // else {
    //   return (
    //     <View style={styles.container}>
    //       <TextWithStyle>Uploading ...</TextWithStyle>
    //       <ActivityIndicator size={80} color="#0000ff" />
    //     </View>
    //   )
    // }
  }
}



const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 100,
  },

  textContainer: {
    fontSize: RF(2.5),
    fontFamily: "Lato-Regular"
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },

  nextButton: {
    alignItems: 'center',
    padding: 10,
    width: '100%',
    // backgroundColor: "#143459",
    borderRadius: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  dragHeaderContainer: {
    // position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: "#14345A",
    height: 55,
    // flex: 1,
    justifyContent: 'center',
  },

})

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createUser: (details) => dispatch(createUser(details)),
    uploadImages: (images) => dispatch(uploadImages(images)),
    passwordLogin: (number, password, token) => dispatch(passwordLogin(number, password, token)),
    onSetUserData: (id) => dispatch(setUserData(id)),
    onSetDriverId: (id) => dispatch(setDriverId(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents);


        // {/* page 2 for CNIC inputs */}
        // {this.state.page === 2 ?
        //   <View style={{ marginTop: 30, marginHorizontal: 20, flex: 1 }}>
        //     <View style={{ alignItems: 'center' }}>
        //       <TextWithStyle style={[styles.textContainer, { fontSize: RF(3.5), fontWeight: 'bold' }]}>Upload Driving License</TextWithStyle>
        //     </View>

        //     <View style={{ marginTop: 30, alignItems: 'center' }}>
        //       <TouchableOpacity style={{ backgroundColor: '#d6d6d6', paddingVertical: 21, paddingHorizontal: 29, borderRadius: 50, marginBottom: 10 }}>
        //         <Ionicons name="md-image" size={50} color="white" />
        //       </TouchableOpacity>
        //       <TextWithStyle style={styles.textContainer}>Upload front picture of license</TextWithStyle>
        //     </View>

        //     <View style={{ marginTop: 30, alignItems: 'center' }}>
        //       <TouchableOpacity style={{ backgroundColor: '#d6d6d6', paddingVertical: 21, paddingHorizontal: 29, borderRadius: 50, marginBottom: 10 }}>
        //         <Ionicons name="md-image" size={50} color="white" />
        //       </TouchableOpacity>
        //       <TextWithStyle style={styles.textContainer}>Upload back picture of license</TextWithStyle>
        //     </View>
        //   </View>
        //   : null
        // }

        // {/* page 3 for registration certificate */}
        // {this.state.page === 3 ?
        //   <View style={{ marginTop: 30, marginHorizontal: 20, flex: 1 }}>
        //     <View style={{ alignItems: 'center' }}>
        //       <TextWithStyle style={[styles.textContainer, { fontSize: RF(3.5), fontWeight: 'bold' }]}>Upload Driving License</TextWithStyle>
        //     </View>

        //     <View style={{ marginTop: 30, alignItems: 'center' }}>
        //       <TouchableOpacity style={{ backgroundColor: '#d6d6d6', paddingVertical: 21, paddingHorizontal: 29, borderRadius: 50, marginBottom: 10 }}>
        //         <Ionicons name="md-image" size={50} color="white" />
        //       </TouchableOpacity>
        //       <TextWithStyle style={styles.textContainer}>Upload front picture of license</TextWithStyle>
        //     </View>

        //     <View style={{ marginTop: 30, alignItems: 'center' }}>
        //       <TouchableOpacity style={{ backgroundColor: '#d6d6d6', paddingVertical: 21, paddingHorizontal: 29, borderRadius: 50, marginBottom: 10 }}>
        //         <Ionicons name="md-image" size={50} color="white" />
        //       </TouchableOpacity>
        //       <TextWithStyle style={styles.textContainer}>Upload back picture of license</TextWithStyle>
        //     </View>
        //   </View>
        //   : null
        // }


// height, width, path