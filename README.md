# Chat Application

A full-stack real-time chat app with a React frontend and an Express + Socket.IO backend. Users can register, log in, join chat rooms, and exchange messages instantly.

## Features

- User registration and login
- JWT-based authentication
- Real-time messaging in chat rooms
- Room joining and leaving
- User presence updates
- Responsive UI built with React and Vite

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Socket.IO client
- Axios

### Backend
- Node.js
- Express
- Socket.IO
- JSON Web Tokens
- bcryptjs

## Project Structure

```text
Chat-Application/
├── backend/
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Configure environment variables

Create a root environment file for the frontend:

```bash
cp .env.example .env.local
```

Example values:

```env
VITE_API_URL=http://localhost:3001/api/auth
VITE_SOCKET_URL=http://localhost:3001
```

Create a backend environment file if needed:

```bash
cd backend
cat > .env <<'EOF'
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
EOF
```

### 4. Start the application

Start the backend:

```bash
cd backend
npm run dev
```

In a second terminal, start the frontend:

```bash
npm run dev
```

Open the app at http://localhost:5173.

## Available Scripts

### Root project

```bash
npm run dev      # start the Vite frontend
npm run build    # build the production bundle
npm run preview  # preview the built app
```

### Backend

```bash
cd backend
npm run dev      # start the backend in watch mode
npm run start    # start the backend normally
```

## Backend Endpoints

The backend provides:

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/validate
- GET /health

## Socket.IO Events

The app uses the following Socket.IO events:

- joinRoom
- leaveRoom
- sendMessage
- getRooms
- message
- roomsList
- userJoined
- userLeft
- userList

## Notes

- The backend currently stores users and rooms in memory, so data will reset when the server restarts.
- For production use, replace the in-memory storage with a real database and a stronger JWT secret.

## License

This project is available for learning and development purposes.
