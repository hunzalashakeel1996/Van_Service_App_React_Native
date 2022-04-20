

export const initialState = {
  isSignup: false,
  showRealApp: false,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_SIGNUP':
      return {
        ...state,
        isSignup: action.bool,
      }
    default:
      return state
  }
}

export default authReducer;