#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..

# Copy environment files
echo "Setting up environment files..."
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo "Setup complete!"