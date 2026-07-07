import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import ChatRoom from './components/Chat/ChatRoom';
import RoomList from './components/common/RoomList';
import Header from './components/common/Header';
import { useAuth } from './hooks/useAuth';

// Main chat page
const ChatPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="app">
      <Header />
      <div className="chat-container">
        <RoomList onRoomSelect={setSelectedRoom} selectedRoomId={selectedRoom} />
        {selectedRoom ? (
          <ChatRoom roomId={selectedRoom} />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Select a room to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

// Main app content - handles routing based on auth state
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<ChatPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
