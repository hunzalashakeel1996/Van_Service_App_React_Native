import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    ActivityIndicator,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import Theme from '../../Theme/Theme';
import Text from './../text/TextWithStyle';
import InputWithIcon from './../input/InputWithIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaskInputWithIcon from './../input/MaskInputWithIcon';
import Button from './../button/Button';
import { connect } from "react-redux";
import { getCountryRegion, getCountryProvince, getCountryCity, getCountryBarangay, getAddressData } from '../../../store/actions/dataAction';
import { useKeyboard } from '@react-native-community/hooks';
// import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';

const AddressModal = (props) => {

    const initControls = {
        address1: {
            value: '',
            validationRules: [
                Validators.required("House No is required")
            ]
        },
        address2: {
            value: '',
            validationRules: [
                Validators.required("Street is required")
            ]
        },
        barangay: {
            value: '',
            validationRules: [
                Validators.required("Barangay is required")
            ]
        },
        region: {
            value: '',
            validationRules: [
                Validators.required("Region is required")
            ]
        },
        city: {
            value: '',
            validationRules: [
                Validators.required("City is required")
            ]
        },
        province: {
            value: '',
            validationRules: [
                Validators.required("Province is required")
            ]
        },
        country: {
            value: 'Philippines',
            validationRules: [
                Validators.required("Country is required")
            ]
        },
        zipCode: {
            value: '',
            validationRules: [
                Validators.required("Zip Code is required")
            ]
        },
    }

    const [controls, setControls] = useState(initControls);
    const [countryData, setCountryData] = useState([]);
    const [regions, setregions] = useState([]);
    const [provinces, setprovinces] = useState([]);
    const [cities, setcities] = useState([]);
    const [barangay, setbarangay] = useState([]);

    const setAddress = () => {
        let keys = Object.keys(controls);
        Validators.validation(keys, { ...controls }).then(validate => {
            if (validate.formValid) {
                let data = {
                    address1: controls.address1.value,
                    address2: controls.address2.value,
                    barangay: controls.barangay.value,
                    region: controls.region.value,
                    city: controls.city.value,
                    province: controls.province.value,
                    country: controls.country.value,
                    zipCode: controls.zipCode.value,
                }
                props.setAddress(data);
            }
            else {
                setControls(validate.controls)
            }

        })
    }

    useEffect(() => {
        props.getCountryRegion().then(regions => {
            
            setregions(regions)
            if (props.address != "") {
                let tempControls = { ...controls };
                tempControls.address1.value = props.address.address1;
                tempControls.address2.value = props.address.address2;
                tempControls.barangay.value = props.address.barangay;
                tempControls.region.value = props.address.region;
                tempControls.city.value = props.address.city;
                tempControls.province.value = props.address.province;
                tempControls.country.value = props.address.country;
                tempControls.zipCode.value = props.address.zipCode;

                setControls(tempControls)
                let data = { regName: props.address.region, provName: props.address.province, cityName: props.address.city }
                props.getAddressData(data).then(res => {
                    setprovinces(res.province)
                    setcities(res.city)
                    setbarangay(res.barangay)
                })
                // getData('region', tempControls.region.value, regions).then(provinces => {
                //     getData('province', tempControls.province.value, provinces).then(cities => {
                //         getData('city', tempControls.city.value, cities)
                //     })
                // })
            }

        })
    }, []);

    const setValue = (type, val) => {
        let cont = { ...controls }
        cont[type].value = val;

        if (cont[type].validationRules) {
            Validators.validation([type], cont).then(validate => {
                setControls(validate.controls)
            });
        } else {
            setControls(cont)
        }
    }

    const setDropDownValue = (type, val) => {
        let cont = { ...controls }
        // if any type of value change(region, province, city) set barangay to empty 
        cont.barangay.value = '';
        setbarangay([])

        // if region change than set all values (province and city) to empty else if province change set city to empty
        if (type === 'region' || type === 'province') {
            if (type === 'region') {
                cont.province.value = '';
                setprovinces([])
            }
            cont.city.value = '';
            setcities([])
        }
        // set change value to its corresponding control
        cont[type].value = val

        if (cont[type].validationRules) {
            Validators.validation([type], cont).then(validate => {
                setControls(validate.controls)
            });
        } else {
            setControls(cont)

        }

        // conditions to check which type to get from database
        if (val !== '') {
            getData(type, val)
            // if (type === 'region'){
            //     let regCode = regions[regions.findIndex(region => {return region.regDesc === val})].regCode
            //     props.getCountryProvince(regCode).then(province => {
            //         setprovinces(province)
            //     })
            // }

            // else if (type === 'province'){
            //     let provCode = provinces[provinces.findIndex(province => {return province.province_name === val})].provCode
            //     props.getCountryCity(provCode).then(city => {
            //         setcities(city)
            //     })
            // }

            // else{
            //     let citymunCode = cities[cities.findIndex(city => {return city.city_name === val})].citymunCode
            //     props.getCountryBarangay(citymunCode).then(barangay => {
            //         setbarangay(barangay)
            //     })
            // }

        }
    }

    const getData = (type, val, data) => {
        // if data parameter is undefined it means user method called from setDropdownValue else called from useEffect 
        return new Promise((resolve, reject) => {
            if (type === 'region') {
                data = data ? data : regions
                let regCode = data[data.findIndex(region => { return region.regDesc === val })].regCode
                props.getCountryProvince(regCode).then(province => {
                    setprovinces(province)
                    resolve(province)

                })
            }
            else if (type === 'province') {
                data = data ? data : provinces
                let provCode = data[data.findIndex(province => { return province.province_name === val })].provCode
                props.getCountryCity(provCode).then(city => {
                    setcities(city)
                    resolve(city)

                })
            }
            else if (type === 'city') {
                data = data ? data : cities
                let citymunCode = data[data.findIndex(city => { return city.city_name === val })].citymunCode
                props.getCountryBarangay(citymunCode).then(barangay => {
                    setbarangay(barangay)
                    resolve()

                })
            }
        })
    }

    // const setRegion = (type, val) => {
    //     let cont = { ...controls }
    //     cont.region.value = val;
    //     cont.province.value = '';
    //     cont.city.value = '';
    //     cont.barangay.value = '';
    //     setprovinces([])
    //     setcities([])
    //     setbarangay([])
    //     if (cont.region.validationRules) {
    //         Validators.validation([type], cont).then(validate => {
    //             setControls(validate.controls)
    //         });
    //     } else {
    //         setControls(cont)

    //     }
    //     console.warn(val)
    //     if (val !== '')
    //         props.getCountryProvince(val).then(province => {
    //             setprovinces(province)
    //         })
    // }

    // const setProvince = (type, val) => {
    //     let cont = { ...controls }
    //     cont.province.value = val;
    //     cont.city.value = '';
    //     cont.barangay.value = '';
    //     setcities([])
    //     setbarangay([])
    //     if (cont.province.validationRules) {
    //         Validators.validation([type], cont).then(validate => {
    //             setControls(validate.controls)
    //         });
    //     } else {
    //         setControls(cont)

    //     }
    //     if (val !== '')
    //         props.getCountryCity(val).then(city => {
    //             setcities(city)
    //         })
    // }

    // const setCity = (type, val) => {
    //     let cont = { ...controls }
    //     cont.city.value = val;
    //     cont.barangay.value = '';
    //     setbarangay([])
    //     if (cont.province.validationRules) {
    //         Validators.validation([type], cont).then(validate => {
    //             setControls(validate.controls)
    //         });
    //     } else {
    //         setControls(cont)

    //     }
    //     if (val !== '')
    //         props.getCountryBarangay(val).then(barangay => {
    //             setbarangay(barangay)
    //         })
    // }

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => props.setModalVisible(false)}
            >
                <View style={[styles.container, { marginTop: props.platform === 'ios' ? 20 : null }]}>
                    {/* {console.warn(props.modalVisible)} */}
                    {/* <View style={styles.containerView}> */}
                    <View style={{ height: hp(8), backgroundColor: Theme.SECONDARY_COLOR, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                        <Text style={{ flex: 0.9, color: Theme.WHITE_COLOR }}>Add Address</Text>
                        <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                            <Ionicons name={'close-circle'} size={30} color={Theme.WHITE_COLOR} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 15, marginTop: 20 }}>

                        {/* Address1 => House No */}
                        <InputWithIcon
                            placeholder={`Address 1 (House No)`}
                            // inputText={{ fontSize: 17 }}
                            onChangeText={(val) => setValue('address1', val)}
                            value={controls.address1.value}
                            error={controls.address1.error}
                        />

                        {/* Address1 => House No */}
                        <InputWithIcon
                            placeholder={`Address 2 (Street)`}
                            // inputText={{ fontSize: 17 }}
                            onChangeText={(val) => setValue('address2', val)}
                            value={controls.address2.value}
                            error={controls.address2.error}
                        />

                        {/* Address1 => House No */}
                        <InputWithIcon
                            placeholder={`Zip Code`}
                            // inputText={{ fontSize: 17 }}
                            keyboardType={"numeric"}
                            value={controls.zipCode.value}
                            onChangeText={(val) => setValue('zipCode', val)}
                            error={controls.zipCode.error}
                        />


                        <View style={{ marginBottom: 5 }}>
                            <View style={[styles.input, controls.country.error && styles.inputErr]}>
                                <View style={{ flex: 1 }}>
                                    {/* {props.platform === 'android' ?  */}
                                    <Picker
                                        style={{ height: 50, width: "100%", color: Theme.BORDER_COLOR }}
                                        selectedValue={controls.country.value}
                                        onValueChange={(val) => { setValue('country', val) }}
                                        mode={'dropdown'}>
                                        <Picker.Item label="Philippines" value='Philippines' />
                                        {/* {regions.map(item => (
                                            <Picker.Item key={item.regCode} label={item.regDesc} value={item.regCode} />
                                        ))} */}
                                    </Picker>
                                        {/* :
                                        <RNPickerSelect
                                            value={controls.country.value}
                                            onValueChange={(val) => { setValue('country', val) }}
                                            style={{ viewContainer: { height: 50, width: "100%", justifyContent: 'center', marginLeft: 5 }, inputIOS: { fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR } }}
                                            placeholder={{ label: "Philippines", value: 'Philippines' }}
                                            // onUpArrow={() => { console.warn('a') }}
                                            // onDownArrow={() => { console.warn('a') }}
                                            items={[{ label: "Philippines", value: 'Philippines' }]}
                                        />} */}
                                </View>
                            </View>
                            {controls.country.error && <Text style={styles.text}>{controls.country.error}</Text>}
                        </View>

                        {/* regions list  */}
                        <View style={{ marginBottom: 5 }}>
                            <View style={[styles.input, controls.region.error && styles.inputErr]}>
                                <View style={{ flex: 1 }}>
                                    {props.platform === 'android' ? <Picker
                                        style={{ height: 50, width: "100%", color: Theme.BORDER_COLOR }}
                                        selectedValue={controls.region.value}
                                        onValueChange={(val) => { setDropDownValue('region', val) }}
                                        mode={'dropdown'}>
                                        <Picker.Item label="Region" value='' />
                                        {regions.map(item => (
                                            <Picker.Item key={item.regCode} label={item.regDesc} value={item.regDesc} />
                                        ))}
                                    </Picker>
                                        :
                                        <RNPickerSelect
                                            value={controls.region.value}
                                            onValueChange={(val) => { setDropDownValue('region', val) }}
                                            style={{ viewContainer: { height: 50, width: "100%", justifyContent: 'center', marginLeft: 5 }, inputIOS: { fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR } }}
                                            placeholder={{ label: "Region", value: '' }}
                                            // onUpArrow={() => { console.warn('a') }}
                                            // onDownArrow={() => { console.warn('a') }}
                                            items={regions.map(item => { return { key: item.regCode, label: item.regDesc, value: item.regDesc } })}
                                        />}
                                </View>
                            </View>
                            {controls.region.error && <Text style={styles.text}>{controls.region.error}</Text>}
                        </View>

                        {/* province list  */}
                        <View style={{ marginBottom: 5 }}>
                            <View style={[styles.input, controls.province.error && styles.inputErr]}>
                                <View style={{ flex: 1 }}>
                                    {props.platform === 'android' ? <Picker
                                        style={{ height: 50, width: "100%", color: Theme.BORDER_COLOR }}
                                        selectedValue={controls.province.value}
                                        onValueChange={(val) => { setDropDownValue('province', val) }}
                                        mode={'dropdown'}>
                                        <Picker.Item label="Province" value='' />
                                        {provinces.map(item => (
                                            <Picker.Item key={item.provCode} label={item.province_name} value={item.province_name} />
                                        ))}
                                    </Picker>
                                        :
                                        <RNPickerSelect
                                            value={controls.province.value}
                                            onValueChange={(val) => { setDropDownValue('province', val) }}
                                            style={{ viewContainer: { height: 50, width: "100%", justifyContent: 'center', marginLeft: 5 }, inputIOS: { fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR } }}
                                            placeholder={{ label: "Province", value: '' }}
                                            // onUpArrow={() => { console.warn('a') }}
                                            // onDownArrow={() => { console.warn('a') }}
                                            items={provinces.map(item => { return { key: item.provCode, label: item.province_name, value: item.province_name } })}
                                        />}
                                </View>
                            </View>
                            {controls.province.error && <Text style={styles.text}>{controls.province.error}</Text>}
                        </View>

                        {/* city list  */}
                        <View style={{ marginBottom: 5 }}>
                            <View style={[styles.input, controls.city.error && styles.inputErr]}>
                                <View style={{ flex: 1 }}>
                                    {props.platform === 'android' ? <Picker
                                        style={{ height: 50, width: "100%", color: Theme.BORDER_COLOR }}
                                        selectedValue={controls.city.value}
                                        onValueChange={(val) => { setDropDownValue('city', val) }}
                                        mode={'dropdown'}>
                                        <Picker.Item label="City" value='' />
                                        {cities.map(item => (
                                            <Picker.Item key={item.citymunCode} label={item.city_name} value={item.city_name} />
                                        ))}
                                    </Picker>
                                        :
                                        <RNPickerSelect
                                            value={controls.city.value}
                                            onValueChange={(val) => { setDropDownValue('city', val) }}
                                            style={{ viewContainer: { height: 50, width: "100%", justifyContent: 'center', marginLeft: 5 }, inputIOS: { fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR } }}
                                            placeholder={{ label: "City", value: '' }}
                                            // onUpArrow={() => { console.warn('a') }}
                                            // onDownArrow={() => { console.warn('a') }}
                                            items={cities.map(item => { return { key: citymunCode, label: item.city_name, value: item.city_name } })}
                                        />}
                                </View>
                            </View>
                            {controls.city.error && <Text style={styles.text}>{controls.city.error}</Text>}
                        </View>

                        {/* barangay list  */}
                        <View style={{ marginBottom: 5 }}>
                            <View style={[styles.input, controls.barangay.error && styles.inputErr]}>
                                <View style={{ flex: 1 }}>
                                    {props.platform === 'android' ? <Picker
                                        style={{ height: 50, width: "100%", color: Theme.BORDER_COLOR }}
                                        selectedValue={controls.barangay.value}
                                        onValueChange={(val) => { setValue('barangay', val) }}
                                        mode={'dropdown'}>
                                        <Picker.Item label="Barangay" value='' />
                                        {barangay.map(item => (
                                            <Picker.Item key={item.brgyCode} label={item.brgyDesc} value={item.brgyDesc} />
                                        ))}
                                    </Picker>
                                        :
                                        <RNPickerSelect
                                            value={controls.barangay.value}
                                            onValueChange={(val) => { setValue('barangay', val) }}
                                            style={{ viewContainer: { height: 50, width: "100%", justifyContent: 'center', marginLeft: 5 }, inputIOS: { fontSize: Theme.FONT_SIZE_LARGE, color: Theme.BORDER_COLOR } }}
                                            placeholder={{ label: "Barangay", value: '' }}
                                            // onUpArrow={() => { console.warn('a') }}
                                            // onDownArrow={() => { console.warn('a') }}
                                            items={barangay.map(item => { return { key: brgyCode, label: item.brgyDesc, value: item.brgyDesc } })}
                                        />}
                                </View>
                            </View>
                            {controls.barangay.error && <Text style={styles.text}>{controls.barangay.error}</Text>}
                        </View>


                    </View>
                    <View style={{ height: hp(8), justifyContent: "center", backgroundColor: Theme.WHITE_COLOR, elevation: 5 }}>
                        <View style={{ justifyContent: "center", alignItems: props.platform === 'android'?'center':null}}>
                            <Button  onPress={() => { setAddress() }} styleButton={{ width: "85%", alignSelf: props.platform === 'ios'?'center':null  }} >Done</Button>
                        </View>
                    </View>

                    {/* </View> */}
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: Theme.WHITE_COLOR
        // backgroundColor: "rgba(0,0,0,0.8)"
    },
    input: {
        // flexDirection: "row",
        borderBottomColor: Theme.BORDER_COLOR,
        borderBottomWidth: 1,
        height: 50,
        marginBottom: 2
    },

    inputErr: {
        borderBottomColor: Theme.RED_COLOR,
        borderBottomWidth: 2,
    },
    containerView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        marginTop: 30
        // marginTop: 22

    },
    content: {
        flex: 0.75,
        flexDirection: 'row',
        // justifyContent:'center',
    },
    buttonView: {
        flex: 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Theme.WHITE_COLOR,
        marginHorizontal: 60,
    }
});

const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        platform: state.util.platform
        // userData: state.user.userData,
        // driverDetails: state.user.driverDetails,
        // quotationList: state.data.quotationList,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCountryRegion: () => dispatch(getCountryRegion()),
        getCountryProvince: (code) => dispatch(getCountryProvince(code)),
        getCountryCity: (code) => dispatch(getCountryCity(code)),
        getCountryBarangay: (code) => dispatch(getCountryBarangay(code)),
        getAddressData: (data) => dispatch(getAddressData(data)),
        // rideNowGetAcceptedJob: (data) => dispatch(rideNowGetAcceptedJob(data))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddressModal);
