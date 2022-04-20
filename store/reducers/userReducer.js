export const initialState = {
  userData: null,
  userJWT: null,
  driverDetails: null,
  additionalDetails: null,
  walletData: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA_USER':
      return {
        ...state,
        userData: action.data
      }
    case 'SET_WALLET_DATA':
      return {
        ...state,
        walletData: action.data
      }
    case 'SET_USER_JWT':
      return {
        ...state,
        userJWT: action.data,
      }
    case 'SET_DRIVER_DETAILS':
      return {
        ...state,
        driverDetails: action.data,
      }
    case 'SET_ADDITIONAL_DETAILS':
      return {
        ...state,
        additionalDetails: action.data,
      }

    // case 'USER_LOGOUT':
    //   return {
    //     state: undefined
    //   }
    default:
      return state
  }
}

export default userReducer;