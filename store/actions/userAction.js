export const setUserData = (data) => {
  return {
    type: 'SET_DATA_USER',
    data
  }
}

export const setUserJWT = (data) => {
  return {
    type: 'SET_USER_JWT',
    data
  }
}

export const setWalletData = (data) => {
  return {
    type: 'SET_WALLET_DATA',
    data
  }
}

export const setDriverDetails = (data) => {
  return {
    type: 'SET_DRIVER_DETAILS',
    data
  }
}

export const setAdditionalDetails = (data) => {
  return {
    type: 'SET_ADDITIONAL_DETAILS',
    data
  }
}

export const setUserLogout = () => {
  return {
    type: 'USER_LOGGED_OUT',
  }
}



