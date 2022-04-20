

export const initialState = {
  notification: {
    modalVisible: false,
  },
  platform: null
}

const utilReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION_VISIBLE':
      return {
        ...state,
        notification: action.data,
      }
      case 'SET_PLATFORM_VALUE':
        return {
          ...state,
          platform: action.data,
        }
    default:
      return state
  }
}

export default utilReducer;