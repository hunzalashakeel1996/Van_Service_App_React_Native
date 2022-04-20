import React, { Component } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    FlatList,
    StyleSheet,
    ActivityIndicator 
} from "react-native";
import Theme from '../../Theme/Theme';
import LoaderModal from './LoaderModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Text from './../text/TextWithStyle';
import Header from '../header/Header';
import InputWithIcon from './../input/InputWithIcon';
import { connect } from "react-redux";
import { getVariants } from './../../../store/actions/dataAction';
import InputWithBorder from './../input/InputWithBorder';

class BrandModal extends Component {
    state = {
        isLoading: false,
        make: this.props.makes,
        model: [],
        variant: [],
        selectedModel: '',
        selectedMake: '',
        currentData: 'make',
        filterData: this.props.makes
    }

    onSearchData = (val) => {
        let filterData = []
        if(this.state.currentData === 'make')
            filterData = this.state.make.filter(single => {return single.make.includes(val)})
        else if(this.state.currentData === 'model')
            filterData = this.state.model.filter(single => {return single.includes(val)})
        else
            filterData = this.state.make.filter(single => {return single.variant.includes(val)})

        this.setState({filterData})

    }

    onValueSelect = (item, index) => {
        if (this.state.currentData === 'make') {
            let model = item.model.split('-MT-')
            this.setState({ model, filterData: model, currentData: 'model', selectedMake: item.make })
        }
        else if(this.state.currentData === 'model'){
            this.setState({isLoading: true})
            this.props.getVariants(item).then(data => {
                this.setState({variant: data, currentData: 'variant', isLoading: false, filterData: data, selectedModel: item})
            })
        }
        else{
            let data = {make: this.state.selectedMake, model: this.state.selectedModel, variant: item.variant, year: item.year}
            this.props.selectionComplete(data)
        }
    }

    onBackPress = () => {
        // if make data is open than close the modal
        if(this.state.currentData === 'make')
            this.props.setModalVisible(false)
        // if model data is open than back model one step i,e show make data
        else if(this.state.currentData === 'model')
            this.setState({ filterData: this.state.make, currentData: 'make' })
        else {
            this.setState({ filterData: this.state.model, currentData: 'model' })
        }
    }

    capitialize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    render() {
        let { isLoading, make, filterData, currentData } = this.state;
        let { modalVisible, setModalVisible } = this.props;

        return (
            <View>
                { <LoaderModal modalVisible={isLoading} />}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible === 'BrandModal'}
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.container}>
                        <Header text={this.capitialize(currentData)} onBackPress={() => { this.onBackPress() }} />
                        
                        <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                            <InputWithBorder
                                placeholder={`Search`}
                                // inputText={{ fontSize: 17 }}
                                // keyboardType={"numeric"}
                                onChangeText={(val) => this.onSearchData(val)}
                            />
                        </View>

                        <FlatList
                            data={filterData}
                            style={{ flex: 1, marginHorizontal: 15 }}
                            keyExtractor={(item, index) => index}//has to be unique   
                            renderItem={({ item, index }) => (<>
                                <TouchableOpacity onPress={() => {this.onValueSelect(item, index)}} style={{ marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: Theme.BORDER_COLOR_OPACITY, paddingVertical: 10 }}>
                                    <Text style={{fontSize: Theme.FONT_SIZE_LARGE, marginLeft: 10}}>{currentData === 'make' ? item.make : currentData === 'model' ? item : item.variant}</Text>
                                </TouchableOpacity>
                            </>)}
                            // horizontal={false}
                            // numColumns={1}
                        />

                    </View> 
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: Theme.WHITE_COLOR
        // backgroundColor: "rgba(0,0,0,0.8)"
    },
})

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        userData: state.user.userData,
        // driverDetails: state.user.driverDetails,
        // quotationList: state.data.quotationList,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getVariants: (data) => dispatch(getVariants(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandModal);