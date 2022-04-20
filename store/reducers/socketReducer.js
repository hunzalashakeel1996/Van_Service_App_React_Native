

export const initialState = {
  socket: null,
}

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECT_SOCKET':
      return {
        ...state,
        socket: action.socket,
      }
      case 'CLOSE_SOCKET':
        state.socket.close()
      return {
        ...state
      }
    default:
      return state
  }
}



export default socketReducer;