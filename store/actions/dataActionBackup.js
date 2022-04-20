import { Alert } from "react-native";
import { uiStartLoading, uiStopLoading } from "./uiAction";
import AsyncStorage from '@react-native-community/async-storage';
// "http://wcmarketplace.eejaad.com"
// "https://van-wala.herokuapp.com"
// export const url = "http://192.168.4.105:3000";
export const url = "https://myvanwala.herokuapp.com";
export const uploadUrl = "http://images.vanwala.pk/";

getJwt = () => {
  AsyncStorage.getItem('jwt')
    .then(jwt => {
      return jwt
    })
}

const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

const headerWithWebToken = AsyncStorage.getItem('jwt').then(val=>{
    return {Accept: "application/json",
    "Content-Type": "application/json",
    "jsonwebtoken": val}
})

const multipartHeader = {
  Accept: 'application/json',
  "Content-Type": "multipart/form-data",
}

const apiFetch = (apiUrl, apiMethod, apiHeader, apiBody, props) => {
  let isConnected = true
  this.netInfo = NetInfo.addEventListener(state => {
    isConnected = state.isConnected
  });
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      if (isConnected) {
        dispatch(uiStartLoading());
        fetch(apiUrl, {
          method: apiMethod,
          headers: apiHeader,
          body: apiBody
        })
          .then(res => { 
              return res.json() 
          })
          .then(resJson => {
            if (resJson)
              resolve (resJson);
            dispatch(uiStopLoading())
          })
          .catch(err => {return saveErrorLog(err, apiUrl, props) })
      }
      else {
        console.warn(props)
        props.navigate('NoInternet')
      }
    });
  }
};


saveErrorLog = (error, apiURL, props) => {
  fetch(`${url}/api/common/logError`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      error,
      apiURL
    })
  })
    .then(res => { return res.json() })
    .then((resJson) => {
      let data = {
        msg: `New error inserted in database`,
        number: "923342664254",
      }
      // sendSmsMessage(data)
      props.navigate('Auth')
    })
    .catch(err => Alert.alert('Sorry', `Server Error please try again later ${err}`))
}


// ================================================= Parent APIs ===============================================
// get drivers of current parent's childs
export const getDrivers = (childId, props) => {
  let headers = headerWithWebToken._55;
  return (apiFetch(`${url}/api/child/drivers`, 'POST', headers, JSON.stringify({ childId }),props))
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/child/drivers`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          childId,
        })
      })
        .then(res => { return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get schools for parent signup
export const getSchools = () => {
  let headers = headerWithWebToken._55;
  return (apiFetch(`${url}/api/child/drivers`, 'POST', headers, JSON.stringify({ childId }),props))
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/common/getSchools`, {
        method: 'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
        },
      })
        .then(res => { return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get all childs of current parent
export const getChilds = (id, access) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/child`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id,
          access
        })
      })
        .then(res => { return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson)
          dispatch(uiStopLoading());
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`));
    })
  }
}

// set home location for current user
export const setHomeLocation = (id, coordinate) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      let data = {};
      fetch(`${url}/api/child/setHomeLocation`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id,
          coordinate
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
          dispatch(uiStopLoading())
        })
    })
  }
}
// sendResponse(4001,'Incorrect',data);response.status(4001); return {status:4001,msg:"Incorrect Length",data:err};
// sendResponse(res,status,msg,data){
//   if(status!==200){
//     //return{status,msg,data};
//     return data;
//   }else{
//     //erro on text file
//     return{status,msg,{}}
//   }
// }
// get status of all childs
export const getStatus = (childId, driverId) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading())
      fetch(`${url}/api/child/getStatus`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          childId,
          driverId
        })
      })
        .then(res => {
          return res.json()
        })
        .then(responseJson => {
          if (responseJson)
            resolve(responseJson)
          dispatch(uiStopLoading())
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
          dispatch(uiStopLoading())
        })

    })
  }
}

// get all trips of current parent childs
export const getTrips = (id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/trips`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get all notifications of today
export const getNotifications = (id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/notifications`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get number of unseen notifications
export const getUnseenNotifications = (parent_id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/unseenNotificaitons`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id: parent_id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get all notifications of today
export const getFees = (id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/getFees`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get all trips of current parent's childs
export const getTodayTrips = (parent_id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/getTodayTrips`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          parent_id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

export const updateVacation = (item, option, startDate, endDate) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/vacation`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          item,
          option,
          startDate,
          endDate
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// set new trip for current child
export const setNewTrip = (id, details) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      let data = {};
      fetch(`${url}/api/child/setNewTrip`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id,
          details
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// method to get account details for parent profile screen
export const getAccountDetails = (id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/accountDetails`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
        })
    })
  }
}

// upload single image
export const EditParentProfile = (formData) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      dispatch(uiStartLoading())
      fetch(`${url}/api/common/EditParentProfile`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          "Content-Type": "multipart/form-data",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
      })
        .then(res => {
          data.status = res.status;
          return res.json()
        })
        .then(responseJson => {
          if (responseJson) {
            data._bodyInit = responseJson;
            resolve(data)
          }
          dispatch(uiStopLoading())
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
          dispatch(uiStopLoading())
        })
    })
  }
}

// upload single image
export const addNewChild = (formData) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      dispatch(uiStartLoading())
      fetch(`${url}/api/common/addNewChild`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          "Content-Type": "multipart/form-data",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
      })
        .then(res => {
          data.status = res.status;
          return res.json()
        })
        .then(responseJson => {
          if (responseJson) {
            data._bodyInit = responseJson;
            resolve(data)
          }
          dispatch(uiStopLoading())
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
          dispatch(uiStopLoading())
        })
    })
  }
}

// method to get account details for parent profile screen
export const childInfo = (id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/child/childInfo`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
        })
    })
  }
}

// ================================================= Login APIs ===============================================
// check for the number at signup if it exist 
export const checkNumberExist = (number) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/checkNumberExist`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          number
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

//get driver child from db
export const login = number => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      let data = {};
      fetch(`${url}/api/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ number: number })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          dispatch(uiStopLoading());
          Alert.alert("Error", `Something went wrong \n ${err}`)
        })
    });
  };
};

// delete device token from database of current user when user logged out
export const DeviceTokenInactive = token => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      let data = {};
      fetch(`${url}/api/common/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          dispatch(uiStopLoading());
          Alert.alert("Error", `Something went wrong \n ${err}`)
        })
    });
  };
};

export const codeVerification = (id, code) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      let data = {};
      fetch(`${url}/api/login/codeVerification`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, code })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          Alert.alert('"Error", `Something went wrong \n ${err}`')
        })
    });
  };
};

//sign up parent
export const parentSignUp = data => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      fetch(`${url}/api/common/parentSignUp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: data
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            Alert.alert("Error", JSON.stringify(res));
            dispatch(uiStopLoading());
          }
        })
        .then(responseJson => {
          if (responseJson) {
            // console.warn(responseJson)
            resolve(responseJson);
          }
          dispatch(uiStopLoading());
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`);
          dispatch(uiStopLoading());
        });
    });
  };
};

export const onResend = (number) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      let data = {};
      fetch(`${url}/api/login/Resend`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ number })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          Alert.alert('"Error", `Something went wrong \n ${err}`')
        })
    });
  };
};

export const passwordLogin = (number, password, token) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      let data = {};
      fetch(`${url}/api/login/passwordLogin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ number, password, token })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
        })
    });
  };
};

// ================================================= Admin APIs ===============================================
// get all drivers from users
export const adminDriverVerification = (data, index, isAccountVerify) => {
  console.warn(data)
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/common/adminDriverVerification`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          data,
          index,
          isAccountVerify
        })
      })
        .then(res => { console.log(res); return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get all drivers from users
export const adminGetDocumentDetails = (id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/common/adminGetDocumentDetails`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id
        })
      })
        .then(res => { console.log(res); return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

export const createUser = (details) => {
  console.warn(details)
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/signUp`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        },
        body: details
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

export const getAllChilds = () => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/getAllChilds`, {
        method: 'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        }
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

export const getChildInfo = (id) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/getChildInfo`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

export const assignShiftToTrip = (id, tripId) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/assignShiftToTrip`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id,
          tripId
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

export const getChildsOfSchool = (schoolName, shiftId, status) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/getChildsOfSchool`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          schoolName,
          shiftId,
          status
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

export const onAddChildsToShift = (childList) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/onAddChildsToShift`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          childList
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

//CONTACT US
export const getContacts = () => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/common/getContact`, {
        method: 'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt')),
          'Cache-Control': 'no-cache',
        },
        
      })
        .then(res => { return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get all drivers
export const getAllDrivers = () => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/common/getAllDrivers`, {
        method: 'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt')),
          'Cache-Control': 'no-cache',
        },
        
      })
        .then(res => { return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

//get driver shifts
export const getDriverShifts = driverId => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      fetch(`${url}/api/common/getDriverShifts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          driver_id: driverId
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            Alert.alert("Error", JSON.stringify(res));
            dispatch(uiStopLoading());
          }
        })
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson) {
            resolve(responseJson);
          }
          dispatch(uiStopLoading());
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`);
          dispatch(uiStopLoading());
        });
    });
  };
};

//add shift of driver
export const addDriverShift = data => {
  console.log(data)
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      fetch(`${url}/api/common/addDriverShift`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          data: data
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            Alert.alert("Error", JSON.stringify(res));
            dispatch(uiStopLoading());
          }
        })
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson) {
            resolve(responseJson);
          }
          dispatch(uiStopLoading());
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`);
          dispatch(uiStopLoading());
        });
    });
  };
};

//update driver shift
export const updateDriverShift = data => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      fetch(`${url}/api/common/updateDriverShift`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          data: data
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            Alert.alert("Error", JSON.stringify(res));
            dispatch(uiStopLoading());
          }
        })
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson) {
            resolve(responseJson);
          }
          dispatch(uiStopLoading());
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`);
          dispatch(uiStopLoading());
        });
    });
  };
};

//delete driver shift
export const deleteDriverShift = shift_id => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      fetch(`${url}/api/common/deleteDriverShift`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          shift_id: shift_id
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            Alert.alert("Error", JSON.stringify(res));
            dispatch(uiStopLoading());
          }
        })
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson) {
            resolve(responseJson);
          }
          dispatch(uiStopLoading());
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`);
          dispatch(uiStopLoading());
        });
    });
  };
};

// get all drivers from users
export const getInActiveDrivers = () => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/common/getInActiveDrivers`, {
        method: 'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        }
      })
        .then(res => { console.log(res); return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// get all drivers from users
export const onAddSchool = (data) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());

      fetch(`${url}/api/common/onAddSchool`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          data
        })
      })
        .then(res => { console.log(res); return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStopLoading())
        })
        .catch(err => Alert.alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// ================================================= Common APIs ===============================================
// upload images
export const uploadImages = (imagesArray) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading())
      fetch(`${url}/api/common/uploadImages`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": "multipart/form-data",
        },
        body: imagesArray
      })
        .then(res => {
          return res.json()
        })
        .then(responseJson => {
          if (responseJson)
            resolve(responseJson)
          dispatch(uiStopLoading())
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
          dispatch(uiStopLoading())
        })
    })
  }
}

// send sms to user
export const sendSmsMessage = (data) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading())
      let userName = "923418201201",
        password = "4085",
        getSessionIdUrl = `https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=${userName}&password=${password}&response_type=2`,
        mask = "FARJAZZ PK",
        toNumbersCsv = data.number,
        messageText = data.msg;

      fetch(getSessionIdUrl)
        .then(res => {
          return res.json()
        })
        .then(resJson => {
          if (resJson.Corpsms.response === "OK") {
            console.log(resJson.Corpsms.data);
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

// upload single image
export const uploadImage = (image) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading())
      fetch(`${url}/api/common/uploadImage`, {
        method: 'POST',
        body: image,
        headers: {
          Accept: 'application/json',
          "Content-Type": "multipart/form-data",
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
      })
        .then(res => {
          return res.json()
        })
        .then(responseJson => {
          if (responseJson)
            resolve(responseJson)
          dispatch(uiStopLoading())
        })
        .catch(err => {
          Alert.alert("Error", `Something went wrong \n ${err}`)
          dispatch(uiStopLoading())
        })
    })
  }
}

export const changePassword = (id, password, newPassword) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let data = {};
      fetch(`${url}/api/common/changePassword`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
          "jsonwebtoken": (await AsyncStorage.getItem('jwt'))
        },
        body: JSON.stringify({
          id,
          password,
          newPassword
        })
      })
        .then((response) => { data.status = response.status; return response.json() })
        .then((responseJson) => {
          dispatch(uiStopLoading());
          data._bodyInit = responseJson;
          resolve(data)
        })
        .catch(err => {
          Alert.alert('error inside change password in redux')
        })
    })
  }
}

export const logout = (token) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading());
      return fetch(`${url}/api/common/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token
        })
      })
        .then(res => { return res.json() })
        .then(resJson => {
          if (resJson)
            resolve(resJson);
          dispatch(uiStartLoading())
        })
        .catch(err => alert("Error", `Something went wrong \n ${err}`))
    })
  }
}

// set Device Token 
export const setDeviceToken = token => {
  return {
    type: "SET_DEVICE_TOKEN",
    token
  };
};



















import { Alert } from "react-native";
import { uiStartLoading, uiStopLoading } from "./uiAction";
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

// "http://wcmarketplace.eejaad.com"
// "https://van-wala.herokuapp.com"
// export const url = "http://192.168.4.105:3000";
export const url = "https://myvanwala.herokuapp.com";
export const uploadUrl = "http://images.vanwala.pk/";
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
  AsyncStorage.getItem('jwt').then(val => {
    headerWithWebToken =  {
      Accept: "application/json",
      "Content-Type": "application/json",
      "jsonwebtoken": val
    }
  })
}

const multipartHeader = {
  Accept: 'application/json',
  'Cache-Control': 'no-cache',
  "Content-Type": "multipart/form-data",
}

const multipartHeaderWithJWT = AsyncStorage.getItem('jwt').then(val=>{
  return {Accept: 'application/json',
  "Content-Type": "multipart/form-data",
  'Cache-Control': 'no-cache',
  "jsonwebtoken": val}
})

const apiFetch = (apiUrl, apiMethod, apiHeader, apiBody, props) => {
  let isConnected = true
  this.netInfo = NetInfo.addEventListener(state => {
    isConnected = state.isConnected
  });
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      if (isConnected) {
        dispatch(uiStartLoading());
        fetch(apiUrl, {
          method: apiMethod,
          headers: apiHeader,
          body: apiBody
        })
          .then(res => { 
              return res.json() 
          })
          .then(resJson => {
            if (resJson)
              resolve (resJson);
            dispatch(uiStopLoading())
          })
          .catch(err => {return saveErrorLog(err, apiUrl, props) })
      }
      else {
        props ? props.navigate('NoInternet') : null
      }
    });
  }
};


saveErrorLog = (error, apiURL, props) => {
  fetch(`${url}/api/common/logError`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      error,
      apiURL
    })
  })
    .then(res => { return res.json() })
    .then((resJson) => {
      let data = {
        msg: `New error inserted in database`,
        number: "923342664254",
      }
      // sendSmsMessage(data)
      props ? props.navigate('Auth') : null
    })
    .catch(err => Alert.alert('Sorry', `Server Error please try again later ${err}`))
}


// ================================================= Parent APIs ===============================================
// get drivers of current parent's childs
export const getDrivers = (childId, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/drivers`, 'POST', headerWithWebToken, JSON.stringify({ childId }),props))
  
}

// get schools for parent signup
export const getSchools = (props) => {
  return (apiFetch(`${url}/api/common/getSchools`, 'GET', header,null,props))
}

// get all childs of current parent
export const getChilds = (id, access, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child`, 'POST', headerWithWebToken, JSON.stringify({ id, access }),props))
}

// set home location for current user
export const setHomeLocation = (id, coordinate, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/setHomeLocation`, 'POST', headerWithWebToken, JSON.stringify({ id, coordinate }),props))
}

// get status of all childs
export const getStatus = (childId, driverId, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/getStatus`, 'POST', headerWithWebToken, JSON.stringify({ childId, driverId }),props))
}

// get all trips of current parent childs
export const getTrips = (id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/trips`, 'POST', headerWithWebToken, JSON.stringify({ id }),props))
  
}

// get all notifications of today
export const getNotifications = (id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/notifications`, 'POST', headerWithWebToken, JSON.stringify({ id }),props))
}

// get number of unseen notifications
export const getUnseenNotifications = (parent_id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/unseenNotificaitons`, 'POST', headerWithWebToken, JSON.stringify({ id: parent_id }),props))
}

// get all notifications of today
export const getFees = (id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/getFees`, 'POST', headerWithWebToken, JSON.stringify({ id }),props))
}

// get all trips of current parent's childs
export const getTodayTrips = (parent_id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/getTodayTrips`, 'POST', headerWithWebToken, JSON.stringify({ parent_id }),props))
}

export const updateVacation = (item, option, startDate, endDate, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/vacation`, 'POST', headerWithWebToken, JSON.stringify({ item, option, startDate, endDate }),props))
}

// set new trip for current child
export const setNewTrip = (id, details, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/setNewTrip`, 'POST', headerWithWebToken, JSON.stringify({ id, details }),props))
}

// method to get account details for parent profile screen
export const getAccountDetails = (id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/accountDetails`, 'POST', headerWithWebToken, JSON.stringify({ id }),props))
}

// upload single image
export const EditParentProfile = (formData, props) => {
  let headers = multipartHeaderWithJWT._55;
  return (apiFetch(`${url}/api/common/EditParentProfile`, 'POST', headers,  formData,props))
}

// upload single image
export const addNewChild = (formData, props) => {
  let headers = multipartHeaderWithJWT._55;
  return (apiFetch(`${url}/api/common/addNewChild`, 'POST', headers,  formData,props))
}

// method to get account details for parent profile screen
export const childInfo = (id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/child/childInfo`, 'POST', headerWithWebToken, JSON.stringify({ id }),props))
}

// ================================================= Login APIs ===============================================
// check for the number at signup if it exist 
export const checkNumberExist = (number, props) => {
  return (apiFetch(`${url}/api/common/checkNumberExist`, 'POST', header, JSON.stringify({ number }),props))
}

//get driver child from db
export const login = (number, props) => {
  return (apiFetch(`${url}/api/login`, 'POST', header, JSON.stringify({ number }),props))
};

// delete device token from database of current user when user logged out
export const DeviceTokenInactive = (token, props) => {
  return (apiFetch(`${url}/api/common/logout`, 'POST', header, JSON.stringify({ token }),props))
};

export const codeVerification = (id, code, props) => {
  return (apiFetch(`${url}/api/login/codeVerification`, 'POST', header, JSON.stringify({ id, code }),props))
};

//sign up parent
export const parentSignUp = (data, props) => {
  return (apiFetch(`${url}/api/common/parentSignUp`, 'POST', multipartHeader, data,props))
};

export const onResend = (number, props) => {
  return (apiFetch(`${url}/api/login/Resend`, 'POST', header, JSON.stringify({ number }),props))
};

export const passwordLogin = (number, password, token, props) => {
  return (apiFetch(`${url}/api/login/passwordLogin`, 'POST', header, JSON.stringify({ number, password, token }),props))
};

// ================================================= Admin APIs ===============================================
// get all drivers from users
export const adminDriverVerification = (data, index, isAccountVerify, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/adminDriverVerification`, 'POST', headerWithWebToken, JSON.stringify({ data, index, isAccountVerify }),props))
}

// get all drivers from users
export const adminGetDocumentDetails = (id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/adminDriverVerification`, 'POST', headerWithWebToken, JSON.stringify({ id }),props))
}

export const createUser = (details, props) => {
  let headers = multipartHeaderWithJWT._55;
  return (apiFetch(`${url}/api/common/signUp`, 'POST', headers,  details,props))
}

export const getAllChilds = (props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/getAllChilds`, 'GET', headers,null,props))
}

export const getChildInfo = (id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/getChildInfo`, 'POST', headers, JSON.stringify({ id }),props))
}

export const assignShiftToTrip = (id, tripId, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/assignShiftToTrip`, 'POST', headers, JSON.stringify({ id, tripId}),props))
}

export const getChildsOfSchool = (schoolName, shiftId, status, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/getChildsOfSchool`, 'POST', headers, JSON.stringify({ schoolName, shiftId, status}),props))
}

export const onAddChildsToShift = (childList, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/onAddChildsToShift`, 'POST', headers, JSON.stringify({ childList }),props))
}

//CONTACT US
export const getContacts = (props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/getContact`, 'GET', headers,null,props))
}

// get all drivers
export const getAllDrivers = (props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/getAllDrivers`, 'GET', headers,null,props))
}

//get driver shifts
export const getDriverShifts = (driverId, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/getDriverShifts`, 'POST', headers, JSON.stringify({ driver_id: driverId }),props))
};

//add shift of driver
export const addDriverShift = (data, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/addDriverShift`, 'POST', headers, JSON.stringify({ data }),props))
};

//update driver shift
export const updateDriverShift = (data, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/updateDriverShift`, 'POST', headers, JSON.stringify({ data }),props))
};

//delete driver shift
export const deleteDriverShift = (shift_id, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/deleteDriverShift`, 'POST', headers, JSON.stringify({ shift_id }),props))
};

// get all drivers from users
export const getInActiveDrivers = (props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/getInActiveDrivers`, 'GET', headers,null,props))
}

// get all drivers from users
export const onAddSchool = (data, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/onAddSchool`, 'POST', headers, JSON.stringify({ data }),props))
}

// ================================================= Common APIs ===============================================
// upload images
export const uploadImages = (imagesArray, props) => {
  return (apiFetch(`${url}/api/common/onAddSchool`, 'POST', multipartHeader, imagesArray,props))
}

// send sms to user
export const sendSmsMessage = (data) => {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      dispatch(uiStartLoading())
      let userName = "923418201201",
        password = "4085",
        getSessionIdUrl = `https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=${userName}&password=${password}&response_type=2`,
        mask = "FARJAZZ PK",
        toNumbersCsv = data.number,
        messageText = data.msg;

      fetch(getSessionIdUrl)
        .then(res => {
          return res.json()
        })
        .then(resJson => {
          if (resJson.Corpsms.response === "OK") {
            console.log(resJson.Corpsms.data);
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

// upload single image
export const uploadImage = (image, props) => {
  let headers = multipartHeaderWithJWT._55;
  return (apiFetch(`${url}/api/common/onAddSchool`, 'POST', headers, image,props))
}

export const changePassword = (id, password, newPassword, props) => {
  headerWithWebToken === null ? setHeaderWithWebToken() : null;
  return (apiFetch(`${url}/api/common/changePassword`, 'POST', headers, JSON.stringify({ id, password, newPassword }),props))
}

export const logout = (token, props) => {
  return (apiFetch(`${url}/api/common/logout`, 'POST', header, JSON.stringify({ token }),props))
}

// set Device Token 
export const setDeviceToken = token => {
  return {
    type: "SET_DEVICE_TOKEN",
    token
  };
};




