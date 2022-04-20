import React, { Component, PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import TimerMixin from 'react-timer-mixin';
import TextWithStyle from '../../../components/TextWithStyle';

mixins: [TimerMixin];

// give timer props in seconds 
class TimerComponent extends PureComponent {
    state = {
        counter: 120,
        minutes: parseInt(120 / 60),
        seconds: parseInt(120 % 60),
    }

    componentDidMount = () => {
        // if (120) {
        this.currTime = new Date();
        this.currTime = this.currTime.getTime();
        this.endTime = (this.currTime + ((this.state.counter + 1) * 1000));  // add 120 seconds to current time in milliseconds;

        // every second we update current time and calculate the time left
        this.state.counter = TimerMixin.setInterval(() => {
            this.currTime = new Date();
            this.currTime = this.currTime.getTime();
            this.diff_time = (this.endTime - this.currTime) / 1000;
            let minutes = parseInt((this.diff_time) / 60),
                seconds = parseInt((this.diff_time) % 60);

            // if minute and second downs to zero clear interval
            if (minutes <= 0 && seconds <= 0) {
                TimerMixin.clearInterval(this.state.counter);
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
        // }
    }

    componentWillUnmount() {
        TimerMixin.clearInterval(this.state.counter)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* <Ionicons name='md-stopwatch' style={{ marginRight: 10 }} size={25} color='#143459' /> */}
                    <TextWithStyle style={styles.text}>
                        {this.state.minutes < 10 && "0"}{this.state.minutes}:{this.state.seconds < 10 && "0"}{this.state.seconds}
                    </TextWithStyle>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0,0,0,0)",
        justifyContent: "center",
        // marginTop: hp(-12),
        position: 'relative',
        // bottom: hp(15),
        alignItems: "center",
        height: hp(5),
        width: wp(22),
        // borderWidth: 2
    },

    content: {
        flexDirection: 'row',
        // padding: RF(2),
        // marginTop: '2%',
        // marginBottom: '10%'
    },

    text: {
        fontFamily: 'Lato-Regular',
        fontWeight: '500',
        fontSize: wp(8),
        color: '#14345A',
    }
});

export default TimerComponent;

