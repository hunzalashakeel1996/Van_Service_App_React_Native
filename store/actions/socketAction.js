import { io } from 'socket.io-client';
import { url, addQuotationList, addTripDetails } from './../actions/dataAction';


export const connectSocket = (userId, dispatchFunc) => {
  return (dispatch, getState) => {
    // console.log("socket",getState().socket.socket)
    // console.log(getState().socket.socket.connected)
    if (getState().socket.socket == null ? true : !getState().socket.socket.connected) {
      const socket = io(url, {
        transports: ['websocket'],
        jsonp: false,
      });
      socket.on('connect', () => {
        console.warn('connection');
        socket.emit("createUser", { id: userId })
        socket.emit("getDetails", { id: userId, socket: getState().socket.socket == null ? true : false, isconnected: getState().socket.socket != null && getState().socket.socket.connected })
        socket.on('disconnect', () => {
          console.log('connection to server lost.');
          // socket.open();
        });

        // socket.off('getTripData').on('getTripData', (data) => {
        //   console.log("socketsData", data)
        //   console.warn("sockets")
        //   dispatch(dispatchFunc(data.tripData))
        //   // store.dispatch(storePublicMessages([message]));
        // });
      })

      dispatch(initializeConnectSocket(socket))
    } else {
      console.warn("sockeeeeeeety", getState().socket.socket.connected)
    }

  }
};

export const initializeConnectSocket = (socket) => {
  console.warn("y")
  return {
    type: 'CONNECT_SOCKET',
    socket
  }
};

export const socketClose = () => {
  // console.warn("y")
  return {
    type: 'CLOSE_SOCKET'
  }
};


// const initialSocket = (user_id, type) => {
//   // return (dispatch) =>{
//   const socket = io(url, {
//     transports: ['websocket'],
//     jsonp: false,
//   });
//   socket.on('connect', () => {
//     console.warn('connection');
//     socket.emit("createUser", { id: user_id })

//     socket.on('disconnect', () => {
//       console.log('connection to server lost.');
//       // socket.open();
//     });

//     socket.off('getTripData').on('getTripData', (data) => {
//       console.log("socketsData", data)
//       console.warn("sockets")
//       // dispatch(addQuotationList(data.tripData))
//       // store.dispatch(storePublicMessages([message]));
//     });
//   })
//   return socket;
//   // }

// }


