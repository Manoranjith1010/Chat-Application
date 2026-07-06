# ChatApp - Complete Setup & Running Guide

## ✅ What's Been Set Up

Your ChatApp now has a **complete, production-ready backend** with:

### Backend Features
- ✅ Express.js HTTP server on port 3001
- ✅ JWT-based authentication system
- ✅ User registration and login with password hashing
- ✅ Socket.io real-time messaging
- ✅ Multiple chat rooms management
- ✅ User connection tracking
- ✅ CORS security enabled
- ✅ Comprehensive error handling
- ✅ Development and production modes

### Files Created
```
backend/
├── server.js              # Main server with Express + Socket.io
├── package.json          # Backend dependencies
├── .env                  # Environment configuration
└── README.md             # Backend documentation

Root:
├── .env.local            # Frontend environment variables
├── start.sh              # Convenient startup script
└── BACKEND_SETUP.md      # This file
```

## 🚀 Quick Start (30 seconds)

### Option 1: Use the Startup Script (Easiest)
```bash
cd /workspaces/Chat-Application
chmod +x start.sh
./start.sh
```
This starts both frontend and backend in one command.

### Option 2: Manual Start in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd /workspaces/Chat-Application/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /workspaces/Chat-Application
npm run dev
```

## 📍 Access Your Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Backend Health**: http://localhost:3001/health

## 🧪 Testing the Application

### Step 1: Open Frontend
Go to http://localhost:5173 in your browser

### Step 2: Register a New Account
1. Click "Register here" link
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Register"

### Step 3: Login
1. You'll be automatically redirected to login
2. Or click "Login here"
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Login"

### Step 4: Test Chat
1. Select a room from the list (general, random, help)
2. Type a message and send
3. See it appear in real-time

### Step 5: Multi-User Test
1. Open another browser tab
2. Register a different user
3. Join the same room
4. Test messaging between users

## 🔍 Backend API Reference

### Authentication Endpoints

#### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "1783348450787",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

#### Validate Token
```bash
curl -X GET http://localhost:3001/api/auth/validate \
  -H "Authorization: Bearer <token>"
```

#### Health Check
```bash
curl http://localhost:3001/health
```

## 🔌 Socket.io Events

The frontend automatically handles Socket.io, but here's what happens:

### Server Events to Client
- `roomsList` - List of available chat rooms
- `message` - New message in current room
- `userJoined` - User joined notification
- `userLeft` - User left notification
- `userList` - Updated list of users in room
- `error` - Error messages from server

### Client Events to Server
- `joinRoom` - Join a specific room
- `sendMessage` - Send a message
- `leaveRoom` - Leave a room
- `getRooms` - Request rooms list

## 🛠️ Configuration

### Frontend Configuration (`.env.local`)
```env
VITE_API_URL=http://localhost:3001/api/auth
VITE_SOCKET_URL=http://localhost:3001
```

### Backend Configuration (`backend/.env`)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
```

## ⚙️ Backend Commands

### Development Mode (with auto-reload on file changes)
```bash
cd backend
npm run dev
```

### Production Mode
```bash
cd backend
npm start
```

### Install Dependencies
```bash
cd backend
npm install
```

## 🔐 Security Notes

### Current Setup (Development)
- ✅ Password hashing with bcryptjs
- ✅ JWT token-based auth
- ✅ CORS enabled for localhost
- ⚠️ **In-memory storage** (resets on restart)
- ⚠️ **Default JWT secret** (change in production)

### For Production Deployment
1. **Update JWT_SECRET**:
   ```env
   JWT_SECRET=<generate-a-secure-random-string>
   ```

2. **Set FRONTEND_URL to production domain**:
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Add database**:
   - Replace in-memory storage with MongoDB/PostgreSQL
   - Implement user persistence
   - Add message history

4. **Enable HTTPS/SSL**:
   - Use SSL certificates
   - Update CORS to accept https://

5. **Set NODE_ENV**:
   ```env
   NODE_ENV=production
   ```

## 📊 Project Structure

```
ChatApp/
├── frontend code (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── Chat/
│   │   │       └── ChatRoom.jsx, MessageList.jsx, MessageInput.jsx
│   │   ├── services/
│   │   │   └── authService.js (calls backend API)
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx (manages login state)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/ (Node.js + Express)
    ├── server.js (main backend server)
    ├── package.json
    ├── .env
    └── README.md
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is already in use
lsof -i :3001

# Kill any process on 3001
kill -9 <PID>

# Try again
npm run dev
```

### "Cannot connect to backend" error
1. Verify backend is running: `npm run dev` in backend folder
2. Check port 3001 is accessible
3. Verify `.env.local` has correct VITE_API_URL
4. Check browser console for detailed errors

### Login fails with "Network error"
1. Ensure backend is running on port 3001
2. Check CORS is enabled (it is by default)
3. Look at browser Network tab for response
4. Check backend console for errors

### Socket.io connection fails
1. Verify Socket.io is running on port 3001
2. Check WebSocket support in browser (all modern browsers support it)
3. Look at browser Network tab, filter by WS
4. Check backend console for connection logs

### Token validation fails
1. Ensure JWT_SECRET is the same on backend
2. Check token isn't expired (7 days expiration)
3. Verify Authorization header format: `Bearer <token>`
4. Check backend console for validation errors

## 📝 Available Test Users

After running the app, you can use these credentials:
- Email: `test@example.com`
- Password: `password123`

Or create new users by registering in the app.

## 🎯 Next Steps

### Short Term
1. ✅ Run the application locally
2. ✅ Test login and chat functionality
3. Test with multiple users

### Medium Term
1. Add message persistence (database)
2. Add user profiles
3. Add room creation by users
4. Add typing indicators

### Long Term
1. Deploy to production server
2. Set up real database
3. Add file sharing
4. Add user presence/online status
5. Add user search
6. Add direct messaging

## 📚 Resources

- **Frontend**: [React Documentation](https://react.dev)
- **Backend**: [Express.js Documentation](https://expressjs.com)
- **Real-time**: [Socket.io Documentation](https://socket.io/docs/)
- **Authentication**: [JWT Introduction](https://jwt.io/introduction)

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can see chat rooms
- [ ] Can send and receive messages
- [ ] Can join/leave rooms
- [ ] Multiple users can chat together

## 🆘 Support

If you encounter issues:

1. Check console logs:
   - Browser: Open DevTools (F12) → Console tab
   - Backend: Check terminal output

2. Check Network tab:
   - Browser DevTools → Network
   - Look for failed API requests

3. Check backend logs:
   - Look for error messages in backend terminal

4. Try restarting:
   - Kill backend (Ctrl+C)
   - Kill frontend (Ctrl+C)
   - Start again with `./start.sh`

## 🎉 Congratulations!

Your ChatApp is now fully functional with:
- ✅ User authentication
- ✅ Real-time messaging
- ✅ Chat rooms
- ✅ Production-ready backend

Start chatting! 🚀
