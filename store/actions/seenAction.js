// export const setSeenJobs = (data) => {
//   return {
//     type: 'SET_SEEN_JOBS',
//     data
//   }
// };

// export const setSeenBids = (data) => {
//   return {
//     type: 'SET_SEEN_BIDS',
//     data
//   }
// };
// export const setSeenCustomerConfirmation = (data) => {
//   return {
//     type: 'SET_SEEN_CUSTOMER_CONFIRMATION',
//     data
//   }
// };

// export const addSeenCount = (name) => {
//   console.log("fdnfjd")
//   return {
//     type: 'ADD_SEEN_COUNT',
//     name
//   }
// };

// export const subtractSeenCount = (name) => {
//   return {
//     type: 'SUBTRACT_SEEN_COUNT',
//     name
//   }
// };
// export const setSeenDriverConfirmation = (data) => {
//   return {
//     type: 'SET_SEEN_DRIVER_CONFIRMATION',
//     data
//   }
// };

export const pushSeenQuoteId = (name, quoteId) => {
  return {
    type: 'PUSH_SEEN_QUOTE_ID',
    name,
    quoteId
  }
};

export const popSeenQuoteId = (name, quoteId) => {
  // console.log("fdnfjd")
  return {
    type: 'POP_SEEN_QUOTE_ID',
    name,
    quoteId
  }
};


  
