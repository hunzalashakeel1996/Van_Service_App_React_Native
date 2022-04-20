export const initialState = {
  seenJobs: [],
  seenBids: [],
  seenCustomerConfirmation: [],
  // seenDriverConfirmation: 0,
  seenOffers: [],
  seenMyConfirmation: [],
  seenDriverConfirmation: [],
  // we push and pop seen quote_ids
}

const seenReducer = (state = initialState, action) => {
  switch (action.type) {
    // case 'SET_SEEN_JOBS':
    //   console.log("seen", action.data)
    //   return {
    //     ...state,
    //     seenJobs: action.data,
    //   }
    // case 'SET_SEEN_BIDS':
    //   return {
    //     ...state,
    //     seenBids: action.data,
    //   }
    // case 'SET_SEEN_CUSTOMER_CONFIRMATION':
    //   return {
    //     ...state,
    //     seenCustomerConfirmation: action.data,
    //   }
    // case 'ADD_SEEN_COUNT':
    //   return {
    //     ...state,
    //     [action.name]: state[action.name] + 1,
    //   }
    // case 'SUBTRACT_SEEN_COUNT':
    //   console.log("Seen")
    //   console.log("Seen", action.name)
    //   console.log("Seen", state[action.name] - 1)
    //   return {
    //     ...state,
    //     [action.name]: state[action.name] - 1,
    //   }
    // case 'SET_SEEN_DRIVER_CONFIRMATION':
    // return {
    //   ...state,
    //   seenDriverConfirmation: action.data,
    // }
    case 'PUSH_SEEN_QUOTE_ID':
      return {
        ...state,
        [action.name]: [...state[action.name], action.quoteId],
      }
    case 'POP_SEEN_QUOTE_ID':
      let dataList = [...state[action.name]].filter(function (quoteId) {
        return quoteId !== action.quoteId
      });
      return {
        ...state,
        [action.name]: dataList,
      }
    default:
      return state
  }
}

export default seenReducer;