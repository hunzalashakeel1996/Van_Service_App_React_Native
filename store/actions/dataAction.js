import { Alert } from "react-native";
import { uiStartLoading, uiStopLoading } from "./uiAction";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { popSeenQuoteId } from "./seenAction";
import { isObjectExist } from './../../src_mt/components/util/ArrayFilter';
import { CommonActions } from '@react-navigation/native';
import { setUserLogout } from "./userAction";
import messaging from '@react-native-firebase/messaging';

// "https://van-wala.herokuapp.com"
// export const url = "http://192.168.0.108:3000";
// export const url = "https://mergemtvw-staging.herokuapp.com";
// export const url = "https://mergemtvw-dev.herokuapp.com";
export const url = "https://mergemtvw.herokuapp.com";
export const uploadUrl = "https://images.vanwala.pk";

//for top level navigation
let _navigator;

export const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
}

const navigate = (name, params) => {
  _navigator.dispatch(
    CommonActions.navigate({
      name,
      params,
    })
  );
}
//end top level navigation

let headerWithWebToken = null

getJwt = () => {
  AsyncStorage.getItem('jwt')
    .then(jwt => {
      return jwt
    })
}

const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
  'Cache-Control': 'no-cache',
}

let setHeaderWithWebToken = () => {
  AsyncStorage.getItem('jwt').then((val) => {
    headerWithWebToken = {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache',
      "jsonwebtoken": val
    }
  })
}

const multipartHeader = {
  Accept: 'application/json',
  "Content-Type": "multipart/form-data",
}

const multipartHeaderWithJWT = AsyncStorage.getItem('jwt').then(val => {
  return {
    Accept: 'application/json',
    "Content-Type": "multipart/form-data",
    "jsonwebtoken": val
  }
})

const apiFetch = (apiUrl, apiMethod, apiHeader, apiBody, auth = true, dispatchAction = false) => {

  let options = {
    method: apiMethod,
    headers: apiHeader,
  }

  apiMethod === "POST" ? options.body = JSON.stringify(apiBody) : null;

  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      dispatch(uiStartLoading());
      fetch(`${url}/${apiUrl}`, options)
        .then(res => {
          if (!res.ok) { return res.text().then(err => { throw new Error(JSON.stringify({ errResponse: res, errText: err })); }) }
          return res.json()
        })
        .then(resJson => {
          if (resJson) {
            dispatchAction && dispatch(dispatchAction(resJson, getState().seen))
            resolve(resJson);
          }
          dispatch(uiStopLoading())
        })
        .catch(err => {
          console.log("api", err, apiUrl)
          dispatch(uiStopLoading());
          ErrorHandler(err, `${url}/${apiUrl}`, apiMethod, apiHeader, getState().user.userData?.id, dispatch);
          // return saveErrorLog(err, apiUrl)
        })

    });
  }
};


const apiUploadFetch = (apiUrl, apiMethod, apiHeader, apiBody,) => {

  return (dispatch, getState) => {

    return new Promise(resolve => {
      dispatch(uiStartLoading());

      fetch(`${uploadUrl}/${apiUrl}`, {
        method: apiMethod,
        headers: apiHeader,
        body: apiBody
      })
        .then(res => {
          if (!res.ok) { return res.text().then(err => { throw new Error(JSON.stringify({ errResponse: res, errText: err })); }) }
          return res.json();
        })
        .then(responseJson => {
          if (responseJson) {
            resolve(responseJson);
          }
          dispatch(uiStopLoading());
        })
        .catch(err => {
          dispatch(uiStopLoading());
          ErrorHandler(err, `${uploadUrl}/${apiUrl}`, apiMethod, apiHeader, getState().user.userData?.id, dispatch);
          // return saveErrorLog(err, apiUrl)
        });
    });
  };
};

const ErrorHandler = (err, apiUrl, apiMethod, apiHeader, user_id = -1, dispatch) => {
  if (err.message == "Network request failed") {
    //network Error
    console.log("Network Error", err);
    Alert.alert("Network Error", `Please check your internet connection`);
  } else {
    let parseError = JSON.parse(err.message);
    // console.log("Network ", parseError)
    if (parseError.errResponse.status == 401) {
      //if authentication problem logout user
      messaging().getToken()
        .then(fcmToken => {
          console.log('aaaa', fcmToken)
          dispatch(DeviceTokenInactive(fcmToken))
          AsyncStorage.clear();
          dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'LoginStack' },],
            })
          );
          dispatch(setUserLogout());
          Alert.alert("Alert", "Please Login Again");
        })
    } else {
      //sql or server Error
      // Alert.alert(`Something went wrong \n Please Try Again`, [
      //   { text: "OK", onPress: () => navigate('Auth') }
      // ]);
      setErrorLog(apiUrl, apiMethod, apiHeader, parseError, user_id)
      navigate("Auth")

    }
  }
}

const setErrorLog = (apiUrl, apiMethod, apiHeader, error, user_id) => {
  // return (dispatch, getState) => {
  let errorBody = {
    user_id,
    action_url: apiUrl,
    response: JSON.stringify(error.errResponse),
    error: error.errText
  }
  fetch(`${url}/api/common/setErrorLog`, {
    method: apiMethod,
    headers: apiHeader,
    body: JSON.stringify({ data: errorBody })
  })
    .then(res => res.json())
    .then((resJson) => {

    })
  // .catch(err => Alert.alert('Sorry', `Server Error please try again later ${err}`))
  // }
}


// ================================================= Parent APIs ===============================================
// get drivers of current parent's childs
export const getDrivers = (childId,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/drivers`, 'POST', headerWithWebToken, { childId },))

}

// get schools for parent signup
export const getSchools = () => {
  return (apiFetch(`api/common/getSchools`, 'GET', header, null,))
}

// get all childs of current parent
export const getChilds = (id, access,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child`, 'POST', headerWithWebToken, { id, access },))
}



// set home location for current user
export const setHomeLocation = (id, coordinate,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/setHomeLocation`, 'POST', headerWithWebToken, { id, coordinate },))
}

// get status of all childs
export const getStatus = (childId, driverId,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/getStatus`, 'POST', headerWithWebToken, { childId, driverId },))
}

// get all trips of current parent childs
export const getTrips = (id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/trips`, 'POST', headerWithWebToken, { id },))

}

// get all notifications of today
export const getNotifications = (id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/notifications`, 'POST', headerWithWebToken, { id },))
}

// get number of unseen notifications
export const getUnseenNotifications = (parent_id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/unseenNotificaitons`, 'POST', headerWithWebToken, { id: parent_id },))
}

// get all notifications of today
export const getFees = (id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/getFees`, 'POST', headerWithWebToken, { id },))
}

// get all trips of current parent's childs
export const getTodayTrips = (parent_id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/getTodayTrips`, 'POST', headerWithWebToken, { parent_id },))
}

export const updateVacation = (item, option, startDate, endDate,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/vacation`, 'POST', headerWithWebToken, { item, option, startDate, endDate },))
}

// set new trip for current child
export const setNewTrip = (id, details,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/setNewTrip`, 'POST', headerWithWebToken, { id, details },))
}

// method to get account details for parent profile screen
export const getAccountDetails = (id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/accountDetails`, 'POST', headerWithWebToken, { id },))
}

// upload single image
export const EditParentProfile = (data, profilePicture,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/EditParentProfile`, 'POST', headerWithWebToken, { data, profilePicture },))
}

// upload single image
export const addNewChild = (data, image,) => {
  return (apiFetch(`api/child/addNewChild`, 'POST', headerWithWebToken, { data, image },))
}

// method to get account details for parent profile screen
export const childInfo = (id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/childInfo`, 'POST', headerWithWebToken, { id },))
}

// method to get account details for parent profile screen
export const getTripsData = (user_id) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/getTripsData`, 'POST', headerWithWebToken, { user_id },))
}

export const insertChild = (_data) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/child/insertChild`, 'POST', headerWithWebToken, { _data },))
}

export const insertTrip = (data) => {
  return (apiFetch(`api/child/insertTrip`, 'POST', headerWithWebToken, { _data },))
}

export const uploadChildsSingupImages = (data,) => {
  return (apiUploadFetch(`api/images/uploadChildsSingupImages`, 'POST', multipartHeader, data,))
};

// ================================================= Login APIs ===============================================
// check for the number at signup if it exist 
export const checkNumberExist = (number,) => {
  return (apiFetch(`api/common/checkNumberExist`, 'POST', header, { number },))
}

//get driver child from db
export const login = (number, hash) => {
  return (apiFetch(`api/login`, 'POST', header, { number, hash },))
};

// delete device token from database of current user when user logged out
export const DeviceTokenInactive = (token,) => {
  return (apiFetch(`api/common/logout`, 'POST', header, { token },))
};

export const codeVerification = (id, code,) => {
  return (apiFetch(`api/login/codeVerification`, 'POST', header, { id, code },))
};

//sign up parent
export const uploadParentSingupImages = (data,) => {
  return (apiUploadFetch(`api/images/uploadParentSingupImages`, 'POST', multipartHeader, data,))
};

//sign up parent
export const uploadParentEditProfilePicture = (data,) => {
  return (apiUploadFetch(`api/images/uploadParentEditProfilePicture`, 'POST', multipartHeader, data,))
};

//sign up parent
export const parentSignUp = (data,) => {
  return (apiFetch(`api/common/parentSignUp`, 'POST', header, { data },))
};

export const onResend = (number, hash) => {
  return (apiFetch(`api/login/Resend`, 'POST', header, { number, hash },))
};

export const passwordLogin = (number, password, token,) => {
  return (apiFetch(`api/login/passwordLogin`, 'POST', header, { number, password, token },))
};

// ================================================= Admin APIs ===============================================
// get all drivers from users
export const adminDriverVerification = (data, index, isAccountVerify,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/adminDriverVerification`, 'POST', headerWithWebToken, { data, index, isAccountVerify },))
}

// get all childs of current school and branch
export const getSchoolChilds = (data,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getSchoolChilds`, 'POST', headerWithWebToken, { data },))
}

// get all drivers from users
export const adminGetDocumentDetails = (id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/adminGetDocumentDetails`, 'POST', headerWithWebToken, { id },))
}

export const adminOnVehicleVerification = (data) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/adminOnVehicleVerification`, 'POST', headerWithWebToken, { data },))
}


export const createUser = (details,) => {
  let headers = multipartHeaderWithJWT._55;
  return (apiFetch(`api/common/signUp`, 'POST', headers, details,))
}

export const getAllChilds = () => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getAllChilds`, 'GET', headerWithWebToken, null,))
}

export const getChildInfo = (id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getChildInfo`, 'POST', headerWithWebToken, { id },))
}

export const assignShiftToTrip = (id, tripId,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/assignShiftToTrip`, 'POST', headerWithWebToken, { id, tripId },))
}

export const getChildsOfSchool = (schoolName, shiftId, status,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getChildsOfSchool`, 'POST', headerWithWebToken, { schoolName, shiftId, status },))
}

export const onAddChildsToShift = (childList,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/onAddChildsToShift`, 'POST', headerWithWebToken, { childList },))
}

//CONTACT US
export const getContacts = () => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getContact`, 'GET', headerWithWebToken, null,))
}

// get all drivers
export const getAllDrivers = () => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getAllDrivers`, 'GET', headerWithWebToken, null,))
}



//get driver shifts
export const getDriverShifts = (driverId,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getDriverShifts`, 'POST', headerWithWebToken, { driver_id: driverId },))
};

//add shift of driver
export const addDriverShift = (data,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/addDriverShift`, 'POST', headerWithWebToken, { data },))
};

//update driver shift
export const updateDriverShift = (data,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/updateDriverShift`, 'POST', headerWithWebToken, { data },))
};

//delete driver shift
export const deleteDriverShift = (shift_id,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/deleteDriverShift`, 'POST', headerWithWebToken, { shift_id },))
};

// get all inactive drivers
export const getInActiveDrivers = () => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/getInActiveDrivers`, 'GET', headerWithWebToken, null,))
}

// when admin add school to database
export const onAddSchool = (data,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/onAddSchool`, 'POST', headerWithWebToken, { data },))
}

// ================================================= Common APIs ===============================================
// upload images
// export const uploadImages = (imagesArray, ) => {
//   return (apiUploadFetch(`api/common/onAddSchool`, 'POST', multipartHeader, imagesArray,))
// }

// send sms to user
export const sendSmsMessage = (data) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading())
      let userName = "923418201201",
        password = "4085",
        getSessionIdUrl = `https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=${userName}&password=${password}&response_type=2`,
        mask = "VAN WALA",
        toNumbersCsv = data.number,
        messageText = data.msg;

      fetch(getSessionIdUrl)
        .then(res => {
          return res.json()
        })
        .then(resJson => {
          if (resJson.Corpsms.response === "OK") {
            let sessionKey = resJson.Corpsms.data,
              ApiSendSmsUrl = `https://telenorcsms.com.pk:27677/corporate_sms2/api/sendsms.jsp?session_id=${sessionKey}&to=${toNumbersCsv}&text=${messageText}&mask=${mask}&response_type=2`;
            fetch(ApiSendSmsUrl)
              .then(res => {
                return res.json()
              })
              .then(responseJson => {
                if (responseJson.Corpsms.response === "OK") {
                  resolve(responseJson.Corpsms)
                } else {
                  // error while sending error 
                  Alert.alert("Error2", `Something went wrong \n ${responseJson.Corpsms.data}`);
                }
                dispatch(uiStopLoading());
              })
          } else {
            //getting session key error 
            Alert.alert("Error1", `Something went wrong \n ${resJson.Corpsms.data}`);
          }
          dispatch(uiStopLoading());
        })
        .catch(err => {
          // network or server error
          Alert.alert("Error", `Something went wrong \n ${err}`);
          dispatch(uiStopLoading());
        })
    })
  }
}

// // upload single image
// export const uploadImage = (image, ) => {
//   let headers = multipartHeaderWithJWT._55;
//   return (apiFetch(`api/common/onAddSchool`, 'POST', headers, image,))
// }

export const changePassword = (id, password, newPassword,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/changePassword`, 'POST', headerWithWebToken, { id, password, newPassword },))
}

export const logout = (token,) => {
  return (apiFetch(`api/common/logout`, 'POST', header, { token },))
}

// set Device Token 
export const setDeviceToken = token => {
  setHeaderWithWebToken()
  return {
    type: "SET_DEVICE_TOKEN",
    token
  };
};

export const setJWT = token => {
  headerWithWebToken = {
    Accept: "application/json",
    "Content-Type": "application/json",
    'Cache-Control': 'no-cache',
    "jsonwebtoken": token
  }
  return {
    type: "SET_JWT",
    token
  };
};

export const accountData = (data) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/common/accountData`, 'POST', headerWithWebToken, { data }))
}

// ===================================================== VW General APIs =======================================

export const VWGeneralUpdateDriverShift = (data,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralCommon/VWGeneralUpdateDriverShift`, 'POST', headerWithWebToken, { data },))
};



export const VWGeneralAddDriverShift = (data,) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralCommon/VWGeneralAddDriverShift`, 'POST', headerWithWebToken, { data },))
};

export const VWGeneralGetUnassignedPassenger = () => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralCommon/VWGeneralGetUnassignedPassenger`, 'POST', headerWithWebToken, {},))
};

// method to get account details for parent profile screen
export const VWGeneralGetTripsData = (user_id) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralPassenger/VWGeneralGetTripsData`, 'POST', headerWithWebToken, { user_id },))
}

export const getSubscriptionFee = () => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralPassenger/getSubscriptionFee`, 'POST', headerWithWebToken, {},))
};

export const VWGeneralGetTrips = (user_id) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralPassenger/getTrips`, 'POST', headerWithWebToken, { user_id },))
};

export const VWGeneralUpdateVacation = (data) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralPassenger/updatevacation`, 'POST', headerWithWebToken, { data },))
}


export const VWGeneralInsertTrip = (data) => {
  return (apiFetch(`api/VWGeneralPassenger/VWGeneralInsertTrip`, 'POST', headerWithWebToken, { data },))
}

export const VWGeneralGetStatus = (data) => {
  return (apiFetch(`api/VWGeneralPassenger/VWGeneralGetStatus`, 'POST', headerWithWebToken, { data },))
}

export const getFeesLog = (data) => {
  return (apiFetch(`api/VWGeneralPassenger/getFeesLog`, 'POST', headerWithWebToken, { data },))
}

export const VWGeneralGetDriverShifts = (id) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralCommon/VWGeneralGetDriverShifts`, 'POST', headerWithWebToken, { id },))
}

export const VWGeneralAddShiftToTrip = (data) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralCommon/VWGeneralAddShiftToTrip`, 'POST', headerWithWebToken, { data },))
}

export const VWGeneralGetTripPassengers = (shift_id) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralCommon/VWGeneralGetTripPassengers`, 'POST', headerWithWebToken, { shift_id },))
}

export const VWGeneralOnSaveSort = (data) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`api/VWGeneralCommon/VWGeneralOnSaveSort`, 'POST', headerWithWebToken, { data },))
}

// ======================================= MT APIs ============================================================
//  ================================================= COMMON ===========================================================
export const requestTripStatus = (data) => {
  return apiFetch('api/MTCommon/requestTripStatus', "POST", headerWithWebToken, { data });
};

export const updateUserProfile = (data) => {
  return apiFetch('api/MTCommon/updateUserProfile', "POST", headerWithWebToken, { data });
};

export const updateUserProfilePicture = (data) => {
  return apiFetch('api/MTCommon/updateUserProfilePicture', "POST", headerWithWebToken, { data });
};

export const updateUserDocuments = (data) => {
  return apiFetch('api/MTCommon/updateUserDocuments', "POST", headerWithWebToken, { data });
};

export const updateVehicleDocuments = (data) => {
  return apiFetch('api/MTCommon/updateVehicleDocuments', "POST", headerWithWebToken, { data });
};

export const getUserData = (data) => {
  return apiFetch('api/MTCommon/getUserData', "POST", headerWithWebToken, { data });
};

// |||||||||||||||||||||||||||||||||||||||||||||||||||||| Payment ||||||||||||||||||||||||||||||||||||||||||||||||
export const transaction = (data) => {
  return apiFetch('api/MTpayment/transaction', "POST", headerWithWebToken, { data });
};

export const createWallet = (user_id) => {
  return apiFetch('api/MTpayment/createWallet', "POST", headerWithWebToken, { user_id });
};

//  ================================================= PASSENGER ===========================================================
// export const getOffers = (trip_id) => {
//   return apiFetch('api/MTPassenger/getOffers', "POST", headerWithWebToken, { trip_id })
// };

export const contractTrip = (data) => {
  return apiFetch('api/MTPassenger/contractTrip', "POST", headerWithWebToken, { data })
};

export const scheduleTripRequest = (trip_data) => {
  return apiFetch('api/MTPassenger/schedule_trip_request', "POST", headerWithWebToken, { trip_data })
};

export const getAdditionalDetails = () => {
  return apiFetch('api/MTPassenger/getAdditionalDetails', "POST", headerWithWebToken, {})
};

export const getRequestTripDetails = (request_id) => {
  return apiFetch('api/MTPassenger/getRequestTripDetails', "POST", headerWithWebToken, { request_id })
};

export const getMTTrips = (user_id) => {
  return apiFetch('api/MTPassenger/getTrips', "POST", headerWithWebToken, {
    user_id
  });
};

export const getMyTripDetails = (user_id) => {
  // return (apiFetch(`api/VWGeneralCommon/VWGeneralAddShiftToTrip`, 'POST', headerWithWebToken, { data }), ))
  return apiFetch(`api/MTPassenger/getMyTripDetails`, "POST", headerWithWebToken, { user_id }, true, setMyTripDetails)
};

export const setMyTripDetails = (payload, getStateSeen) => {
  return {
    type: 'SET_MY_TRIP_DETAILS',
    payload,
    getStateSeen
  }
};

export const getTripDetails = (request_id) => {
  return apiFetch('api/MTPassenger/getTripDetails', "POST", headerWithWebToken, {
    request_id
  }, true, setTripDetails)
};

export const setTripDetails = (payload, getStateSeen) => {
  return {
    type: 'SET_TRIP_DETAILS',
    payload,
    getStateSeen
  }
};

export const setTripRequests = (payload) => {
  return {
    type: 'SET_TRIP_REQUESTS',
    payload,
  }
};

export const addTripRequest = (payload) => {
  return {
    type: 'ADD_TRIP_REQUEST',
    payload,
  }
};

export const addMyTrip = (payload) => {
  return {
    type: 'ADD_MY_TRIP',
    payload,
  }
};

export const updateMyTrip = (payload) => {
  return {
    type: 'UPDATE_MY_TRIP',
    payload,
  }
};

// export const updateTripRequestStatus = (payload) => {
//   return {
//     type: 'UPDATE_TRIP_REQUEST_STATUS',
//     payload,
//   }
// };

export const updateMyTripRequestStatus = (payload) => {
  return {
    type: 'UPDATE_MY_TRIP_REQUEST_STATUS',
    payload,
  }
};

export const addTripDetails = (payload) => {
  return (dispatch) => {
    let status = payload.status;
    // console.log(status)
    if (status == 'confirm_booking') {
      dispatch(popSeenQuoteId('seenOffers'))
    } else if (status === 'booking_accepted') {
      dispatch(popSeenQuoteId('seenMyConfirmation'))
    }

    dispatch(dispatchAddTripDetails(payload))
  }

};

const dispatchAddTripDetails = (payload) => {
  return {
    type: 'ADD_TRIP_DETAILS',
    payload,
  }
}

export const addMyTripDetails = (payload) => {
  return (dispatch) => {
    let status = payload.status;
    // console.log(status)
    if (status == 'confirm_booking') {
      dispatch(popSeenQuoteId('seenOffers'))
    } else if (status === 'booking_accepted') {
      dispatch(popSeenQuoteId('seenMyConfirmation'))
    }

    dispatch(dispatchAddMyTripDetails(payload))
  }

};

const dispatchAddMyTripDetails = (payload) => {
  return {
    type: 'ADD_MY_TRIP_DETAILS',
    payload,
  }
}

//update list is seen, isNew
export const updateTripDetails = (name, quoteId) => {
  // console.log(getStateSeen)
  return {
    type: 'UPDATE_TRIP_DETAILS',
    name,
    quoteId
  }
};

//update list is seen, isNew
export const updateMyTripDetails = (name, data) => {
  // console.log(getStateSeen)
  return {
    type: 'UPDATE_MY_TRIP_DETAILS',
    name,
    data
  }
};

export const resetTripDetails = () => {
  return {
    type: 'RESET_TRIP_DETAILS',
  }
}

export const getVehicleTypes = () => {
  return apiFetch('api/MTPassenger/getVehicleTypes', "POST", headerWithWebToken, {});
};

export const rideNowBookTrip = (data) => {
  return apiFetch('api/MTPassenger/rideNowBookTrip', "POST", headerWithWebToken, { data });
};

export const rideNowGetBookedTrip = (data) => {
  return apiFetch('api/MTPassenger/rideNowGetBookedTrip', "POST", headerWithWebToken, { data });
}

export const rideNowTripRequest = (trip_data) => {
  return apiFetch('api/MTPassenger/rideNowTripRequest', "POST", headerWithWebToken, { trip_data })
};

export const getBillingTrips = (user_id) => {
  return apiFetch('api/MTPassenger/getBillingTrips', "POST", headerWithWebToken, { user_id })
};

export const postFeedback = (data) => {
  return apiFetch('api/MTPassenger/postFeedback', "POST", headerWithWebToken, { data });
};

//  ================================================= DRIVER ===========================================================
export const getQuotationList = (driverId) => {
  return apiFetch('api/MTDriver/quotationList', "POST", headerWithWebToken, { driverId }, true, setQuotationList);
};

export const getDriverTrips = (driverId) => {
  return apiFetch('api/MTDriver/getDriverTrips', "POST", headerWithWebToken, { driverId });
};

export const setQuotationList = (payload, getStateSeen) => {
  // console.log(getStateSeen)
  return {
    type: 'SET_QUOTATION_LIST',
    payload,
    getStateSeen
  }
};

//update list is seen, isNew
export const updateQuotationList = (name, requestId) => {
  // console.log(getStateSeen)
  return {
    type: 'UPDATE_QUOTATION_LIST',
    name,
    requestId
  }
};

export const addQuotationList = (payload) => {
  return (dispatch) => {
    let status = payload.status;
    // console.log(status, status === 'pending')
    if (status == 'pending') {
      dispatch(popSeenQuoteId('seenJobs'))

    } else if (status === 'confirm_booking' || status === 'booking_accepted' || status === 'booking_decline') {
      if (status === 'confirm_booking') {
        dispatch(popSeenQuoteId('seenBids'))

      }
    }

    dispatch(dispatchAddQuotationList(payload))
  }

};

const dispatchAddQuotationList = (payload) => {
  return {
    type: 'ADD_QUOTATION_LIST',
    payload,
  }
}


// const updateSeenCount = (status, dispatch) => {
//   console.log(status, status === 'pending')
//   if (status == 'pending') {
//     dispatch(subtractSeenCount('seenJobs'))
//   } else if (status === 'confirm_booking' || status === 'booking_accepted' || status === 'booking_decline') {
//     if (status === 'confirm_booking') {
//       dispatch(subtractSeenCount('seenBids'))
//     }
//   }
//   // if (status === null) {
//   //   dispatch(addSeenCount('seenJobs'))
//   // } else if (status == 'pending') {
//   //   console.log("status", status)
//   //   dispatch(addSeenCount('seenBids'))
//   //   dispatch(subtractSeenCount('seenJobs'))
//   // } else if (status === 'confirm_booking' || status === 'booking_accepted' || status === 'booking_decline') {
//   //   if (status === 'confirm_booking') {
//   //     dispatch(addSeenCount('seenCustomerConfirmation'))
//   //     dispatch(subtractSeenCount('seenBids'))
//   //   }
//   // }
//   // else if (status === 'booked') {
//   // }
// }



export const quotePrice = (request) => {
  return apiFetch('api/MTDriver/quotePrice', "POST", headerWithWebToken, { request });
};

export const driverDetails = (driver_id) => {
  return apiFetch('api/MTDriver/driverDetails', "POST", headerWithWebToken, { driver_id });
};

export const onTripStatusChange = (data) => {
  return apiFetch('api/MTDriver/onTripStatusChange', "POST", headerWithWebToken, { data });
};

export const addVehicle = (data) => {
  return apiFetch('api/MTDriver/addVehicle', "POST", headerWithWebToken, { data });
};

export const editVehicle = (data) => {
  // headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return apiFetch(`api/MTDriver/editVehicle`, "POST", headerWithWebToken, { data });
};
// export const getBidDetails = (quote_id) => {
//   return apiFetch('api/MTDriver/getBidDetails', "POST", headerWithWebToken, { quote_id });
// };

export const retrieveBid = (quote_id) => {
  return apiFetch('api/MTDriver/retrieveBid', "POST", headerWithWebToken, { quote_id });
};

export const rideNowAvailableJobs = (driver_id) => {
  return apiFetch('api/MTDriver/rideNowAvailableJobs', "POST", headerWithWebToken, { driver_id });
};

export const rideNowStatusChange = (data) => {
  return apiFetch('api/MTDriver/rideNowStatusChange', "POST", headerWithWebToken, { data });
};

export const rideNowGetAcceptedJob = (data) => {
  return apiFetch('api/MTDriver/rideNowGetAcceptedJob', "POST", headerWithWebToken, { data });
};

export const rideNowJobTimeout = (data) => {
  return apiFetch('api/MTDriver/rideNowJobTimeout', "POST", headerWithWebToken, { data });
};

export const rideNowTripCompleted = (data) => {
  return apiFetch('api/MTDriver/rideNowTripCompleted', "POST", headerWithWebToken, { data });
};

export const rideNowQuotePrice = (data) => {
  return apiFetch('api/MTDriver/rideNowQuotePrice', "POST", headerWithWebToken, { data });
};

export const getVehicles = (data) => {
  return apiFetch('api/MTDriver/getVehicles', "POST", headerWithWebToken, { data });
};

export const getMTDrivers = (data) => {
  return apiFetch('api/MTDriver/getDrivers', "POST", headerWithWebToken, { data });
};

export const getMakes = () => {
  return apiFetch('api/MTDriver/getMakes', "POST", headerWithWebToken, {});
};

export const getVariants = (data) => {
  return apiFetch('api/MTDriver/getVariants', "POST", headerWithWebToken, { data });
};

export const notificationTripDetails = (data) => {
  return apiFetch('api/MTDriver/notificationTripDetails', "POST", headerWithWebToken, { data }, false);
};

// export const getAddressData = (data) => {
//   return apiFetch('api/MTDriver/getAddressData', "POST", headerWithWebToken, { data });
// };

// ==================================================== Notification POPUP ================================================
export const navigateToNotification = (Route, data = { isPress: false }) => {
  return async (dispatch, getState) => {
    let status = data.notification.status;
    const tripDataStatus = status === "pending" && "offers" ||
      status === "booking_accepted" && "driverConfirmation" ||
      status === "booked" && "contract";
    const userData = getState().user.userData;
    if (userData.role == "P") {
      if (status === null || status === "confirm_booking") {
        console.log("isBooked");
      } else {
        if (!isObjectExist(getState().data.trips["MT" + data.notification.request_id].data[tripDataStatus], 'driver_id', data.notification.driver_id)) {
          // console.warn("1", getState().data.trips["MT" + data.notification.request_id])
          await dispatch(getMyTripDetails(userData.id))
          // console.warn("2")
        }
        let navigateAction = null
        let res, resp;

        // console.warn("3")
        // console.warn("4", getState().data.trips["MT" + data.notification.request_id])

        res = getState().data.trips["MT" + data.notification.request_id];
        if (data.notification.status === "pending") {
          resp = isObjectExist(getState().data.trips["MT" + data.notification.request_id].data.offers, 'driver_id', data.notification.driver_id);
        }
        console.warn(resp)

        let screenName = {
          // null: { name: 'MyTripDetail', param: { trip: res } },
          pending: { name: 'BookDriver', param: { data: resp, request_details: res, index: 0, pushSeen: 'seenOffers', updateSeen: 'offers', segment: "offers" } },
          // confirm_booking: { name: 'BookDriver', param: { data: resp.data, request_details: res, index: 0, pushSeen: 'seenMyConfirmation', updateSeen: 'myConfirmation' } },
          booking_accepted: { name: 'DriverConfirmation', param: { request_details: res } },
          booked: { name: 'Contract', param: { request_details: res } }
        }

        navigateAction = CommonActions.reset({
          routes: [
            { name: 'HomeDashboard' },
            {
              name: 'PassengerApp', state: {
                routes: [
                  {
                    name: 'My Trips',
                    state: { routes: [{ name: screenName[data.notification.status].name, params: screenName[data.notification.status].param }] }
                  }]

              }
            },
          ]
        });
        _navigator.dispatch(navigateAction);
      }
    }
    else {

      if (data.notification.is_booked === "true" || status === "pending") {
        // console.log("isBooked");
      } else {
        let navigateAction = null
        // check if method called after notification pressed from tray 
        let detail = { driver_id: getState().user.userData.id, request_id: data.notification.request_id }
        let res;

        if (status === "booking_accepted") {
          res = await dispatch(getQuotationList(getState().user.userData.id))
        } else {
          res = await dispatch(apiFetch('api/MTDriver/notificationTripDetails', "POST", headerWithWebToken, { detail }))
          res = res[0]
        }

        let screenName = {
          null: { name: 'QuotePrice', param: { request: res } },
          pending: { name: 'BidDetails', param: { bids_detail: res } },
          confirm_booking: { name: 'ConfirmationDetails', param: { confirmations_detail: res } },
          booking_accepted: { name: 'ConfirmationList', param: {} },
          // booking_decline: { name: 'MyTrips', param: {} },
          booked: { name: 'ContractDetails', param: { contract_detail: Object.assign(res, getState().user.driverDetails.vehicles[`${res.vehicle_id}`]) } }
        }

        navigateAction = CommonActions.navigate({
          routeName: 'DriverApp',
          action: CommonActions.navigate({ routeName: screenName[res.status].name, params: screenName[res.status].param }),
        });
        _navigator.dispatch(navigateAction);
      }
    }
  }
};
