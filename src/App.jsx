import React from 'react';
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

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Main chat container
const ChatContainer = () => {
  const [selectedRoom, setSelectedRoom] = React.useState(null);

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

// Auth routes
const AuthContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main app content
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <ChatContainer /> : <AuthContent />;
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
