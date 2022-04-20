export const setChilds = (childs) => {
  return {
    type: 'SET_CHILD',
    childs: childs,
    
  }
}

export const setDrivers = (drivers) => {
  return {
    type: 'SET_DRIVER',
    drivers: drivers
  }
}

export const addUserLocation = (position) => {
  return {
    type: 'SET_USER_LOCATION',
    position: position
  };
}

export const setDriverId = (id) => {
  return {
    type: 'SET_DRIVER_ID',
    id: id
  };
}

export const setUserData = (data) => {
  return {
    type: 'SET_USER_DATA',
    data: data
  };
}

export const setSocket = (socket) => {
  return {
    type: 'SET_SOCKET_IO',
    socket: socket
  };
}

export const setRole = (role) => {
  return {
    type: 'SET_ROLE',
    role: role
  };
}

export const setUnseenNotifications = (unseenNotifications) => {
  return {
    type: 'SET_UNSEEN_NOTIFICATIONS',
    unseenNotifications: unseenNotifications
  };
}
