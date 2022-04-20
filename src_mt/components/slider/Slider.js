import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Theme from '../../Theme/Theme';
const { width: screenWidth } = Dimensions.get('window')

const Slider = (props) => {
    return (
        <View>
            <Carousel
                data={props.data}
                inactiveSlideScale={0.99}
                renderItem={props.renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth*0.9}
                onBeforeSnapToItem={props.setActiveSlide}
            />
            <Pagination
                dotsLength={props.data.length}
                activeDotIndex={props.activeSlide}
                containerStyle={{ position: "absolute", bottom: 0, alignSelf: "center" }}
                dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    // marginHorizontal: 1,
                    backgroundColor: Theme.SECONDARY_COLOR
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                    backgroundColor: Theme.WHITE_COLOR,
                }}
                // dotColor={Theme.PRIMARY_COLOR}
                // inactiveDotColor={Theme.WHITE_COLOR}
                inactiveDotOpacity={1}
                inactiveDotScale={0.6}
            />
        </View>
    );
};


export default Slider;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

});
