import React, { Component } from 'react';
import { Image, Platform, StyleSheet, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import RNOtpVerify from 'react-native-otp-verify';

import { codeVerification, onResend, sendSmsMessage } from '../../../store/actions/dataAction';
import TextWithStyle from '../../components/TextWithStyle';

mixins: [TimerMixin];

class Verification extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  time = 120;
  TextInput = [];
  state = {
    code: Array(4).fill(''),
    inputBorderColor: ['rgb(142,142,142)', 'rgb(142,142,142)', 'rgb(142,142,142)', 'rgb(142,142,142)'],
    minutes: parseInt(this.time / 60),
    seconds: parseInt(this.time % 60),
  }

  timerStart = () => {
    this.currTime = new Date();
    this.currTime = this.currTime.getTime();
    this.endTime = (this.currTime + ((this.time + 1) * 1000));  // add 120 seconds to current time in milliseconds;

    //every second we update current time and calculate the time left
    this.timer = TimerMixin.setInterval(() => {
      this.currTime = new Date();
      this.currTime = this.currTime.getTime();
      this.diff_time = (this.endTime - this.currTime) / 1000;
      let minutes = parseInt((this.diff_time) / 60),
        seconds = parseInt((this.diff_time) % 60);

      // if minute and second downs to zero clear interval
      if (minutes <= 0 && seconds <= 0) {
        TimerMixin.clearInterval(this.timer);
        this.setState({
          minutes: 0,
          seconds: 0,
        })
      } else {
        this.setState({
          minutes: minutes,
          seconds: seconds,
        })
      }
    }, 1000);
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.hash = [''];
      !(Platform.OS === 'ios') && this.getHash();
      this.TextInput[0].focus()
      this.codeId = this.props.route.params.id;
      this.startListeningForOtp();

    }, 500)
    this.timerStart();
  }

  getHash = () =>
  RNOtpVerify.getHash()
      .then(key => {
          console.log(key);
          this.hash = key;
      })
      .catch(console.log);

  startListeningForOtp = () =>{
    if(!Platform.OS === 'ios'){
      RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(this.otpHandler))
      .catch(p => console.log(p));
    }
  }
   

  otpHandler = (message) => {
    if (message != 'Timeout Error.') {
      // console.warn('message', message)
      const otp = /(\d{4})/g.exec(message)[1];
      // console.warn('otp', otp)
      let code = [JSON.parse(otp[0]), JSON.parse(otp[1]), JSON.parse(otp[2]), JSON.parse(otp[3])]
      // console.log(code);
      this.setState({ code }, () => this.codeVerification())
      RNOtpVerify.removeListener();
      Keyboard.dismiss();
    }
  }

  onBackButton = () => {
    this.props.navigation.navigate('Login')
  }

  componentWillUnmount() {
    RNOtpVerify.removeListener();

    TimerMixin.clearInterval(this.timer)
  }

  // to change border color when focus or blur of text input
  onBorderColorChange = (index, color) => {
    let temp = this.state.inputBorderColor;
    temp[index] = color;
    this.setState({ inputBorderColor: temp })
  }

  // verfication of input code
  codeVerification = () => {
    let code = `${this.state.code[0]}${this.state.code[1]}${this.state.code[2]}${this.state.code[3]}`
    this.props.codeVerification(this.codeId, code)
      .then(res => {
        if (res.error) {
          alert(res.error);
          this.TextInput[0].focus()
          this.TextInput[0].clear(); this.TextInput[1].clear(); this.TextInput[2].clear(); this.TextInput[3].clear()
        } else {
          // navigate to password page
          this.props.navigation.navigate('Password', { number: this.props.route.params.number, isNew: true })
        }
      })
  }

  // when text value of text input change
  onInputValue = (index, value) => {
    let newCode = [...this.state.code];
    newCode[index] = value
    this.setState({
      code: newCode
    }, () => {
      if (index < this.TextInput.length - 1 && value) {
        this.TextInput[index + 1].focus();
      } else if (index === 3 && value) {
        this.codeVerification();
      }
    })
  }

  focusPrevious(key, index) {
    if (key === 'Backspace' && index !== 0)
      this.TextInput[index - 1].focus();
  }

  onResend = () => {
    this.setState({
      minutes: parseInt(this.time / 60),
      seconds: parseInt(this.time % 60),
    })
    this.props.onResend(this.props.route.params.number, this.hash)
      .then(res => {
        let resp = res
        let data = {
          msg: `Your OPT code for VanWala is ${resp.code}`,
          number: resp.number.replace(/^(0+)/g, '92'),
        }
        // this.props.sendSmsMessage(data).then(() => {
          this.startListeningForOtp();
          this.codeId = resp.id
          this.timerStart();
        // })

      })
  }

  render() {
    return (
      <View >
        <View style={[styles.headerContainer, { height: 110, paddingTop: Platform.OS == 'ios' ? 20 : 0 }]} >
          <Image
            source={require('../../../assets/icons/Home-page-logo.png')}
            style={{ width: 80, height: 80, alignSelf: 'center', marginTop: 10 }}
          />

        </View >

        <View style={{ marginTop: 30, marginHorizontal: 20 }}>
          <View>
            <TextWithStyle style={[styles.textContainer, { alignSelf: 'center' }]}>Enter Verification Code</TextWithStyle>
          </View>
          {/* pointerEvents="none" */}
          <View style={{ marginTop: 30, flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            {this.state.code.map((code, i) => (
              <TextInput key={i} style={[styles.textInput, { marginRight: 10, borderColor: this.state.inputBorderColor[i] }]}
                underlineColorAndroid='transparent'
                value={`${code}`}
                caretHidden={true}
                selectTextOnFocus
                keyboardType={'number-pad'}
                maxLength={1}
                onFocus={() => this.onBorderColorChange(i, '#143459')}
                onBlur={() => this.onBorderColorChange(i, '#dbdbdb')}
                ref={(input) => { this.TextInput[i] = input; }}
                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, i)}
                onChangeText={(val) => { this.onInputValue(i, val) }}>
              </TextInput>
            ))
            }
          </View>

          <View style={{ marginTop: 30, marginBottom: 10 }}>
            <TextWithStyle style={[styles.textContainer, { alignSelf: 'center' }]}>You should be getting a text message shortly</TextWithStyle>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Ionicons name='md-stopwatch' style={{ marginRight: 10 }} size={20} color='red' />
              <TextWithStyle style={{ fontFamily: 'Lato-Regular', fontSize: RF(3), color: 'red', }}>
                {this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}
              </TextWithStyle>
            </View>

            <View style={{ marginTop: 15 }}>
              <TouchableOpacity onPress={this.onResend} disabled={this.state.minutes === 0 && this.state.seconds === 0 ? false : true}>
                <TextWithStyle style={{ color: !(this.state.minutes === 0 && this.state.seconds === 0) ? "rgba(20, 52, 89,.6)" : "rgba(20, 52, 89,1)", fontSize: RF(3) }}
                >Resend</TextWithStyle>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#143459',

    top: 0,
    left: 0,
    zIndex: 100,
  },

  textContainer: {
    fontSize: RF(2.5),
    fontFamily: "Lato-Regular"
  },

  verifyButton: {
    alignItems: 'center',
    padding: 15,
    width: '100%',
    borderRadius: 10,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 25,
    marginBottom: 20,
  },

  nextButton: {
    alignItems: 'center',
    padding: 15,
    width: '100%',
    borderRadius: 10,
  },

  textInput: {
    borderWidth: 1.5,
    borderRadius: 50,
    width: RF(11),
    height: RF(11),
    textAlign: 'center',
    fontSize: RF(5),
    color: '#143459'
  }
})

const mapDispatchToProps = (dispatch) => {
  return {
    codeVerification: (id, code) => dispatch(codeVerification(id, code)),
    onResend: (number, hash) => dispatch(onResend(number, hash)),
    sendSmsMessage: (data) => dispatch(sendSmsMessage(data))
  }
}

export default connect(null, mapDispatchToProps)(Verification);