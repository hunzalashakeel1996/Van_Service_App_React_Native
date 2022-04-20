import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { phonecall } from 'react-native-communications';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import TextWithStyle from './../../../components/TextWithStyle';
import { sendNotification, parentTookALeave } from '../../../../store/actions/notification';

const { height, width } = Dimensions.get('window');
mixins: [TimerMixin];
// const { height, width } = Dimensions.get('window');

class FooterComponent extends Component {
    constructor(props) {
        super(props);
        this.counter = 120;
    }

    state = {
        timerValue: 120,
        minutes: parseInt(120 / 60),
        seconds: parseInt(120 % 60),
        isTimeOut: true,                  // variable to check if 5 secind timeout is over or not for footer
        timeDifference: 10000,
        decision: '',                     // variable to save decision either drop or leave
    }

    componentDidMount = () => {
        this.setState({ timeDifference: new Date().getTime() - new Date(this.props.driverChild.shift_start_time).getTime() },
            () => {
                if (this.props.driverChild.status === 'Waiting' && Math.abs(this.state.timeDifference) <= 10000) {
                    // logic to show 5 second footer style
                    this.setState({ isTimeOut: false })
                    setTimeout(() => {
                        this.setState({ isTimeOut: true })
                    }, 10000)
                }
            })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.driverChild.status !== this.props.driverChild.status && this.props.driverChild.status === 'Arrived') {
            this.setState({ timerValue: 120 }, () => {
                this.timer()

            })
        }
        else if (prevProps.driverChild.status !== this.props.driverChild.status && this.props.driverChild.status === 'Picked') {
            // logic to show 5 second footer style
            this.setState({ isTimeOut: false })
            setTimeout(() => {
                this.setState({ isTimeOut: true })
            }, 5000)
        }
        else if (prevProps.driverChild.status !== this.props.driverChild.status && this.props.driverChild.status === 'completed') {
            // to check the childs whose shift completed recently to show 5 second footer 
            if (this.props.driverChild.drop_time !== null) {
                this.setState({ timeDifference: new Date().getTime() - new Date(this.props.driverChild.drop_time).getTime() })
            }
        }
    }

    timer = () => {
        this.setState({ decision: '' })
        //set current time and end time which is 2 mins added to current time 
        this.currTime = new Date();
        this.currTime = this.currTime.getTime();
        this.endTime = (this.currTime + ((this.state.timerValue + 1) * 1000));  // add 120 seconds to current time in milliseconds;

        //every second we update current time and calculate the time left
        this.state.timerValue = TimerMixin.setInterval(() => {
            this.currTime = new Date();
            this.currTime = this.currTime.getTime();
            this.diff_time = (this.endTime - this.currTime) / 1000;
            let minutes = parseInt((this.diff_time) / 60),
                seconds = parseInt((this.diff_time) % 60);

            // if minute and second downs to zero clear interval
            if (minutes <= 0 && seconds <= 0) {
                TimerMixin.clearInterval(this.state.timerValue);
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

    sendLeaveNotification = () => {
        // console.warn(this.props.driverChild.device_token)
        parentTookALeave(
            `${this.props.driverChild.child_name} is on leave`,
            `You can leave ${this.props.driverChild.child_name}`,
            this.props.driverChild,
            [this.props.driverChild.device_token]
        );
    }


    render() {
        // alert(`${JSON.stringify(this.props.driverChild.status)} ${JSON.stringify(this.props.driverChild.child_name)}`)
        let lowerPart;
        // this.props.driverChild.status === 'Arrived' ? this.state.timerValue() : null

        this.props.driverChild.status === 'Waiting' ?
            !this.state.isTimeOut ?
                <View style={{ flexDirection: 'row' }}>
                    <TextWithStyle style={[styles.textContainer, { color: "white", fontSize: wp('3.5%'), marginRight: 5 }]}>
                        Shift start. Be ready
        </TextWithStyle>

                </View>
                :
                lowerPart =
                <View style={{ flexDirection: 'row' }}>
                    {/* <TextWithStyle  style={[styles.textContainer, { color: "white", fontSize: wp('3.5%'), marginRight: 5 }]}>
          Note:
          </TextWithStyle> */}
                    <TextWithStyle style={[styles.textContainer, { color: "#fedd00", fontSize: wp('3.5%'), marginRight: 10, }]}>
                        Van Wala Is On The Way
        </TextWithStyle>
                    {/* {this.props.driverChild.shift_type === 'Pick' ? 
        <TouchableOpacity  onPress={() => {this.setState({decision: 'Leave'}); this.sendLeaveNotification()}} style={[styles.button, {backgroundColor: this.state.decision === 'Leave' ? '#bababa': 'white'}]}>
          <TextWithStyle style={styles.buttonText}>Leave</TextWithStyle>
        </TouchableOpacity>
        : null} */}
                </View>
            : null

        // when driver arrived show two buttons to parent on each footer
        this.props.driverChild.status === 'Arrived' ?
            lowerPart =
            <View style={{ flexDirection: 'row' }}>
                <TextWithStyle style={{ alignSelf: 'center', marginRight: 10, color: 'white' }}>Van Wala Has Arrived</TextWithStyle>
                {/* <TouchableOpacity disabled={this.state.decision.length > 0 ? true : false} onPress={() => {this.setState({decision: 'Drop'})}} style={[styles.button, { marginRight: 15, backgroundColor: this.state.decision === 'Drop' ? '#bababa': 'white' }]}>
          <TextWithStyle style={styles.buttonText}>Drop</TextWithStyle>
        </TouchableOpacity> */}
                <TouchableOpacity disabled={this.state.decision.length > 0 ? true : false} onPress={() => { this.setState({ decision: 'Leave' }); this.sendLeaveNotification() }} style={[styles.button, { backgroundColor: this.state.decision === 'Leave' ? '#bababa' : 'white' }]}>
                    <TextWithStyle style={styles.buttonText}>Leave</TextWithStyle>
                </TouchableOpacity>
            </View>
            : null

        // conditions to return which view
        if (this.props.driverChild.status === 'Waiting' || this.props.driverChild.status === 'Arrived') {
            return (
                // show 10 seconds message to parent after that show actual footer
                [this.state.isTimeOut === false ?
                    <View style={[styles.infoContainer, { paddingVertical: 8, backgroundColor: '#143459' }]}>
                        <View style={[styles.circle, { backgroundColor: `${this.props.color}` }]}>

                        </View>
                        {/* student name view */}
                        <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
                            <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
                                <Image
                                    source={require('../../../../assets/icons/bus_white.png')}
                                    style={{ width: 40, height: 40 }}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                {this.props.driverChild.shift_type === 'Pick' ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <TextWithStyle style={[styles.textContainer, { flex: 1, fontSize: wp('4%'), color: 'white', justifyContent: 'center' }]}>
                                            {this.props.driverChild.child_name.charAt(0).toUpperCase() + this.props.driverChild.child_name.slice(1)} Shift Started
                  </TextWithStyle>
                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <TextWithStyle style={[styles.textContainer, { fontSize: wp('4%'), color: 'white', flex: 0.9 }]}>
                                            Van Wala has Picked {this.props.driverChild.child_name.charAt(0).toUpperCase() + this.props.driverChild.child_name.slice(1)} from school
                  </TextWithStyle>

                                        <Image
                                            source={require('../../../../assets/icons/Tick.png')}
                                            style={{ width: 30, height: 30 }}
                                        />
                                    </View>
                                }
                            </View>
                        </View>
                    </View>

                    :
                    // driver Details
                    <View style={[styles.infoContainer, { backgroundColor: this.props.driverChild.status === 'Arrived' ? 'rgb(255,59,48)' : '#143459' }]}>
                        {/* driver view */}
                        <View style={{ flex: 0.3, paddingLeft: 5, alignItems: 'center', backgroundColor: this.props.color, flexDirection: 'row', height: '100%' }}>
                            {/* <View style={{ marginLeft: 15, marginRight: 10, justifyContent: 'center' }}>
              <Image
                source={require('../../../../assets/icons/driver_white.png')}
                style={{ width: 40, height: 40, }}
              />
            </View> */}

                            <TouchableOpacity style={{ flex: 0.9, justifyContent: 'center' }} onPress={() => { this.props.onDriverDetail(this.props.driverChild) }}>
                                {/* <TextWithStyle style={styles.textContainer}>Driver: </TextWithStyle> */}
                                <Image
                                    source={require('../../../../assets/icons/driver_white.png')}
                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                />
                                <TextWithStyle style={[styles.textContainer, { alignSelf: 'center' }]}>Driver</TextWithStyle>
                                <TextWithStyle style={[styles.textContainer, { alignSelf: 'center' }]}>{this.props.driverChild.driver_name}</TextWithStyle>
                            </TouchableOpacity>

                            {/* call icon */}
                            {/* <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}> */}
                            {/* <View style={[styles.iconContainer, { justifyContent: 'flex-end' }]}>
              <TouchableOpacity onPress={() => { phonecall(this.props.driverChild.mobile_number, true) }}>
                <Ionicons name="md-call" size={20} color={this.props.color} />
              </TouchableOpacity>
            </View> */}
                            {/* </View> */}
                        </View>

                        {/* student view */}
                        <View style={{ flex: 0.7 }}>
                            <View style={styles.studentNameContainer}>
                                <View style={{ marginRight: 10, justifyContent: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/icons/bus_white.png')}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TextWithStyle style={styles.textContainer}>{this.props.driverChild.child_name} Van:</TextWithStyle>
                                    {/* <TextWithStyle style={{ color: "#fedd00" }}>{this.counter}</TextWithStyle> */}
                                    <View>{this.props.driverChild.status === 'Arrived' ?

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="md-stopwatch" size={20} color="#fedd00" />
                                            <TextWithStyle style={[styles.textContainer, { marginLeft: 10, color: "#fedd00", fontWeight: 'bold' }]}>{this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}</TextWithStyle>
                                        </View>

                                        : <TextWithStyle style={[styles.textContainer, { color: "#fedd00" }]}>{this.props.time === undefined ? '(0 mins) Away' : `(${this.props.time} mins) Away`}</TextWithStyle>}
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: "row", paddingVertical: 5 }}>
                                {/* text of note */}
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    {lowerPart}
                                </View>
                            </View>
                        </View>

                    </View>
                ]
                // <View style={[styles.infoContainer, { backgroundColor: this.props.driverChild.status === 'Arrived' ? 'rgb(255,59,48)' : '#143459' }]}>

                //   <View style={[styles.circle, { backgroundColor: `${this.props.color}` }]}>

                //   </View>

                //   {/* student name view */}
                //   <View style={styles.studentNameContainer}>
                //     <View style={{ marginRight: 15, justifyContent: 'center' }}>
                //       <Image
                //         source={require('../../../../assets/icons/bus_white.png')}
                //         style={{ width: 40, height: 40 }}
                //       />
                //     </View>
                //     <View style={{ flex: 0.47, borderRightWidth: 2, borderRightColor: "white", justifyContent: 'center' }}>
                //       <TextWithStyle style={styles.textContainer}>{this.props.driverChild.child_name} Van:</TextWithStyle>
                //       {/* <TextWithStyle style={{ color: "#fedd00" }}>{this.counter}</TextWithStyle> */}
                //       <View>{this.props.driverChild.status === 'Arrived' ?
                //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                //           <Ionicons name="md-stopwatch" size={20} color="#fedd00" />
                //           <TextWithStyle style={[styles.textContainer, { marginLeft: 10, color: "#fedd00", fontWeight: 'bold' }]}>{this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}</TextWithStyle>
                //         </View>
                //         : <TextWithStyle style={[styles.textContainer, { color: "#fedd00" }]}>{this.props.time === undefined ? '(0 mins) Away'  : `(${this.props.time} mins) Away`}</TextWithStyle>}
                //       </View>
                //     </View>

                //     {/* driver icon */}
                //     <View style={{ marginLeft: 15, marginRight: 10, justifyContent: 'center' }}>
                //       <Image
                //         source={require('../../../../assets/icons/driver_white.png')}
                //         style={{ width: 40, height: 40, }}
                //       />
                //     </View>

                //     <View style={{ flex: 0.3, justifyContent: 'center' }}>
                //       <TextWithStyle style={styles.textContainer}>Driver: </TextWithStyle>
                //       <TextWithStyle style={styles.textContainer}>{this.props.driverChild.driver_name}</TextWithStyle>
                //     </View>

                //     {/* call icon */}
                //     <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                //       <View style={[styles.iconContainer, { marginRight: 10 }]}>
                //         <TouchableOpacity onPress={() => { phonecall(this.props.driverChild.mobile_number, true) }}>
                //           <Ionicons name="md-call" size={20} color="#143459" />
                //         </TouchableOpacity>
                //       </View>
                //     </View>
                //   </View>

                //   {/* note view */}
                //   <View style={{ flexDirection: "row", padding: 5, width: '100%' }}>
                //     {/* text of note */}
                //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                //       {lowerPart}
                //     </View>

                //     {/* message icon
                //         <View style={styles.iconContainer}>
                //           <TouchableOpacity>
                //             <Ionicons name="md-mail" size={20} color="white" />
                //           </TouchableOpacity>
                //         </View> */}
                //   </View>
                // </View>
            )
        }
        else if (this.props.driverChild.status === 'Picked' || this.props.driverChild.status === 'Dropped') {
            return (
                <View style={[styles.infoContainer, { paddingVertical: 8, backgroundColor: '#143459' }]}>
                    <View style={[styles.circle, { backgroundColor: `${this.props.color}` }]}>

                    </View>
                    {/* student name view */}
                    <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
                        <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
                            <Image
                                source={require('../../../../assets/icons/bus_white.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            {this.state.isTimeOut === true ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <TextWithStyle style={[styles.textContainer, { flex: 1, fontSize: wp('4%'), color: 'white', justifyContent: 'center' }]}>
                                        {this.props.driverChild.status === 'Picked' ? `${this.props.driverChild.child_name.charAt(0).toUpperCase() + this.props.driverChild.child_name.slice(1)} is on the way to ${this.props.driverChild.destination === 'home' ? 'home' : 'school'}` : `${this.props.driverChild.child_name.charAt(0).toUpperCase() + this.props.driverChild.child_name.slice(1)} is dropped to home`}
                                    </TextWithStyle>
                                </View>
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <TextWithStyle style={[styles.textContainer, { fontSize: wp('4%'), color: 'white', flex: 0.9 }]}>
                                        {this.props.driverChild.status === 'Picked' ? `${this.props.driverChild.child_name.charAt(0).toUpperCase() + this.props.driverChild.child_name.slice(1)} is picked from ${this.props.driverChild.destination === 'home' ? 'home' : 'school'}` : `${this.props.driverChild.child_name.charAt(0).toUpperCase() + this.props.driverChild.child_name.slice(1)} is dropped to home`}
                                    </TextWithStyle>

                                    <Image
                                        source={require('../../../../assets/icons/Tick.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                                </View>
                            }
                        </View>
                    </View>
                </View>
            )
        }
        else if (this.props.driverChild.status === 'completed') {
            return (
                this.props.driverChild.status === 'completed' && this.state.timeDifference <= 60000 ?
                    <View style={[styles.infoContainer, { paddingVertical: 10, backgroundColor: '#143459' }]}>
                        <View style={[styles.circle, { backgroundColor: `${this.props.color}` }]}>

                        </View>
                        {/* student name view */}
                        <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
                            <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
                                <Image
                                    source={require('../../../../assets/icons/bus_white.png')}
                                    style={{ width: 40, height: 40 }}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                {/* if current child trip finishes 1 mint before current time than show completed footer else null */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <TextWithStyle style={[styles.textContainer, { fontSize: wp('4%'), color: 'white', flex: 0.9 }]}>
                                        {this.props.driverChild.child_name.charAt(0).toUpperCase() + this.props.driverChild.child_name.slice(1)} is dropped to {this.props.driverChild.destination === 'home' ? 'home' : 'school'}
                                    </TextWithStyle>

                                    <Image
                                        source={require('../../../../assets/icons/Tick.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>
                    : null
            )
        }
        else if (this.props.driverChild.status === 'Left' || this.props.driverChild.status === 'ParentLeft' || this.props.driverChild.status === 'NotArrived') {
            return (
                // this.props.driverChild.status === 'completed' && this.state.timeDifference <= 60000 ?
                <View style={[styles.infoContainer, { paddingVertical: 10, backgroundColor: '#143459' }]}>
                    <View style={[styles.circle, { backgroundColor: `${this.props.color}` }]}>

                    </View>
                    {/* student name view */}
                    <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
                        <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
                            <Image
                                source={require('../../../../assets/icons/bus_white.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            {/* if current child trip finishes 1 mint before current time than show completed footer else null */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <TextWithStyle style={[styles.textContainer, { fontSize: wp('4%'), color: 'white', flex: 0.9 }]}>
                                    {this.props.driverChild.status === 'Left' ?
                                        `${this.props.driverChild.child_name} is not picked from home`
                                        :
                                        this.props.driverChild.status === 'NotArrived' ?
                                            `${this.props.driverChild.child_name} is not picked from school`
                                            :
                                            `${this.props.driverChild.child_name} took a leave`}
                                </TextWithStyle>
                                {/* 
                  <Image
                    source={require('../../../../assets/icons/Tick.png')}
                    style={{ width: 30, height: 30 }}
                  /> */}
                            </View>

                        </View>
                    </View>
                </View>
                // : null
            )
        }
        else {
            return (
                null
            )
        }
    }
}

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: "white",
        elevation: 5,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 100,
        // marginRight: 10
    },

    textContainer: {
        // fontWeight: "bold",
        fontSize: wp('3.5'),
        color: "white",
        fontFamily: "Lato-Regular"
    },

    studentNameContainer: {
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderBottomColor: "white",
        // width: "100%",
        paddingVertical: 5,
        flexDirection: "row",
        marginLeft: 10
    },

    infoContainer: {
        width: '100%',
        alignItems: "flex-start",
        backgroundColor: "#143459",
        marginTop: 3,
        flexDirection: 'row'
        // borderBottomColor: 'black',
        // borderBottomWidth: 4
    },

    button: {
        paddingVertical: 3,
        paddingHorizontal: 30,
        borderRadius: 50,
        backgroundColor: 'white'
    },

    buttonText: {
        fontSize: wp('3.5%'),
        color: 'black',
        fontFamily: 'Lato-Regular'
    },

    circle: {
        position: "absolute",
        left: hp("-7.9%"),
        top: wp('3%'),
        // top: hp('6%'),
        width: hp("9%"),
        height: hp("9%"),
        borderRadius: 100,
        borderColor: "#fff",
        borderWidth: 1,
        zIndex: 100,
    }
});

mapStateToProps = (state) => {
    return {
        childs: state.map.childs
    }
}


export default connect(mapStateToProps, null)(FooterComponent);

// phonecall('0123456789', true)
// disabled={this.state.decision.length > 0 ? true : false}