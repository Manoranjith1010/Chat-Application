# ChatApp - Real-time Chat Application

A modern, real-time chat application built with React, Vite, and Socket.io.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Authentication**: Secure login and registration system
- **Chat Rooms**: Join multiple chat rooms for organized conversations
- **Modern UI**: Clean and responsive interface
- **Typing Indicators**: See when others are typing
- **User List**: View active users in each room
- **Message History**: Load previous messages in each room

## Project Structure

```
ChatApp/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Chat/
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── MessageInput.jsx
│   │   └── common/
│   │       ├── Header.jsx
│   │       └── RoomList.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useSocket.js
│   ├── services/
│   │   ├── authService.js
│   │   └── socketService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables by creating a `.env` file:
```env
VITE_API_URL=http://localhost:3001/api/auth
VITE_SOCKET_URL=http://localhost:3001
```

### Development

Run the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173` by default.

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Architecture

### State Management

- **AuthContext**: Manages user authentication state and methods
- **SocketContext**: Manages Socket.io connection and connection state
- **Custom Hooks**: `useAuth` and `useSocket` for easy access to contexts

### Real-time Communication

The application uses Socket.io for real-time messaging:
- `joinRoom`: Join a specific chat room
- `sendMessage`: Send a message to a room
- `message`: Receive messages in real-time
- `userJoined`: Notification when a user joins a room
- `userLeft`: Notification when a user leaves a room

### Services

- **authService**: Handles authentication API calls (login, register, token validation)
- **socketService**: Provides Socket.io event constants and helper functions

## Best Practices Implemented

1. **Component Composition**: Small, focused components for better maintainability
2. **Custom Hooks**: Reusable logic extracted into custom hooks
3. **Context API**: Centralized state management for authentication and socket
4. **Error Handling**: Proper error boundaries and user feedback
5. **Loading States**: Visual feedback during async operations
6. **Security**: Token-based authentication with secure storage
7. **Performance**: Optimized re-renders and efficient socket event handling
8. **Responsive Design**: Mobile-friendly interface

## Backend Requirements

The backend server should implement:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/validate` - Token validation

### Socket.io Events
- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `sendMessage` - Send a message
- `getRooms` - Get list of available rooms
- `message` - Receive incoming messages
- `roomsList` - Receive list of rooms
- `userJoined` - Notification of user joining
- `userLeft` - Notification of user leaving

## Environment Variables

- `VITE_API_URL`: Backend API URL for authentication (default: `http://localhost:3001/api/auth`)
- `VITE_SOCKET_URL`: Backend Socket.io server URL (default: `http://localhost:3001`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Troubleshooting

### Socket Connection Issues
- Ensure the backend server is running
- Check that `VITE_SOCKET_URL` environment variable is correctly set
- Verify CORS settings on the backend

### Authentication Issues
- Clear browser cache and localStorage
- Verify backend authentication endpoints are implemented
- Check token format and expiration

### Build Issues
- Clear `node_modules` and `package-lock.json`, then reinstall dependencies
- Ensure Node.js version is 16 or higher

## Support

For issues and questions, please create an issue in the repository.
