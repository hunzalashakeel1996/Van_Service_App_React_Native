import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { RFPercentage as RF } from 'react-native-responsive-fontsize';

import Header from '../Parent Profile/Header';
import TextWithStyle from '../../../components/TextWithStyle';
// import { NavigationEvents } from 'react-navigation';
import Loader from '../../../components/Loader';

class ChildrenProfile extends Component {
    state = {
        loader: false
    }


    static navigationOptions = {
        headerShown: false,
    };

    navigateToChild = (id, name) => {
        this.props.navigation.navigate('SingleChild', { id, name })
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    render() {
        if (this.state.loader === false) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.headerContainer} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText='Children Profile' />
                    </View >

                    <FlatList
                        data={this.props.childs}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity style={styles.list} onPress={() => this.navigateToChild(item.id, item.name)}>
                                {item.profile_picture ?
                                    <View style={{ borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 20, marginLeft: 10 }}>
                                        <Image style={{ borderRadius: 50, width: 45, height: 45, resizeMode: "cover" }} source={{ uri: `${this.props.uploadUrl + item.profile_picture}` }} />
                                    </View>
                                    :
                                    <View style={{ borderRadius: 100, backgroundColor: '#143459', justifyContent: 'center', alignItems: 'center', marginRight: 20, marginLeft: 10 }}>
                                        <Image source={item.gender === 'Male' ? require('../../../../assets/icons/male-child.png') : require('../../../../assets/icons/girl-child.png')} style={{ width: 45, height: 45, }} />
                                    </View>}
                                {/* {this.details.profile_picture ?
                  <View style={{ borderRadius: 50, backgroundColor: '#c4c4c4', alignSelf: 'center', marginTop: 20 }}>
                    <Image style={{ borderRadius: 50, width: 70, height: 70, resizeMode: "cover" }} source={{ uri: `${this.props.uploadUrl + this.details.profile_picture}` }} />
                  </View>
                  :
                  <View style={{ borderRadius: 50, backgroundColor: '#c4c4c4', alignSelf: 'center', marginTop: 20 }}>
                    <Image style={{ width: 70, height: 70 }} source={require('../../../../assets/icons/signup/profile.png')} />
                  </View>} */}
                                <TextWithStyle style={styles.nameText}>{item.name}</TextWithStyle>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Ionicons name="md-arrow-forward" size={20} color="black" />
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={(index) => JSON.stringify(index)}
                    />

                    {/* floater button */}
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('AddNewChild') }} style={[styles.floaterButton]}>
                        <TextWithStyle style={{ fontSize: RF(5), color: 'white', }}>+</TextWithStyle>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <NavigationEvents onDidFocus={() => this.didMount()} /> */}
                    <View style={[styles.headerContainer, { flex: 1 }]} >
                        <Header openDrawer={this.onOpenDrawer} back={() => { this.props.navigation.goBack(null) }} headerText='Children Profile' />
                    </View>
                    <Loader />

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "row",
        marginBottom: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
        marginLeft: 20,
        zIndex: -1,
        backgroundColor: '#ececec',
        borderRadius: 10,
        shadowColor: 'black',
        elevation: 5,
        // borderWidth: 0.3
    },

    headerContainer: {
        width: '100%',
        marginBottom: 20,
        top: 0,
        left: 0,
        zIndex: 100,
    },

    // numberText: {
    //   flex: 0.2,
    //   fontSize: 20,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   paddingLeft: 20,
    //   backgroundColor: 'white',
    //   borderTopLeftRadius: 20,
    //   borderBottomLeftRadius: 20
    // },

    nameText: {
        flex: 0.8,
        fontSize: 20,
        backgroundColor: "#ececec",
        alignSelf: 'center',
        color: 'black'
    },

    floaterButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 10,
        bottom: 30,
        borderRadius: 50,
        backgroundColor: '#143459',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

mapStateToProps = (state) => {
    return {
        childs: state.map.childs,
        uploadUrl: state.data.uploadUrl,
    }
}

export default connect(mapStateToProps, null)(ChildrenProfile);
