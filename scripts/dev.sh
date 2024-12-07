#!/bin/bash

# Start development servers
echo "Starting development servers..."

# Start MongoDB (assuming it's installed)
echo "Starting MongoDB..."
mongod --dbpath ./data/db &

# Start Redis
echo "Starting Redis..."
redis-server &

# Start backend server
echo "Starting backend server..."
cd backend
npm run dev &

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev &

# Wait for all background processes
wait