import React, { useState, useEffect } from 'react';

const RoomList = ({ onRoomSelect, selectedRoomId }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching rooms from server
    const mockRooms = [
      { id: 1, name: 'General' },
      { id: 2, name: 'Random' },
      { id: 3, name: 'Tech Talk' },
      { id: 4, name: 'Gaming' },
      { id: 5, name: 'Sports' }
    ];
    
    setRooms(mockRooms);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="room-list">Loading rooms...</div>;
  }

  return (
    <div className="room-list">
      <div style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333' }}>
        Rooms
      </div>
      {rooms.map(room => (
        <div
          key={room.id}
          className={`room-item ${selectedRoomId === room.id ? 'active' : ''}`}
          onClick={() => onRoomSelect(room.id)}
        >
          # {room.name}
        </div>
      ))}
    </div>
  );
};

export default RoomList;
