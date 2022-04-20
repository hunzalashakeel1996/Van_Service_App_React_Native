import io from "socket.io-client";

const initialState = {
  childs: [],
  drivers: [],
  userLocation: {
    latitude: 0, //24.9355
    longitude: 0, //67.0755
    // longitudeDelta: 0.011,
    // latitudeDelta: 0.011 
  },
  driverId: null,
  userData: null,
  url: 'this',
  socket: null,
  unseenNotifications: 0,
  role: null,
}

const map = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CHILD':
      return {
        ...state,
        childs: action.childs
      }
    case 'SET_DRIVER':
      return {
        ...state,
        drivers: action.drivers
      }
    case 'SET_USER_LOCATION':
      return {
        ...state,
        userLocation: {
          latitude: action.position.latitude,
          longitude: action.position.longitude,
          // longitudeDelta: 0.011,
          // latitudeDelta: 0.011
        }
      }
    case 'SET_DRIVER_ID':
      return {
        ...state,
        driverId: action.id
      }
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.data
      }
    case 'SET_SOCKET_IO':
      return {
        ...state,
        socket: action.socket
      }
    case 'SET_UNSEEN_NOTIFICATIONS':
      return {
        ...state,
        unseenNotifications: action.unseenNotifications
      }
    case 'SET_ROLE':
      return {
        ...state,
        role: action.role
      }
    default:
      return state

  }
}

export default map;