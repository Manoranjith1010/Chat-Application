import React, { useState, useEffect, useRef, useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { SOCKET_EVENTS } from '../../services/socketService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useContext(SocketContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    // For now, simulate loading and message handling
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [roomId]);

  const handleMessageReceived = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleRoomJoined = (roomData) => {
    if (roomData.messages) {
      setMessages(roomData.messages);
    }
    setLoading(false);
  };

  const sendMessage = (content) => {
    if (!socket) {
      console.error('Socket not connected');
      alert('Not connected to chat server. Please refresh the page.');
      return Promise.reject(new Error('Socket not connected'));
    }

    if (!roomId) {
      console.error('No room selected');
      alert('Please select a room first.');
      return Promise.reject(new Error('No room selected'));
    }

    console.log('Sending message to room:', roomId, 'Content:', content);
    
    // Emit message event with expected server payload
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      roomName: roomId,
      message: content,
      timestamp: new Date().toISOString()
    });

    // Optimistically add message to UI
    setMessages(prev => [...prev, {
      message: content,
      timestamp: new Date().toISOString(),
      username: 'You',
      isOwn: true
    }]);

    return Promise.resolve();
  };

  // Attach socket listeners for incoming messages and room data
  useEffect(() => {
    if (!socket) return;

    // keep a ref to socket
    socketRef.current = socket;

    const onMessage = (data) => {
      // server sends { username, message, timestamp, userId }
      handleMessageReceived(data);
    };

    const onUserList = (users) => {
      // ignore for now or could set member list
      console.log('userList', users);
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, onMessage);
    socket.on(SOCKET_EVENTS.USER_LIST, onUserList);

    // Join room when socket connects or roomId changes
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, onMessage);
      socket.off(SOCKET_EVENTS.USER_LIST, onUserList);
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
    };
  }, [socket, roomId]);

  if (loading) {
    return <div className="loading">Loading chat room...</div>;
  }

  return (
    <div className="chat-room">
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;
