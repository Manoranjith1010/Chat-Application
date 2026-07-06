import axios from 'axios';
import { io } from 'socket.io-client';

const API = 'http://localhost:3001/api/auth';
const SOCKET_URL = 'http://localhost:3001';

async function run() {
  try {
    // Try login with a known account, otherwise register a fresh one
    let token;
    try {
      const loginRes = await axios.post(`${API}/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      token = loginRes.data.token;
      console.log('Logged in as test@example.com');
    } catch (e) {
      console.log('Default login failed, registering a new test user');
      const unique = Date.now();
      const regRes = await axios.post(`${API}/register`, {
        username: `auto${unique}`,
        email: `auto${unique}@example.com`,
        password: 'password123'
      });
      token = regRes.data.token;
      console.log('Registered and obtained token');
    }
    console.log('Token starts:', token.substring(0,20) + '...');

    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // Join general room
      socket.emit('joinRoom', 'general');

      // Send a test message
      socket.emit('sendMessage', { roomName: 'general', message: 'Hello from test script' });
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
      // After receiving the message we can close
      socket.close();
      process.exit(0);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message);
      process.exit(1);
    });

    // timeout
    setTimeout(() => {
      console.error('No message received within timeout');
      socket.close();
      process.exit(1);
    }, 5000);

  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

run();
