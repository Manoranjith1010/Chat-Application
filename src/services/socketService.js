// Socket.io event constants for real-time communication
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Room events
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  GET_ROOMS: 'getRooms',
  ROOMS_LIST: 'roomsList',
  ROOM_JOINED: 'roomJoined',
  ROOM_LEFT: 'roomLeft',

  // Message events
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'message',
  MESSAGE_SENT: 'messageSent',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',

  // User events
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  USER_LIST: 'userList',
};

// Emit socket event helper
export const emitSocketEvent = (socket, event, data) => {
  if (socket && socket.connected) {
    socket.emit(event, data);
  }
};

// On socket event helper
export const onSocketEvent = (socket, event, callback) => {
  if (socket) {
    socket.on(event, callback);
    return () => socket.off(event, callback);
  }
};
