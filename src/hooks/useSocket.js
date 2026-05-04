import { useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = (event, callback) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
  }, [socket, event, callback]);

  return socket;
};
