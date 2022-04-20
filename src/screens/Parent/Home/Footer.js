import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { phonecall } from 'react-native-communications';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import TextWithStyle from '../../../components/TextWithStyle';
import { sendNotification, parentTookALeave } from '../../../../store/actions/notification';
import Theme from '../../../components/Theme';

mixins: [TimerMixin];

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
        decision: '',
    }

    componentDidMount = () => {
        this.setState({ timeDifference: new Date().getTime() - new Date(this.props.driverChild.shift_start_time).getTime() },
            () => {
                if (this.props.driverChild.status.split('-vw-')[this.props.driverChild.splitIndex] === 'Waiting' && Math.abs(this.state.timeDifference) <= 10000) {
                    // logic to show 5 second footer style
                    this.setState({ isTimeOut: false })
                    setTimeout(() => {
                        this.setState({ isTimeOut: true })
                    }, 10000)
                }

            })
    }

    componentDidUpdate(prevProps) {
        let driverChildStatus = this.props.driverChild.status.split('-vw-')
        let driverChild = this.props.driverChild

        if (driverChildStatus[0] === 'Arrived' && this.state.timerValue === 120) {
            this.timer()
        }

        else if (prevProps.driverChild.status.split('-vw-')[0] !== driverChildStatus[0] && prevProps.driverChild.child_id === driverChild.child_id && driverChildStatus[0] === 'Picked') {
            // logic to show 5 second footer style
            this.setState({ isTimeOut: false })
            setTimeout(() => {
                this.setState({ isTimeOut: true })
            }, 5000)
        }
        else if (prevProps.driverChild.status.split('-vw-')[driverChild.splitIndex] !== driverChildStatus[driverChild.splitIndex] && driverChildStatus[driverChild.splitIndex] === 'completed') {
            // to check the childs whose shift completed recently to show 5 second footer 
            if (driverChild.drop_time !== null) {
                this.setState({ timeDifference: new Date().getTime() - new Date(driverChild.drop_time).getTime() })
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
        parentTookALeave(
            `${this.props.driverChild.name} is on leave`,
            `You can leave ${this.props.driverChild.name}`,
            this.props.driverChild.id,
            [this.props.driverChild.device_token]
        );
    }


    render() {
        const { driverChild } = this.props
        // =============================================== IF STATUS IS WAITING ====================================
        // conditions to return which view
        if (this.props.driverChild.status.split('-vw-')[0] === 'Waiting') {
            return (
                // show 10 seconds message to parent after that show actual footer
                // footer view for 10 seconds message (start)
                <View>
                    {(this.props.currentTurnUserId.length> 0) &&
                        <View style={{ height: 30, backgroundColor: '#F23031', width: '60%', alignSelf: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <TextWithStyle style={{fontSize: 12, color: 'white'}}>{( !this.props.currentTurnUserId.includes(this.props.userData.id)) ? 'driver is picking up other passengers.' : 'Driver headed to your location.'}</TextWithStyle>
                        </View>
                     } 
                    {/* driver view */}
                    <View style={{ flexDirection: 'row', flex: 1, height: 70, width: '95%', alignSelf: 'center'}}>
                        <TouchableOpacity onPress={() => { this.props.onDriverDetail(driverChild) }} style={{ flexDirection: 'row', flex: 0.4, backgroundColor: '#DDDDDD', borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}>
                            <View style={{ flex: 0.03, backgroundColor: '#14345A', marginVertical: 20 }}></View>

                            <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/call.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.7, justifyContent: 'center', marginLeft: 10 }}>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10 }}>Driver</TextWithStyle>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10, fontWeight: '700', }}>{driverChild.driver_name.split(' ')[0]} {driverChild.driver_name.split(' ')[1]}</TextWithStyle>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', flex: 0.6, backgroundColor: '#E8E8E8', borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                            <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/bus.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.8, justifyContent: 'center', }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 12, fontWeight: 'bold', }}>{driverChild.name.split(' ')[0]} {driverChild.name.split(' ')[1] && driverChild.name.split(' ')[1]} </TextWithStyle>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 12, marginTop: 1, }}>van</TextWithStyle>
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                    <TextWithStyle style={{ color: '#F23031', fontSize: 12 }}>{(this.props.time === undefined || this.props.time === null) ? '' : `${this.props.time} ${this.props.time < 2 ? 'min' : 'mins'} away`}</TextWithStyle>
                                    <TextWithStyle style={{ color: '#757575', fontSize: 9, marginTop: 4, }}>Note: Van Wala is on the way</TextWithStyle>
                                </View>

                            </View>
                        </View>
                    </View>

                </View>
                // <View style={[styles.infoContainer, { backgroundColor: driverChild.status.split('-vw-')[driverChild.splitIndex] === 'Arrived' ? 'rgb(255,59,48)' : '#143459' }]}>
                //   {/* driver view */}
                //   <View style={{ flex: 0.3, paddingLeft: 5, alignItems: 'center', backgroundColor: this.props.color, flexDirection: 'row', height: '100%' }}>
                //     <TouchableOpacity style={{ flex: 0.9, justifyContent: 'center' }} onPress={() => { this.props.onDriverDetail(driverChild) }}>
                //       <Image
                //         source={require('../../../../assets/icons/driver_white.png')}
                //         style={{ width: 40, height: 40, alignSelf: 'center' }}
                //       />
                //       <TextWithStyle style={[styles.textContainer, { alignSelf: 'center' }]}>Driver</TextWithStyle>
                //       <TextWithStyle style={[styles.textContainer, { alignSelf: 'center' }]}>{driverChild.driver_name}</TextWithStyle>
                //     </TouchableOpacity>
                //   </View>

                //   {/* student view */}
                //   <View style={{ flex: 0.7 }}>
                //     <View style={styles.studentNameContainer}>
                //       <View style={{ marginRight: 10, justifyContent: 'center' }}>
                //         <Image
                //           source={require('../../../../assets/icons/bus_white.png')}
                //           style={{ width: 40, height: 40 }}
                //         />
                //       </View>

                //       <View style={{ flex: 1, justifyContent: 'center' }}>
                //         <TextWithStyle style={styles.textContainer}>{driverChild.name} Van:</TextWithStyle>
                //         <View>{driverChild.status.split('-vw-')[driverChild.splitIndex] === 'Arrived' ?

                //           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                //             <Ionicons name="md-stopwatch" size={20} color="#fedd00" />
                //             <TextWithStyle style={[styles.textContainer, { marginLeft: 10, color: "#fedd00", fontWeight: 'bold' }]}>{this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}</TextWithStyle>
                //           </View>
                //           :
                //           <TextWithStyle style={[styles.textContainer, { color: "#fedd00" }]}>{this.props.time === undefined ? '(0 mins) Away' : `(${this.props.time} ${this.props.time < 2 ? 'min' : 'mins'}) Away`}</TextWithStyle>}
                //         </View>
                //       </View>
                //     </View>

                //     <View style={{ flexDirection: "row", paddingVertical: 5 }}>
                //       {/* text of note */}
                //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                //         {lowerPart}
                //       </View>
                //     </View>
                //   </View>
                // </View>
                // actual footer (start)
            )
        }

        // =============================================== IF STATUS IS ARRIVED ====================================
        else if (driverChild.status.split('-vw-')[0] === 'Arrived') {
            return (
                // actual footer (start)
                // driver Details
                <View style={styles.infoContainer}>

                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.onDriverDetail(driverChild) }} style={{ flexDirection: 'row', flex: 0.4, backgroundColor: '#DDDDDD', borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}>
                            <View style={{ flex: 0.05, backgroundColor: this.props.color, marginVertical: 25 }}></View>

                            <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/call.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20, borderColor: '#14345A' }}></View>

                            <View style={{ flex: 0.7, justifyContent: 'center', marginLeft: 10 }}>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10 }}>Driver</TextWithStyle>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10, fontWeight: '700', }}>{driverChild.driver_name.split(' ')[0]} {driverChild.driver_name.split(' ')[1]}</TextWithStyle>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', flex: 0.6, backgroundColor: '#E8E8E8', borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                            <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/bus.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.8, justifyContent: 'center', }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 12, fontWeight: 'bold', }}>{driverChild.name.split(' ')[0]} {driverChild.name.split(' ')[1] && driverChild.name.split(' ')[1]}'s </TextWithStyle>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 12, marginTop: 1, }}>van</TextWithStyle>
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Ionicons name="md-stopwatch" size={15} color="#F23031" />
                                        <TextWithStyle style={{ marginLeft: 10, color: "#F23031", fontSize: 12, }}>{this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}</TextWithStyle>
                                    </View>
                                    <TextWithStyle style={{ color: '#757575', fontSize: 9, marginTop: 4, }}>Note: Van Wala has arrived</TextWithStyle>
                                </View>

                            </View>
                        </View>
                    </View>

                    <View style={{ position: 'absolute', bottom: -10, right: 10, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity disabled={this.state.decision.length > 0 ? true : false} onPress={() => {
                                Alert.alert(
                                    'Leave',
                                    'Are you sure you want to leave?',
                                    [
                                        { text: 'Cancel', onPress: () => { return null } },
                                        { text: 'Confirm', onPress: () => { this.setState({ decision: 'Leave' }); this.sendLeaveNotification() } },
                                    ],
                                    { cancelable: false }
                                )
                            }} style={[styles.button, { backgroundColor: '#EE3E3C',opacity: this.state.decision === 'Leave' ? 0.8 : 1 }]}>
                                <TextWithStyle style={styles.buttonText}>Leave</TextWithStyle>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
        // =============================================== IF STATUS IS ARRIVED END ====================================

        // =============================================== IF STATUS IS PICKED OR DROPPED ====================================

        else if (driverChild.splitIndex === 1 && !['ParentLeft', 'Left'].includes(driverChild.status.split('-vw-')[0])) {
            return (
                <View style={[styles.infoContainer]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.onDriverDetail(driverChild) }} style={{ flexDirection: 'row', flex: 0.4, backgroundColor: '#DDDDDD', borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}>
                            <View style={{ flex: 0.05, backgroundColor: this.props.color, marginVertical: 25 }}></View>

                            <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/call.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.7, justifyContent: 'center', marginLeft: 10 }}>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10 }}>Driver</TextWithStyle>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10, fontWeight: '700', }}>{driverChild.driver_name.split(' ')[0]} {driverChild.driver_name.split(' ')[1]}</TextWithStyle>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', flex: 0.6, backgroundColor: '#E8E8E8', borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                            <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/bus.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.8, alignItems: 'center', flexDirection: 'row', marginRight: 5 }}>
                                <View style={{ flex: 0.8, marginLeft: 10 }}>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 11 }}>
                                        {(driverChild.status.split('-vw-')[1] == 'Dropped') ?
                                            `Van Wala Dropped ${driverChild.name.split(' ')[0]} ${driverChild.name.split(' ')[1] && driverChild.name.split(' ')[1]} `
                                            :
                                            `Van Wala Picked ${driverChild.name.split(' ')[0]} ${driverChild.name.split(' ')[1] && driverChild.name.split(' ')[1]} `}
                                    </TextWithStyle>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            )
        }

        // =============================================== IF STATUS IS COMPLETED ====================================
        else if (driverChild.status.split('-vw-')[0] === 'completed') {
            return (
                <View style={[styles.infoContainer]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.onDriverDetail(driverChild) }} style={{ flexDirection: 'row', flex: 0.4, backgroundColor: '#DDDDDD', borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}>
                            <View style={{ flex: 0.05, backgroundColor: this.props.color, marginVertical: 25 }}></View>

                            <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/call.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.7, justifyContent: 'center', marginLeft: 10 }}>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10 }}>Driver</TextWithStyle>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10, fontWeight: '700', }}>{driverChild.driver_name.split(' ')[0]} {driverChild.driver_name.split(' ')[1]}</TextWithStyle>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', flex: 0.6, backgroundColor: '#E8E8E8', borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                            <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/bus.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.8, alignItems: 'center', flexDirection: 'row', marginRight: 5 }}>
                                <View style={{ flex: 0.8, marginLeft: 10 }}>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 11 }}>
                                        {driverChild.name.split(' ')[0]} {driverChild.name.split(' ')[1] && driverChild.name.split(' ')[1]} shift completed
                                    </TextWithStyle>
                                </View>
                                <View style={{ flex: 0.2 }}>
                                    <Image
                                        source={require('../../../../assets/icons/Tick.png')}
                                        style={{ width: 20, height: 20 }}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            )
        }

        // =============================================== IF STATUS IS LEFT OR PARENT LEFT ====================================
        else if (['Left', 'ParentLeft', 'NotArrived'].includes(driverChild.status.split('-vw-')[0])) {
            return (
                <View style={[styles.infoContainer]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity onPress={() => { this.props.onDriverDetail(driverChild) }} style={{ flexDirection: 'row', flex: 0.4, backgroundColor: '#DDDDDD', borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}>
                            <View style={{ flex: 0.05, backgroundColor: this.props.color, marginVertical: 25 }}></View>

                            <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/call.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.7, justifyContent: 'center', marginLeft: 10 }}>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10 }}>Driver</TextWithStyle>
                                <TextWithStyle style={{ color: '#14345A', fontSize: 10, fontWeight: '700', }}>{driverChild.driver_name.split(' ')[0]} {driverChild.driver_name.split(' ')[1]}</TextWithStyle>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', flex: 0.6, backgroundColor: '#E8E8E8', borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                            <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    source={require('../../../../assets/icons/parent/bus.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>

                            <View style={{ flex: 0.05, borderRightWidth: 0.7, marginVertical: 20 }}></View>

                            <View style={{ flex: 0.8, alignItems: 'center', flexDirection: 'row', marginRight: 5 }}>
                                <View style={{ flex: 0.8, marginLeft: 10 }}>
                                    <TextWithStyle style={{ color: '#14345A', fontSize: 11 }}>
                                        {driverChild.status.split('-vw-')[0] === 'Left' ?
                                            `${driverChild.name.split(' ')[0]} ${driverChild.name.split(' ')[1] && driverChild.name.split(' ')[1]} was not picked from source`
                                            :
                                            `${driverChild.name.split(' ')[0]} ${driverChild.name.split(' ')[1] && driverChild.name.split(' ')[1]} took a leave`}
                                    </TextWithStyle>
                                </View>

                            </View>

                        </View>
                    </View>
                </View>
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
        color: "#14345a",
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
        width: '95%',
        height: 70,
        alignSelf: "center",
        flex: 1,
        backgroundColor: "#E8E8E8",
        marginBottom: 15,
        flexDirection: 'row',
        borderRadius: 15
        // borderBottomColor: 'black',
        // borderBottomWidth: 4
    },

    button: {
        paddingVertical: 3,
        paddingHorizontal: 30,
        borderRadius: 5,
        backgroundColor: 'white'
    },

    buttonText: {
        fontSize: wp('3.5%'),
        color: 'white',
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
        childs: state.map.childs,
        userData: state.user.userData
    }
}


export default connect(mapStateToProps, null)(FooterComponent);

