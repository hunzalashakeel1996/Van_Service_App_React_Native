import jwtDecode from 'jwt-decode';
import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View, TouchableOpacity, PermissionsAndroid, Platform, } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import { getFeesLog } from '../../../../store/actions/dataAction';
import Header from '../Parent Profile/Header';
import TextWithStyle from '../../../components/TextWithStyle';
import Loader from '../../../components/Loader';
import Theme from '../../../components/Theme';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import FileViewer from "react-native-file-viewer";
import Ionicons from "react-native-vector-icons/Ionicons";

class Fee extends Component {
    state = {
        isLoading: false,
        childs: [{ gender: 'male', name: 'johncep', school_name: 'seven oaks high school', fees: 1000, time: new Date() }],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsCovert: {
            Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
        },
        date: '',
        filePath: ''
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.didMount()
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }


    didMount = async () => {
        this.setState({ isLoading: true })
        this.props.getFeesLog({ id: this.props.userData.id })
            .then(res => {
                this.setState({ childs: res, isLoading: false })
            })
    }

    onOpenDrawer = () => {
        this.props.navigation.toggleDrawer();
    };

    isPermitted = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs access to Storage data',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                alert('Write permission err', err);
                return false;
            }
        } else {
            return true;
        }
    };

    createPDF = async (item, type) => {
        if (await this.isPermitted()) {
            let options = {
                //Content to print
                html:
                    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta name="x-apple-disable-message-reformatting" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <meta name="color-scheme" content="light dark" />
                        <meta name="supported-color-schemes" content="light dark" />
                        <title></title>
                        <style type="text/css" rel="stylesheet" media="all">
                        /* -------------------------------------
                        GLOBAL
                        A very basic CSS reset
                    ------------------------------------- */
                    * {
                        margin: 0;
                        padding: 0;
                        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        color: #000
                    }
                    
                    img {
                        max-width: 100%;
                    }
                    
                    body {
                        -webkit-font-smoothing: antialiased;
                        -webkit-text-size-adjust: none;
                        width: 100% !important;
                        height: 100%;
                        line-height: 1.6;
   
                    }
                    
                    / Let's make sure all tables have defaults /
                    table td {
                        vertical-align: top;
                    }
                    
                    /* -------------------------------------
                        BODY & CONTAINER
                    ------------------------------------- */
                    body {
                        background-color: #f6f6f6;
                    }
                    
                    .body-wrap {
                        background-color: #f6f6f6;
                        width: 100%;
                    }
                    
                    .container {
                        display: block !important;
                        max-width: 600px !important;
                        margin: 0 auto !important;
                        / makes it centered /
                        clear: both !important;
                    }
                    
                    .content {
                        max-width: 600px;
                        margin: 0 auto;
                        display: block;
                        padding: 20px;
                    }
                    
                    /* -------------------------------------
                        HEADER, FOOTER, MAIN
                    ------------------------------------- */
                    .main {
                        background: #fff;
                        border: 1px solid #e9e9e9;
                        border-radius: 3px;
                    }
                    
                    .content-wrap {
                        padding: 20px;
                    }
                    
                    .content-block {
                        padding: 0 0 20px;
                    }
                    
                    .header {
                        width: 100%;
                        margin-bottom: 20px;
                    }
                    
                    .footer {
                        width: 100%;
                        clear: both;
                        color: #999;
                        padding: 20px;
                    }
                    .footer a {
                        color: #999;
                    }
                    .footer p, .footer a, .footer unsubscribe, .footer td {
                        font-size: 12px;
                    }
                    
                    /* -------------------------------------
                        TYPOGRAPHY
                    ------------------------------------- */
                    h1, h2, h3 {
                        font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
                        color: #000;
                        margin: 40px 0 0;
                        line-height: 1.2;
                        font-weight: 400;
                    }
                    
                    h1 {
                        font-size: 32px;
                        font-weight: 500;
                    }
                    
                    h2 {
                        font-size: 24px;
                    }
                    
                    h3 {
                        font-size: 18px;
                    }
                    
                    h4 {
                        font-size: 14px;
                        font-weight: 600;
                    }
                    
                    p, ul, ol {
                        margin-bottom: 10px;
                        font-weight: normal;
                    }
                    p li, ul li, ol li {
                        margin-left: 5px;
                        list-style-position: inside;
                    }
                    
                    /* -------------------------------------
                        LINKS & BUTTONS
                    ------------------------------------- */
                    a {
                        color: #1ab394;
                        text-decoration: underline;
                    }
                    
                    .btn-primary {
                        text-decoration: none;
                        color: #FFF;
                        background-color: #1ab394;
                        border: solid #1ab394;
                        border-width: 5px 10px;
                        line-height: 2;
                        font-weight: bold;
                        text-align: center;
                        cursor: pointer;
                        display: inline-block;
                        border-radius: 5px;
                        text-transform: capitalize;
                    }
                    
                    /* -------------------------------------
                        OTHER STYLES THAT MIGHT BE USEFUL
                    ------------------------------------- */
                    .last {
                        margin-bottom: 0;
                    }
                    
                    .first {
                        margin-top: 0;
                    }
                    
                    .aligncenter {
                        text-align: center;
                    }
                    
                    .alignright {
                        text-align: right;
                    }
                    
                    .alignleft {
                        text-align: left;
                    }
                    
                    .clear {
                        clear: both;
                    }
                    
                    /* -------------------------------------
                        ALERTS
                        Change the class depending on warning email, good email or bad email
                    ------------------------------------- */
                    .alert {
                        font-size: 16px;
                        color: #fff;
                        font-weight: 500;
                        padding: 20px;
                        text-align: center;
                        border-radius: 3px 3px 0 0;
                    }
                    .alert a {
                        color: #fff;
                        text-decoration: none;
                        font-weight: 500;
                        font-size: 16px;
                    }
                    .alert.alert-warning {
                        background: #f8ac59;
                    }
                    .alert.alert-bad {
                        background: #ed5565;
                    }
                    .alert.alert-good {
                        background: #1ab394;
                    }
                    
                    /* -------------------------------------
                        INVOICE
                        Styles for the billing table
                    ------------------------------------- */
                    .invoice {
                        margin: 40px auto;
                        text-align: left;
                        width: 80%;
                    }
                    .invoice td {
                        padding: 5px 0;
						width: 50%;
                    }
                    .invoice .invoice-items {
                        width: 100%;
                    }
                    .invoice .invoice-items td {
                        border-top: #eee 1px solid;
                    }
                    .invoice .invoice-items .total td {
                        border-top: 2px solid #333;
                        border-bottom: 2px solid #333;
                        font-weight: 700;
                    }
                    
                    /* -------------------------------------
                        RESPONSIVE AND MOBILE FRIENDLY STYLES
                    ------------------------------------- */
                    @media only screen and (max-width: 640px) {
                        h1, h2, h3, h4 {
                            font-weight: 600 !important;
                            margin: 20px 0 5px !important;
                        }
                    
                        h1 {
                            font-size: 22px !important;
                        }
                    
                        h2 {
                            font-size: 18px !important;
                        }
                    
                        h3 {
                            font-size: 16px !important;
                        }
                    
                        .container {
                            width: 100% !important;
                        }
                    
                        .content, .content-wrap {
                            padding: 10px !important;
                        }
                    
                        .invoice {
                            width: 100% !important;
                        }
                    }
                        </style>
                      <![endif]-->
                      </head>
                      <body>
                      <table class="body-wrap">
                      <tbody><tr>
                          <td></td>
                          <td class="container" width="600">
                              <div class="content">
                                  <table class="main" width="100%" cellpadding="0" cellspacing="0">
                                      <tbody><tr>
                                          <td class="content-wrap aligncenter">
                                              <table width="100%" cellpadding="0" cellspacing="0">
                                                  <tbody><tr>
                                                      <td class="content-block">
                                                            <image src="https://vanwala.pk/Images/email_logo.png"/>
                                                          <h2>Fees Received</h2>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td class="content-block">
                                                          <table class="invoice">
                                                              <tbody>
                                                              <tr>
                                                                  <td>
                                                                      <table class="invoice-items" cellpadding="0" cellspacing="0">
                                                                          <tbody>
                                                                          <tr>
                                                                              <td>Invoice No.</td>
                                                                              <td class="alignright">VW-${new Date().getFullYear()}${item.id}</td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td>Passenger Name</td>
                                                                              <td class="alignright">${this.props.userData.name}</td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td>Month</td>
                                                                              <td class="alignright">${this.state.monthsCovert[item.start_date?.split(' ')[1]]}</td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td>Date</td>
                                                                              <td class="alignright">${item.start_date} - ${item.end_date}</td>
                                                                          </tr>
                                                                          ${item.received_at ? `<tr>
                                                                              <td>Fees Received On</td>
                                                                              <td class="alignright">${item.received_at}</td>
                                                                          </tr>` : ''}
                                                                          <tr class="total">
                                                                              <td class="" width="80%">Amount</td>
                                                                              <td class="alignright">Rs. ${item.fees_paid}</td>
                                                                          </tr>
                                                                      </tbody></table>
                                                                  </td>
                                                              </tr>
                                                          </tbody></table>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td class="content-block">
                                                        Copyright ${new Date().getFullYear()}. All rights reserved. VanWala
                                                      </td>
                                                  </tr>
                                              </tbody></table>
                                          </td>
                                      </tr>
                                  </tbody></table>
                                  <div class="footer">
                                      <table width="100%">
                                          <tbody><tr>
                                              <td class="aligncenter content-block">Questions? Email <a href="mailto:">customerservice@vanwala.pk</a></td>
                                          </tr>
                                      </tbody></table>
                                  </div></div>
                          </td>
                          <td></td>
                      </tr>
                  </tbody></table>
                      </body>
                    </html>`,
                //File Name
                fileName: `VanWala-${this.props.userData.name}-${item.start_date?.split(' ')[1]}-${new Date().getFullYear()}-Receipt`,
                //File directory
                directory: 'Documents',
            };
            let file = await RNHTMLtoPDF.convert(options);
            let path = `file://` + file.filePath
            type == 'share' ? await Share.open({ url: path }).then((res) => {
                console.log(res);
            })
                .catch((err) => {
                    err && console.log(err);
                }) : await FileViewer.open(path, { showOpenWithDialog: true })
            this.setState({ filePath: file.filePath })
        }
    };

    render() {
        const { userData } = this.props;
        const { monthsCovert } = this.state;
        if (this.state.isLoading === false) {
            return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.headerContainer} >
                        <Header  back={() => { this.props.navigation.goBack(null) }} headerText='Fees Schedule' />
                    </View >

                    {/* <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <TextWithStyle style={{ fontSize: wp('5%'), color: '#143459' }}>{this.state.date}</TextWithStyle>
                    </View> */}
                    <FlatList
                        data={this.state.childs}
                        renderItem={({ item, index }) =>
                            <View style={styles.listContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5 }}>Invoice No.</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, fontWeight: 'bold' }}>VW-{new Date().getFullYear()}{item.id}</TextWithStyle>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5 }}>Passenger Name</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, fontWeight: 'bold' }}>{userData.name}</TextWithStyle>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5 }}>Month</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, fontWeight: 'bold' }}>{monthsCovert[item.start_date?.split(' ')[1]]}</TextWithStyle>
                                </View><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5 }}>Date</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, fontWeight: 'bold' }}>{item.start_date} - {item.end_date}</TextWithStyle>
                                </View><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5 }}>Amount</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, fontWeight: 'bold' }}>Rs. {item.fees_paid}</TextWithStyle>
                                </View>
                                {(item.status == 'Paid' && item.received_at) && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5 }}>Fees Received On</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, fontWeight: 'bold' }}>{item.received_at}</TextWithStyle>
                                </View>}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5 }}>Status</TextWithStyle>
                                    <View style={{ backgroundColor: item.status == 'Paid' ? '#26b24a' : '#ee3d3c', marginBottom: 5, width: 80, borderRadius: 5, alignItems: 'center', paddingVertical: 2 }}>
                                        <TextWithStyle style={{ color: 'white' }}>{item.status}</TextWithStyle>
                                    </View>
                                </View>
                                {item.status == 'Paid' && <View style={{ borderTopWidth: 1, borderTopColor: Theme.BORDER_COLOR, marginTop: 5, flexDirection: 'row', paddingTop: 2 }}>
                                    <TouchableOpacity onPress={() => this.createPDF(item, 'share')} style={{ flex: 1, fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, alignItems: 'center', paddingVertical: 5, borderRightWidth: 1, borderRightColor: Theme.BORDER_COLOR, }}>
                                        <TextWithStyle><Ionicons name={"share"} size={18} />Share</TextWithStyle></TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.createPDF(item, 'pdf')} style={{ flex: 1, fontSize: Theme.FONT_SIZE_LARGE, paddingBottom: 5, alignItems: 'center', paddingVertical: 5 }}>
                                        <TextWithStyle><Ionicons name={"save"} size={18} /> Save as PDF</TextWithStyle></TouchableOpacity>
                                </View>}
                                {/* <View>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM, fontWeight: 'bold' }}>{item.start_date?.split(' ')[1]}</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM }}>{item.start_date} - {item.end_date}</TextWithStyle>
                                    <TextWithStyle style={{ fontSize: Theme.FONT_SIZE_MEDIUM }}>Rs. {item.fees_paid}</TextWithStyle>
                                    <View style={{ backgroundColor: '#26b24a', borderRadius: 5, alignItems: 'center', paddingVertical: 2 }}>
                                                    <TextWithStyle style={{ color: 'white' }}></TextWithStyle>
                                               </View>
                                </View> */}
                            </View >
                            // <View style={styles.listContainer}>
                            //     <View style={{ flexDirection: 'row' }}>
                            //         {/* <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', marginRight: 20, marginLeft: 10 }}>
                            //             <Image source={item.gender === 'Male' ? require('../../../../assets/icons/male-child.png') : require('../../../../assets/icons/girl-child.png')} style={{ width: 45, height: 45, borderRadius: 50, backgroundColor: '#143459' }} />
                            //         </View> */}

                            //         <View style={{ flex: 0.7, justifyContent: 'center' }}>
                            //             <TextWithStyle style={{ fontSize: 14 }}>From: {item.start_date}</TextWithStyle>
                            //             <TextWithStyle style={{fontSize: 10,}}>______________________________________________</TextWithStyle>
                            //             <TextWithStyle style={{ fontSize: 14, marginTop: 12 }}>To: {item.end_date}</TextWithStyle>
                            //         </View>


                            //         <View style={{ flex: 0.3, justifyContent: 'center' }}>
                            //             {item.fees_paid ? <View>
                            //                 <TextWithStyle style={{ fontSize: wp('4.5%'), color: 'black', fontWeight: 'bold', }}>Rs. {item.fees_paid}/-</TextWithStyle>
                            //                 {item.status === 'Paid' ?
                            //                     <View style={{ backgroundColor: '#26b24a', borderRadius: 5, alignItems: 'center', paddingVertical: 2 }}>
                            //                         <TextWithStyle style={{ color: 'white' }}>Paid</TextWithStyle>
                            //                     </View>
                            //                     :
                            //                     <View style={{ backgroundColor: '#ee3d3c', borderRadius: 5, alignItems: 'center', paddingVertical: 2 }}>
                            //                         <TextWithStyle style={{ color: 'white' }}>Pending</TextWithStyle>
                            //                     </View>

                            //                 }
                            //             </View>
                            //                 :
                            //                 <View>
                            //                     <TextWithStyle style={{ fontSize: wp('4.5%'), color: 'black', fontWeight: 'bold', }}>Pending</TextWithStyle>
                            //                 </View>}
                            //         </View>

                            //     </View>
                            // </View>
                        }
                        keyExtractor={(index) => JSON.stringify(index)
                        }
                    />
                </View >
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.headerContainer, { flex: 1 }]} >
                        <Header back={() => { this.props.navigation.goBack(null) }} headerText='Fee Schedule' />
                    </View>
                    <Loader />

                </View>
            )
        }
    }
}

mapStateToProps = (state) => {
    return {
        userData: state.user.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getFeesLog: (data) => dispatch(getFeesLog(data)),
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        marginBottom: 20,
        top: 0,
        left: 0,
        zIndex: 100,
    },

    listContainer: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: '#edecec',
        padding: 10,
        paddingHorizontal: 20,
        margin: 10,
        // alignItems: 'center',
        borderRadius: 8
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Fee);
