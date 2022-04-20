// import io from "socket.io-client";
// import { url, addQuotationList } from './../../../store/actions/dataAction';
// import { connect } from "react-redux";

// const socket = (props) => {
//     socket.on('connect', () => {
//         console.warn("connected")

//         socket.on('disconnect', () => {
//             console.log('connection to server lost.');
//             console.warn('connection to server lost.');
//         });

//         socket.emit("createUser", { id: props.userData.id })

//         socket.on('disconnect', () => {
//             console.log('connection to server lost.');
//             // socket.open();
//         });

//         socket.off('getTripData').on('getTripData', (data) => {
//             console.log("socketsData", data)
//             console.warn("sockets")
//             props.addQuotationList(data.tripData);
//             // store.dispatch(storePublicMessages([message]));
//         });
//     })
//     return io(url);
// }

// // import io from 'socket.io-client';
// // import { url } from './../../../store/actions/dataAction';

// // // Initialize Socket IO:
// // const socket = io(url, {
// //     transports: ['websocket'],
// //     jsonp: false,
// //     // autoConnect: false,
// // });

// // // export the function to connect and use socket IO:
// // // export const startSocketIO = (userId, dispatchFunc) => {
// // //     console.warn("socket-ok")
// // //     // const socket = io(url, {
// // //     //     transports: ['websocket'],
// // //     //     jsonp: false
// // //     //   });
// // //     console.warn(socket.connected)
// // //     if (!socket.connected)
// // //         socket.connect();
// // //     // console.log(socket)
// // //     // console.log(dispatchFunc)

// // //     // socket.emit("createUser", { id: userId })

// // //     socket.on('connect', () => {
// // //         socket.emit("createUser", { id: userId })

// // //         socket.on('disconnect', () => {
// // //             console.log('connection to server lost.');
// // //             socket.open();
// // //         });

// // //         socket.off('getTripData').on('getTripData', (data) => {
// // //             console.log("socketsData", data)
// // //             console.warn("sockets")
// // //             dispatchFunc(data.tripData)
// // //             // store.dispatch(storePublicMessages([message]));
// // //         });
// // //     })
// // // }

// // export default socket;
// const mapStateToProps = state => {
//     return {
//         userData: state.user.userData,
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//         addQuotationList: (data) => dispatch(addQuotationList(data, dispatch)),
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(socket);