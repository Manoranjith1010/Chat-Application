#!/bin/bash

# ChatApp - Start Both Frontend and Backend
# This script starts the frontend (Vite) and backend (Express) servers

echo "🚀 Starting ChatApp..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm."
    exit 1
fi

# Function to handle script termination
cleanup() {
    echo ""
    echo "🛑 Stopping ChatApp..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch CTRL+C
trap cleanup SIGINT SIGTERM

# Start Backend
echo "${BLUE}Starting Backend Server...${NC}"
cd backend
npm install --silent 2>/dev/null
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "${GREEN}✅ Backend starting (PID: $BACKEND_PID)${NC}"
echo "   📡 Server: http://localhost:3001"
echo ""

# Wait a moment for backend to start
sleep 2

# Start Frontend
echo "${BLUE}Starting Frontend Development Server...${NC}"
cd ..
npm install --silent 2>/dev/null
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "${GREEN}✅ Frontend starting (PID: $FRONTEND_PID)${NC}"
echo "   🌐 Application: http://localhost:5173"
echo ""

echo "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo "${GREEN}✅ ChatApp is running!${NC}"
echo "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Backend URL:  ${GREEN}http://localhost:3001${NC}"
echo "Frontend URL: ${GREEN}http://localhost:5173${NC}"
echo ""
echo "Press ${YELLOW}CTRL+C${NC} to stop both servers"
echo ""

# Show logs if there are errors
if [ -s /tmp/backend.log ]; then
    echo "${YELLOW}Backend startup log:${NC}"
    head -n 5 /tmp/backend.log
fi

# Wait for both processes
wait
