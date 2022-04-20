import React, { Component } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated,
  PanResponder,
  Dimensions,
  Text,
  Button
} from "react-native";
import PropTypes from "prop-types";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class DraggableView extends Component {
  constructor(props) {
    super(props);
    const initialUsedSpace = Math.abs(this.props.initialDrawerSize);
    const initialDrawerSize = SCREEN_HEIGHT * (1 - initialUsedSpace);

    this.state = {
      touched: false,
      position: new Animated.Value(initialDrawerSize),
      initialPositon: initialDrawerSize,
      finalPosition: this.props.finalDrawerHeight,
      initialUsedSpace: initialUsedSpace,
      moving: false,
    };
    this.isopened = false;
  }

  isAValidMovement = (distanceX, distanceY) => {
    const moveTravelledFarEnough =
      Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > 2;
    return moveTravelledFarEnough;
  };

  startAnimation = (
    velocityY,
    positionY,
    initialPositon,
    id,
    finalPosition
  ) => {
    const { isInverseDirection } = this.props;

    var isGoingToUp = velocityY < 0 ? !isInverseDirection : isInverseDirection;
    var endPosition = isGoingToUp ? finalPosition + 50 : initialPositon + 50;

    position = new Animated.Value(positionY);
    position.removeAllListeners();

    Animated.timing(position, {
      toValue: endPosition,
      tension: 30,
      friction: 0,
      velocity: velocityY,
      useNativeDriver: false
    }).start();

    position.addListener(position => {
      if (!this.center) return;
      this.onUpdatePosition(position.value);
    });
  };

  onUpdatePosition(position) {
    position = position - 50;
    this.state.position.setValue(position);
    this._previousTop = position;
    const { initialPosition } = this.state;
    if (initialPosition === position) {
      this.props.onInitialPositionReached();
    }
  }

  UNSAFE_componentWillMount() {
    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          this.isAValidMovement(gestureState.dx, gestureState.dy) &&
          this.state.touched
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        this.moveDrawerView(gestureState);
        this.setState({ moving: true });
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.moveFinished(gestureState);
        // this.setState({moving : false}) ;
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ((nextProps.closeView && nextProps.closeView == this.isopened) || (this.props.parentBackButton)) {
      let gestureState = {
        vy: this.state.finalPosition,
        moveY: this.state.finalPosition,
        stateId: undefined,
      };
      this.moveFinished(gestureState)
      this.props.viewClose(false)
    }
  }

  // test = () =>{
  //     let gestureState = {
  //         vy: 1,
  //         moveY: 0,
  //         stateId:undefined,
  //     };
  //     this.moveFinished(gestureState)
  //     this.props.viewClose(false)
  // }



  moveDrawerView(gestureState) {
    if (!this.center) return;
    const position = gestureState.moveY - SCREEN_HEIGHT * 0.05;
    this.onUpdatePosition(position);
  }

  moveFinished(gestureState) {
    const isGoingToUp = gestureState.vy < 0;
    if (!this.center) return;
    this.startAnimation(
      gestureState.vy,
      gestureState.moveY,
      this.state.initialPositon,
      gestureState.stateId,
      this.state.finalPosition
    );
    this.props.onRelease(isGoingToUp);
    if (isGoingToUp) {
      this.isopened = true;
      this.props.Finished(this.isopened)
    } else {
      this.isopened = false;
      this.setState({ moving: false })
      this.props.Finished(this.isopened)
    }
  }



  render() {
    const containerView = this.props.renderContainerView();
    const drawerView = this.props.renderDrawerView();
    const initDrawerView = this.props.renderInitDrawerView();
    // let backgroundcolor = { backgroundColor: this.state.position._value < 440 && this.state.position._value > 348 ? 'rgba(0,0,0,0.3)' : this.state.position._value < 348 && this.state.position._value > 320 ? 'rgba(0,0,0,0.5)' : this.state.position._value < 320 && this.state.position._value > 300 ? 'rgba(0,0,0,0.7)' : this.state.position._value < 300 ? 'rgba(0,0,0,0.9)' : null }

    const drawerPosition = {
      top: this.state.position
    };

    const BackgroundColorConfig = this.state.position.interpolate(
      {
        inputRange: [SCREEN_HEIGHT * 0, SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT * 0.4, SCREEN_HEIGHT * 0.6, SCREEN_HEIGHT * 0.8, SCREEN_HEIGHT * (1 - Math.abs(this.props.initialDrawerSize))],
        outputRange: ['rgba(0,0,0,1)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)',]

      });
    // const BackgroundColorConfig = this.state.position.interpolate(
    //   {
    //     inputRange: [SCREEN_HEIGHT * (1 - Math.abs(this.props.initialDrawerSize)), SCREEN_HEIGHT * (1-0.2), SCREEN_HEIGHT * (1-0.4), SCREEN_HEIGHT * (1-0.6), SCREEN_HEIGHT * (1-0.8), SCREEN_HEIGHT * 0],
    //     outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)',]

    //   });
    // console.warn(Math.abs(SCREEN_HEIGHT * (1 - Math.abs(this.props.initialDrawerSize))) +"-"+ Math.abs(this.state.position._value))

    return (
      <View style={styles.viewport}>
        {this.state.moving && <Animated.View style={[styles.container, { backgroundColor: BackgroundColorConfig }]}>{containerView}</Animated.View>}
        {/* {Math.floor(this.state.position._value) < 440 ? <Animated.View style={[styles.container, {backgroundColor: BackgroundColorConfig}]}>{containerView}</Animated.View> : null} */}
        <Animated.View
          style={[
            drawerPosition,
            styles.drawer,
            {
              backgroundColor: this.props.drawerBg
            }
          ]}
          ref={center => (this.center = center)}
          {...this._panGesture.panHandlers}
        >
          {initDrawerView
            ? (
              <TouchableWithoutFeedback
                onPressIn={() => this.setState({ touched: true })}
                onPressOut={() => this.setState({ touched: false })}
              >
                {initDrawerView}
              </TouchableWithoutFeedback>
            )
            : null
          }
          {drawerView}
          {/* <Button
                                onPress={this.test}
                                title="Close"
                            >
                            </Button> */}
        </Animated.View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  viewport: {
    flex: 1,
    // backgroundColor: "#000",
  },
  drawer: {
    flex: 1,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

DraggableView.propTypes = {
  drawerBg: PropTypes.string,
  finalDrawerHeight: PropTypes.number,
  isInverseDirection: PropTypes.bool,
  onInitialPositionReached: PropTypes.func,
  onRelease: PropTypes.func,
  renderContainerView: PropTypes.func,
  renderDrawerView: PropTypes.func,
  renderInitDrawerView: PropTypes.func
};

DraggableView.defaultProps = {
  drawerBg: "transparent",
  finalDrawerHeight: 0,
  isInverseDirection: false,
  onInitialPositionReached: () => { },
  onRelease: () => { },
  renderContainerView: () => { },
  renderDrawerView: () => { },
  renderInitDrawerView: () => { }
};

export default DraggableView;