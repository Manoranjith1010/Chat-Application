import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Profile</h2>
          <p>You need to be logged in to view your profile.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const initials = (user.username || user.email || 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: '0 auto 1rem'
          }}>
            {initials}
          </div>
          <h2>Profile</h2>
          <p>Manage your account details.</p>
        </div>

        <div className="form-group">
          <label>Username</label>
          <div style={{ padding: '0.75rem 0.9rem', background: '#f3f4f6', borderRadius: '8px' }}>
            {user.username || 'Not provided'}
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <div style={{ padding: '0.75rem 0.9rem', background: '#f3f4f6', borderRadius: '8px' }}>
            {user.email || 'Not provided'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <Link to="/" className="btn btn-primary">Back to Chat</Link>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
