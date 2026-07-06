# ChatApp Backend Server

A production-ready Node.js/Express backend for the ChatApp real-time chat application.

## Features

- ✅ **User Authentication** - Secure login and registration with JWT
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **Real-time Messaging** - Socket.io integration
- ✅ **Multiple Chat Rooms** - Join, leave, and send messages
- ✅ **User Management** - Track connected users and room members
- ✅ **Error Handling** - Comprehensive error logging and validation
- ✅ **CORS Support** - Secure cross-origin requests
- ✅ **Token Validation** - JWT token verification and refresh

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory (already created):

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
```

### Important Security Notes

- **JWT_SECRET**: Change this to a secure random string in production
- **FRONTEND_URL**: Update this when deploying to production
- Never commit `.env` file to version control

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Registration successful",
  "user": {
    "id": "1234567890",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": "1234567890",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Validate Token
```http
GET /api/auth/validate
Authorization: Bearer <token>

Response:
{
  "id": "1234567890",
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-06-28T10:30:00.000Z",
  "uptime": 123.456
}
```

## Socket.io Events

### Client → Server

#### Join Room
```javascript
socket.emit('joinRoom', 'general');
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  roomName: 'general',
  message: 'Hello everyone!'
});
```

#### Leave Room
```javascript
socket.emit('leaveRoom', 'general');
```

#### Get Rooms List
```javascript
socket.emit('getRooms');
```

### Server → Client

#### Room List
```javascript
socket.on('roomsList', (rooms) => {
  // rooms = [
  //   { name: 'general', userCount: 5 },
  //   { name: 'random', userCount: 2 }
  // ]
});
```

#### Receive Message
```javascript
socket.on('message', (data) => {
  // data = {
  //   username: 'john_doe',
  //   message: 'Hello everyone!',
  //   timestamp: Date,
  //   userId: '1234567890'
  // }
});
```

#### User Joined
```javascript
socket.on('userJoined', (data) => {
  // data = {
  //   username: 'john_doe',
  //   message: 'john_doe joined the room'
  // }
});
```

#### User Left
```javascript
socket.on('userLeft', (data) => {
  // data = {
  //   username: 'john_doe',
  //   message: 'john_doe left the room'
  // }
});
```

#### User List Update
```javascript
socket.on('userList', (usernames) => {
  // usernames = ['john_doe', 'jane_smith', 'bob_wilson']
});
```

#### Error
```javascript
socket.on('error', (error) => {
  // error = { message: 'Failed to join room' }
});
```

## Default Rooms

The server creates these default rooms:
- **general** - Main discussion room
- **random** - Off-topic discussions
- **help** - Help and support room

## Data Storage

Currently, the backend uses **in-memory storage** for:
- User accounts
- Chat messages
- Room information

This is suitable for **development and testing** only. For production, implement:
- **MongoDB** or PostgreSQL for persistent storage
- **Redis** for session management
- **Message queue** (RabbitMQ/Kafka) for scalability

## Running Frontend and Backend Together

### Terminal 1 - Backend
```bash
cd /workspaces/Chat-Application/backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd /workspaces/Chat-Application
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing the Application

1. Open `http://localhost:5173` in your browser
2. Register a new account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click through to login
4. Select a room and start chatting
5. Open another browser tab, register a different user, and test messaging

## Troubleshooting

### Connection Refused Error
- Ensure backend is running on port 3001
- Check firewall settings
- Verify FRONTEND_URL in `.env`

### CORS Errors
- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Verify socket.io CORS configuration in `server.js`

### Token Validation Failed
- Ensure JWT_SECRET is the same on backend
- Check token expiration (7 days by default)
- Verify Authorization header format: `Bearer <token>`

### Socket.io Connection Failed
- Check WebSocket support in browser
- Verify Socket.io is running on port 3001
- Check browser console for detailed errors

## Production Deployment

Before deploying to production:

1. **Update environment variables**:
   ```env
   JWT_SECRET=<generate-secure-random-string>
   FRONTEND_URL=https://yourdomain.com
   NODE_ENV=production
   ```

2. **Set up database**:
   - Migrate from in-memory storage
   - Implement user persistence
   - Set up backup strategy

3. **Enable HTTPS/SSL**:
   - Update FRONTEND_URL to use https://
   - Configure SSL certificates

4. **Set up monitoring**:
   - Error tracking (Sentry, DataDog)
   - Performance monitoring
   - Uptime monitoring

5. **Scale horizontally**:
   - Use Socket.io adapter (Redis)
   - Implement load balancing
   - Deploy multiple instances

## License

ISC

## Support

For issues, questions, or feature requests, contact the development team.
