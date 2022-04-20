import React, { Component, PureComponent } from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TimerMixin from 'react-timer-mixin';
import * as Animatable from 'react-native-animatable';
import Text from "../text/TextWithStyle";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Theme from "../../Theme/Theme";

mixins: [TimerMixin];


// give timer props in seconds 
class TimerComponent extends PureComponent {
    timeCount = this.props.timer > 0 ? this.props.timer : 0;
    state = {
        counter: this.timeCount,
        hours: Math.floor(this.timeCount / 3600),
        minutes: Math.floor(this.timeCount % 3600 / 60),
        seconds: Math.floor(this.timeCount % 3600 % 60),
    }
    Animation = new Animated.Value(0);
    AnimateFontsize = new Animated.Value(10);
    // bool = false;
    componentDidMount = () => {

        if (this.timeCount > 0) {

            //set current time and end time which is 2 mins added to current time 
            this.currTime = new Date();
            this.currTime = this.currTime.getTime();
            this.endTime = (this.currTime + ((this.timeCount + 1) * 1000));  // add 120 seconds to current time in milliseconds;

            //every second we update current time and calculate the time left
            this.timer = TimerMixin.setInterval(() => {
                this.currTime = new Date();
                this.currTime = this.currTime.getTime();
                this.diff_time = (this.endTime - this.currTime) / 1000;
                let hours = Math.floor(this.diff_time / 3600),
                    minutes = Math.floor(this.diff_time % 3600 / 60),
                    seconds = Math.floor(this.diff_time % 3600 % 60);


                // if minute and second downs to zero clear interval
                if (hours <= 0 && minutes <= 0 && seconds <= 0) {
                    this.props.timeCompleted();
                    TimerMixin.clearInterval(this.timer);
                    this.setState({
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                    })
                } else {
                    this.setState({
                        hours,
                        minutes,
                        seconds,
                    })
                }
            }, 1000);
        }
    }

    componentWillUnmount() {
        TimerMixin.clearInterval(this.timer)
    }

    render() {
        const zoomOut = {
            0: {
                opacity: 1,
                scale: 1,
            },
            0.5: {
                opacity: 1,
                scale: 0.8,
            },
            1: {
                opacity: 0.5,
                scale: 0.6,
            },
        };
        return (
            <View style={[styles.container]}>
                {!this.props.animate ? (
                    <View style={[styles.content, this.props.contentStyle]}>
                        {/* <Ionicons name='md-stopwatch' style={{ marginRight: 10 }} size={25} color='#fff' /> */}
                        <Text style={[styles.text, this.props.textStyle]}>
                            {this.props.removeHours ? null : `${(this.state.hours < 10) ? "0" : "" + this.state.hours}:`}
                            {this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}
                        </Text>
                    </View>
                ) : (
                        <Animatable.View animation={(this.state.hours <= 0 && this.state.minutes <= 0 && this.state.seconds <= 30) ? zoomOut : ""} duration={1000} iterationCount={30} direction="alternate" useNativeDriver style={[styles.content]}>
                            {/* <Ionicons name='md-stopwatch' style={{ marginRight: 10 }} size={25} color='#fff' /> */}
                            <Text style={[styles.text, this.props.textStyle]}>
                                {this.state.hours < 10 && "0"}{this.state.hours}:{this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}
                            </Text>
                        </Animatable.View>
                    )
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
        // height: hp(5),
        // width: wp(25),
        elevation: 1,
    },
    content: {
        flexDirection: 'row',
        padding: 10,
    },
    text: {
        fontFamily: 'Lato-Regular',
        fontSize: 20,
        color: Theme.RED_COLOR,
        zIndex: 1,
    }
});

export default TimerComponent;

