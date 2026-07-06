import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
// Allow both localhost and 127.0.0.1 origins during development
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const FRONTEND_HOSTS = [FRONTEND_URL, FRONTEND_URL.replace('localhost', '127.0.0.1')];

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // allow requests with no origin like curl/postman
      if (!origin) return callback(null, true);
      if (FRONTEND_HOSTS.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy violation'));
    },
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (FRONTEND_HOSTS.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy violation'));
  },
  credentials: true
}));
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory user storage (use database in production)
const users = new Map();
const rooms = new Map();
const connectedUsers = new Map();

// Initialize default rooms
['general', 'random', 'help'].forEach(room => {
  rooms.set(room, { name: room, users: [] });
});

// ==================== AUTHENTICATION ENDPOINTS ====================

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.set(email, user);

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

/**
 * GET /api/auth/validate
 * Validate JWT token
 */
app.get('/api/auth/validate', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = users.get(decoded.email);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// ==================== SOCKET.IO EVENTS ====================

// Middleware for socket authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication failed: No token provided'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    socket.username = decoded.username;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.username} (${socket.userId})`);
  connectedUsers.set(socket.id, {
    userId: socket.userId,
    username: socket.username,
    email: socket.userEmail
  });

  // Send list of available rooms
  socket.emit('roomsList', Array.from(rooms.values()).map(room => ({
    name: room.name,
    userCount: room.users.length
  })));

  /**
   * Join a chat room
   */
  socket.on('joinRoom', (roomName) => {
    try {
      if (!rooms.has(roomName)) {
        rooms.set(roomName, { name: roomName, users: [] });
      }

      const room = rooms.get(roomName);

      // Add user to room if not already there
      if (!room.users.find(u => u.id === socket.id)) {
        room.users.push({
          id: socket.id,
          username: socket.username,
          userId: socket.userId
        });
      }

      // Join socket to room
      socket.join(roomName);

      // Notify others in room
      io.to(roomName).emit('userJoined', {
        username: socket.username,
        message: `${socket.username} joined the room`
      });

      // Send updated user list to room
      io.to(roomName).emit('userList', room.users.map(u => u.username));

      console.log(`${socket.username} joined room: ${roomName}`);
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  /**
   * Send a message to a room
   */
  socket.on('sendMessage', (data) => {
    try {
      const { roomName, message } = data;

      if (!roomName || !message) {
        socket.emit('error', { message: 'Room name and message are required' });
        return;
      }

      // Broadcast message to room
      io.to(roomName).emit('message', {
        username: socket.username,
        message,
        timestamp: new Date(),
        userId: socket.userId
      });

      console.log(`Message in ${roomName} from ${socket.username}: ${message}`);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  /**
   * Leave a room
   */
  socket.on('leaveRoom', (roomName) => {
    try {
      socket.leave(roomName);

      const room = rooms.get(roomName);
      if (room) {
        room.users = room.users.filter(u => u.id !== socket.id);
      }

      io.to(roomName).emit('userLeft', {
        username: socket.username,
        message: `${socket.username} left the room`
      });

      if (room) {
        io.to(roomName).emit('userList', room.users.map(u => u.username));
      }

      console.log(`${socket.username} left room: ${roomName}`);
    } catch (error) {
      console.error('Leave room error:', error);
    }
  });

  /**
   * Get list of rooms
   */
  socket.on('getRooms', () => {
    try {
      socket.emit('roomsList', Array.from(rooms.values()).map(room => ({
        name: room.name,
        userCount: room.users.length
      })));
    } catch (error) {
      console.error('Get rooms error:', error);
      socket.emit('error', { message: 'Failed to get rooms' });
    }
  });

  /**
   * Disconnect handler
   */
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.username} (${socket.userId})`);
    connectedUsers.delete(socket.id);

    // Remove user from all rooms
    for (const [roomName, room] of rooms) {
      room.users = room.users.filter(u => u.id !== socket.id);
      if (room.users.length > 0) {
        io.to(roomName).emit('userList', room.users.map(u => u.username));
      }
    }
  });

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.username}:`, error);
  });
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// ==================== START SERVER ====================

httpServer.listen(PORT, () => {
  console.log(`✅ ChatApp Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET === 'your-secret-key-change-in-production' ? '⚠️  DEFAULT (CHANGE IN PRODUCTION)' : '✅ Set'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
