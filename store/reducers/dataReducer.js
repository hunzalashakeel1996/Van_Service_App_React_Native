import { url, uploadUrl } from "../actions/dataAction"
import { isActiveChk, isNewChk } from "../../src_mt/components/util/isChk"


const initialState = {
  url: url,
  uploadUrl: uploadUrl,
  driverChilds: null,
  trips: [],
  quotationList: {
    jobs: [],
    bids: [],
    confirmation: [],
    contract: []
  },
}


const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    // ======================================== VW =========================================================
    case 'SET_DRIVER_CHILDS':
      action.driverChilds.map(child => {
        if (child.tokens)
          Object.assign(child, { tokens: child.tokens.split(",") });
        else
          Object.assign(child, { tokens: [] });
      });
      return {
        ...state,
        driverChilds: action.driverChilds
      }
    case 'SET_DEVICE_TOKEN':
      return {
        ...state,
        deviceToken: action.token
      }
    case 'SET_JWT':
      return {
        ...state,
        jwtToken: action.token
      }
    // ===================================================MT --- MY TRIPS=================================================================================
 
    case 'ADD_MY_TRIP':
      let temp1 = { ...state.trips }
      temp1["MT" + action.payload.request_id] = {
        ...action.payload, data: {
          offers: [],
          myConfirmation: [],
          driverConfirmation: [],
          contract: []
        }
      };
      return {
        ...state,
        trips: temp1
      }
    case 'UPDATE_MY_TRIP':
      // console.warn("fee", action.payload)
      let temp2 = { ...state.trips };
      temp2["MT" + action.payload.request_id] = { ...temp2["MT" + action.payload.request_id], ...action.payload }
      // console.warn("trip update", temp2)
      return {
        ...state,
        trips: temp2
      }
    case 'SET_MY_TRIP_DETAILS':
      return {
        ...state,
        trips: sortMyTrips(action.payload, action.getStateSeen)
      }
    case 'ADD_MY_TRIP_DETAILS':
      let myTrips = { ...state.trips },
        tempTrips = myTrips["MT" + action.payload.request_id];
      myTrips["MT" + action.payload.request_id] = addMyTripData(action.payload, tempTrips);

      return {
        ...state,
        trips: myTrips,
      }
    case 'UPDATE_MY_TRIP_DETAILS':
      let request_id = action.data.request_id,
        quote_id = action.data.quote_id,
        tempTripDetails = { ...state.trips["MT" + request_id] },
        newDataList = tempTripDetails.data[action.name].map(item => ({ ...item, isNew: item.quote_id == quote_id ? false : item.isNew }));
      return {
        ...state,
        trips: {
          ...state.trips,
          ["MT" + request_id]: {
            ...tempTripDetails,
            data: {
              ...tempTripDetails.data, [action.name]: newDataList
            }
          }
        },
      }

    // ==============================================QUOTATION LIST========================================================================================
    case 'SET_QUOTATION_LIST':
      return {
        ...state,
        quotationList: sortQuotationList(action.payload, action.getStateSeen)
      }
    case 'UPDATE_QUOTATION_LIST':
      let tempQuotationList = [...state.quotationList[action.name]];
      let newData = tempQuotationList.map(item => ({ ...item, isNew: item.request_id == action.requestId ? false : item.isNew }));

      return {
        ...state,
        quotationList: { ...state.quotationList, [action.name]: newData },
      }
    case 'ADD_QUOTATION_LIST':
      return {
        ...state,
        quotationList: addQuotationList(action.payload, { ...state.quotationList })
      }
    // **********************************************************************************************************************************
    default:
      return state
  }
}

// ==============================================================================================================================
//sorting list for driver( Jobs, my_bids, driver_confirmation and contract)
const sortQuotationList = (data, seenState) => {
  //JSON stringify and parse to set initial state instead of refrence {...initialState.quotationList}
  let listData = JSON.parse(JSON.stringify(initialState.quotationList));

  data.map(job => {
    let isNew, seen;
    // checking isActive value of trip and then set it
    job.isActive = isActiveChk(job.departure_date);
    // console.log("=========================isActiveChk=====================", job.request_id, job.isActive, job.departure_date)
    if (job.status === null && job.isActive == true) {
      seen = !seenState.seenJobs.includes(job.request_id) ? true : false
      isNew = seenState.seenJobs.length > 0 ? seen : isNewChk(job.requested_at);
      listData.jobs.push({ ...job, isNew });
    } else if (job.status === 'pending') {
      seen = !seenState.seenBids.includes(job.request_id) ? true : false
      isNew = seenState.seenBids.length > 0 ? seen : isNewChk(job.quoted_at);
      listData.bids.push({ ...job, isNew });
    } else if (job.status === 'confirm_booking' || job.status === 'booking_accepted' || job.status === 'booking_decline') {
      seen = !seenState.seenCustomerConfirmation.includes(job.request_id) ? true : false
      isNew = seenState.seenCustomerConfirmation.length > 0 ? seen : isNewChk(job.customer_confirm_at);
      listData.confirmation.push({ ...job, isNew: job.status === 'confirm_booking' ? isNew : false });
    } else if (job.status === 'booked') {
      listData.contract.push(job);
    }
  })

  return listData;
}

//add trip data for driver( Jobs, my_bids, driver_confirmation and contract)
const addQuotationList = (job, list) => {
  // console.log(list)
  // let listData = { ...list };
  let listData = JSON.parse(JSON.stringify(list));
  // console.log('9', listData.confirmation.length)
  let tempTrip = null;
  const removeJob = (jobList) => jobList.filter(item => {
    // console.log(item.request_id !== job.request_id, item.request_id, job.request_id);
    if (item.request_id !== job.request_id) {
      return true
    } else {
      tempTrip = item;
      // console.log('item fill', item); 
      // console.log('item fill', job.status);
      // console.log('total 9 4', listData.confirmation.length)

      return false;
    }
  });

  // checking isActive value of trip and then set it
  job.isActive = isActiveChk(job.departure_date);

  // use unshift to add trip_data to start of array
  // listData.jobs.newJobs.unshift(data);
  if (job.status === null && job.isActive == true) {
    if (job.is_booked) {
      listData.jobs = removeJob(listData.jobs);
    } else {
      listData.jobs.unshift({ ...job, isNew: isNewChk(job.requested_at) });

    }
  } else if (job.status === 'pending') {
    //remove job from listData.job and add it to listData.bids
    if (job.is_booked) {
      listData.bids = removeJob(listData.bids);
    } else {
      listData.jobs = removeJob(listData.jobs);
    }


    // console.log("R|trip", tempTrip)
    // console.log("RJOB", job)

    let updateTrip = { ...tempTrip, ...job, isNew: isNewChk(job.quoted_at) }
    listData.bids.unshift(updateTrip);
  } else if (job.status === 'confirm_booking' || job.status === 'booking_accepted' || job.status === 'booking_decline') {
    if (job.status === 'confirm_booking') {
      //remove job from listData.job and add it to listData.bids
      if (job.is_booked) {
        listData.confirmation = removeJob(listData.confirmation);
      } else {
        listData.bids = removeJob(listData.bids);

      }
    } else {

      listData.confirmation = removeJob(listData.confirmation);
      // console.log('total 9 3', listData.confirmation.length)

      // tempTrip = listData.confirmation.find(item => item.request_id === job.request_id);
    }
    // console.log("R|trip", tempTrip)
    // console.log('check', tempTrip)
    let updateTrip = { ...tempTrip, ...job, isNew: isNewChk(job.customer_confirm_at) }
    listData.confirmation.unshift(updateTrip);
    // console.log('total 9 2', listData.confirmation.length)

  } else if (job.status === 'booked') {
    // console.log("jobs", job)
    if (job.driver_time_limit == null) {
      // if jobs placed is less then 24 hr it direct accepted
      listData.bids = removeJob(listData.bids);
      // console.log("bids", tempTrip)
    } else {
      // console.log('total 9 1', listData.confirmation.length)
      listData.confirmation = removeJob(listData.confirmation);
      // console.log("confirmation", tempTrip)
    }
    // console.log("==========================tempTrip================================", tempTrip)
    let updateTrip = { ...tempTrip, ...job }
    listData.contract.unshift(updateTrip);
  }
  // else if (job.status === 'booked_decline') {
  //   console.log('innnnn')
  //   listData.bids = removeJob(listData.bids);
  //   if (tempTrip == null)
  //     listData.confirmation = removeJob(listData.confirmation);
  // }

  return listData;
}


// =================================================================================================================================
const sortMyTripDetail = (offer, tripData, seenState) => {
  let isNew, seen;
  // checking isActive value of trip and then set it
  offer.isActive = isActiveChk(offer.departure_date);

  if (offer.status === 'pending') {
    seen = !seenState.seenOffers.includes(offer.quote_id) ? true : false
    isNew = seenState.seenOffers.length > 0 ? seen : isNewChk(offer.quoted_at);
    tripData.offers.push({ ...offer, isNew });
  } else if (offer.status === 'confirm_booking') {
    seen = !seenState.seenMyConfirmation.includes(offer.quote_id) ? true : false
    isNew = seenState.seenMyConfirmation.length > 0 ? seen : isNewChk(offer.customer_confirm_at);
    tripData.myConfirmation.push({ ...offer, isNew })
  } else if (offer.status === 'booking_accepted') {
    seen = !seenState.seenDriverConfirmation.includes(offer.quote_id) ? true : false
    isNew = seenState.seenDriverConfirmation.length > 0 ? seen : isNewChk(offer.driver_confirm_at);
    tripData.driverConfirmation.push({ ...offer, isNew })
  } else if (offer.status === 'booked') {
    tripData.contract.push(offer);
  }
  return tripData;
}

const sortMyTrips = (trips, getStateSeen) => {
  let sectionList = {};

  trips.map((trip, index) => {
    trip.index = index
    if (sectionList.hasOwnProperty("MT" + trip.request_id)) {
      sortMyTripDetail(trip, sectionList["MT" + trip.request_id].data, getStateSeen)
    }
    else {
      sectionList["MT" + trip.request_id] = {
        ...trip, data: trip.tq_request_id == null ? {
          offers: [],
          myConfirmation: [],
          driverConfirmation: [],
          contract: []
        } : sortMyTripDetail(trip, {
          offers: [],
          myConfirmation: [],
          driverConfirmation: [],
          contract: []
        }, getStateSeen)
      };
    }
  })
  // console.warn("sectionList", sectionList)
  return sectionList;
}

//add trip details for customer of trip( offer, my_confirmation, customer_confirmation and contract)
const addMyTripData = (offer, details) => {
  //JSON stringify and parse to set initial state instead of refrence {...initialState.tripDetails}
  let tripList = { ...details };
  let tripData = { ...details }.data;

  // console.warn("tripDetails", tripData)
  let tempTrip = null;
  const removeOffer = (offerList) => offerList.filter(item => { if (item.quote_id !== offer.quote_id) return true; else tempTrip = item; return false; });

  // checking isActive value of trip and then set it
  offer.isActive = isActiveChk(offer.departure_date);

  if (offer.status === 'pending') {
    tripData.offers.unshift({ ...offer, isNew: isNewChk(offer.quoted_at) });
  } else if (offer.status === 'confirm_booking') {
    //remove job from tripData.offers and add it to tripData.myConfirmation
    tripData.offers = removeOffer(tripData.offers)

    let updateTrip = { ...tempTrip, ...offer, isNew: isNewChk(offer.customer_confirm_at) }
    tripData.myConfirmation.unshift(updateTrip)
  } else if (offer.status === 'booking_accepted') {
    //remove job from tripData.myConfirmation and add it to tripData.driverConfirmation
    tripData.myConfirmation = removeOffer(tripData.myConfirmation)

    let updateTrip = { ...tempTrip, ...offer, isNew: isNewChk(offer.driver_confirm_at) }
    tripData.driverConfirmation.unshift(updateTrip)
  } else if (offer.status === 'booked') {
    // console.log("offer", offer)
    if (offer.driver_time_limit == null) {
      // if offer is directly accepted because its less then 24 hr offer
      //remove job from tripData.offers and add it to tripData.contract
      tripData.offers = removeOffer(tripData.offers)
    } else {
      //remove job from tripData.driverConfirmation and add it to tripData.contract
      tripData.driverConfirmation = removeOffer(tripData.driverConfirmation)
    }
    let updateTrip = { ...tempTrip, ...offer }
    // console.log("updateTrip", updateTrip)
    tripData.contract.unshift(updateTrip);
  }
  console.warn("tripData", tripData)
  return { ...tripList, data: tripData }
}


export default dataReducer;