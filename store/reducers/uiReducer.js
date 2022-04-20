const initialState = {
    isLoading: false
  }
  
const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UI_START_LOADING':
        return {
          ...state,
          isLoading: true
        }
        case 'UI_STOP_LOADING':
        return {
          ...state,
          isLoading: false
        }
      default:
        return state
    }
  }
  
  export default uiReducer;