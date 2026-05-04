import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { SOCKET_EVENTS, emitSocketEvent } from '../../services/socketService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket ? { socket: null } : {};
  const socketRef = useRef(null);

  // Get socket from context manually
  const getSocket = () => {
    if (typeof window !== 'undefined') {
      // In a real app, you'd get this from context
      return socketRef.current;
    }
  };

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
      return;
    }

    // Emit message event
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      roomId,
      content,
      timestamp: new Date().toISOString()
    });

    // Optimistically add message to UI
    setMessages(prev => [...prev, {
      content,
      timestamp: new Date().toISOString(),
      user: 'You',
      isOwn: true
    }]);
  };

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
