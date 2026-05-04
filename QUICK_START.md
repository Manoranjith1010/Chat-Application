# ChatApp - Quick Start Guide

Get your React chat application running in minutes!

## 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Your app will open at **http://localhost:5173** automatically!

## What Was Created

✅ **Complete React Chat Application** with:
- Real-time messaging using Socket.io
- User authentication (Login/Register)
- Multiple chat rooms
- Modern, responsive UI
- Production-ready build configuration

## Project Files

```
ChatApp/
├── src/
│   ├── components/          # React UI components
│   │   ├── Auth/            # Login & Register forms
│   │   ├── Chat/            # Chat room & messages
│   │   └── common/          # Header & room list
│   ├── contexts/            # State management (Auth, Socket)
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API & Socket.io helpers
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── README.md                # Full documentation
├── SETUP_GUIDE.md           # Detailed setup guide
└── .env.example             # Environment variables
```

## Architecture Overview

### Frontend (This Project)
- **React 18** - UI library
- **Vite 5** - Fast build tool
- **React Router 6** - Client-side navigation
- **Socket.io Client 4** - Real-time messaging
- **Axios** - HTTP requests

### Required Backend
- Authentication API (REST)
- Socket.io server
- User & Room management

## Next Steps

### Option 1: Connect to Backend
1. Update `.env.local` with your backend URLs:
   ```env
   VITE_API_URL=http://your-backend:3001/api/auth
   VITE_SOCKET_URL=http://your-backend:3001
   ```
2. Ensure backend implements required endpoints (see SETUP_GUIDE.md)
3. Restart dev server: `npm run dev`

### Option 2: Build for Production
```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to hosting service
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Key Components

### Authentication
- **Login.jsx** - User login form with email/password
- **Register.jsx** - User registration with validation

### Chat Features
- **ChatRoom.jsx** - Main messaging interface
- **MessageList.jsx** - Displays message history with auto-scroll
- **MessageInput.jsx** - Message input form with Enter-to-send

### UI Components
- **Header.jsx** - App header with user info & logout
- **RoomList.jsx** - List of available chat rooms

## State Management

### AuthContext
Handles user authentication, login state, and token management.

```javascript
const { user, login, register, logout, loading, error } = useAuth();
```

### SocketContext
Manages Socket.io connection for real-time messaging.

```javascript
const { socket, isConnected } = useSocket();
```

## Real-time Events

### Sending Messages
```javascript
socket.emit('sendMessage', {
  roomId: 1,
  content: 'Hello!',
  timestamp: new Date().toISOString()
});
```

### Receiving Messages
```javascript
socket.on('message', (message) => {
  // Update UI with new message
});
```

### Joining Rooms
```javascript
socket.emit('joinRoom', { roomId: 1 });
```

## Styling

The application includes:
- ✅ Responsive design (mobile-friendly)
- ✅ Light theme with blue primary color
- ✅ CSS variables for easy customization
- ✅ Smooth animations and transitions
- ✅ Custom scrollbar styling

### Customize Colors

Edit `src/index.css`:
```css
:root {
  --primary-color: #007bff;      /* Change this */
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

## Backend Quick Setup Example

Here's a minimal Express + Socket.io backend example:

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: 'http://localhost:5173' }
});

app.use(cors());
app.use(express.json());

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  // Implement registration
  const user = { id: 1, username: req.body.username };
  const token = jwt.sign(user, 'SECRET_KEY');
  res.json({ ...user, token });
});

app.post('/api/auth/login', (req, res) => {
  // Implement login
  const user = { id: 1, username: 'test_user' };
  const token = jwt.sign(user, 'SECRET_KEY');
  res.json({ ...user, token });
});

app.get('/api/auth/validate', (req, res) => {
  // Verify token
  res.json({ id: 1, username: 'test_user' });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (data) => {
    socket.join(`room_${data.roomId}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(`room_${data.roomId}`).emit('message', {
      user: 'test_user',
      content: data.content,
      timestamp: data.timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server on port 3001');
});
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Socket Connection Failed
- Verify backend is running
- Check `VITE_SOCKET_URL` in `.env.local`
- Check backend CORS settings

### Login Not Working
- Verify backend authentication endpoints
- Check browser console for error messages
- Ensure token is being saved in localStorage

### Messages Not Updating
- Check Socket.io event names match backend
- Verify Socket is connected (check console)
- Check browser DevTools Network tab

## Performance Stats

Production build results:
- **HTML**: 0.47 kB (gzipped: 0.30 kB)
- **CSS**: 4.61 kB (gzipped: 1.37 kB)
- **JS**: 257.36 kB (gzipped: 84.92 kB)
- **Total**: ~90 KB gzipped

## Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Environment Variables

```env
# .env.local

# Backend authentication API endpoint
VITE_API_URL=http://localhost:3001/api/auth

# Socket.io server URL
VITE_SOCKET_URL=http://localhost:3001
```

For production, use `https://` URLs and your actual domain names.

## Next: Deployment

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drop dist/ folder into Netlify
```

### Deploy to AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket/
```

## Learn More

- 📚 [React Documentation](https://react.dev)
- ⚡ [Vite Guide](https://vitejs.dev)
- 🔌 [Socket.io Docs](https://socket.io/docs/)
- 🛣️ [React Router](https://reactrouter.com)
- 📖 [Full Setup Guide](./SETUP_GUIDE.md)

## Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed documentation
2. Review [README.md](./README.md) for feature overview
3. Check browser console for error messages
4. Verify backend is running and accessible

## What's Next?

- ✨ Add typing indicators
- 📎 Implement file sharing
- 🔔 Add push notifications
- 👥 Create user profiles
- 🎨 Add custom themes
- 📱 Build mobile app with React Native

Enjoy building your chat application! 🚀
