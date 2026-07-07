import React, { useState, useEffect } from 'react';

const RoomList = ({ onRoomSelect, selectedRoomId }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch rooms from server
    const mockRooms = [
      { id: 'general', name: 'General', displayName: 'General' },
      { id: 'random', name: 'Random', displayName: 'Random' },
      { id: 'tech-talk', name: 'Tech Talk', displayName: 'Tech Talk' },
      { id: 'gaming', name: 'Gaming', displayName: 'Gaming' },
      { id: 'sports', name: 'Sports', displayName: 'Sports' }
    ];
    
    setRooms(mockRooms);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="room-list" style={{ padding: '1rem', textAlign: 'center' }}>Loading rooms...</div>;
  }

  return (
    <div className="room-list">
      <div style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Rooms
      </div>
      {rooms.map(room => (
        <div
          key={room.id}
          className={`room-item ${selectedRoomId === room.id ? 'active' : ''}`}
          onClick={() => onRoomSelect(room.id)}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          title={`Click to join ${room.displayName}`}
        >
          # {room.displayName}
        </div>
      ))}
    </div>
  );
};

export default RoomList;
