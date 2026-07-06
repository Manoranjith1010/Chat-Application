import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div>
        <h1>ChatApp</h1>
      </div>
      {user && (
        <div className="header-actions">
          <span>Welcome, {user.username || user.email}</span>
          <button className="logout-btn" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
