#!/bin/bash
# Shell script to install dependencies and start server
# For macOS and Linux users

echo "========================================"
echo "  KOPI KUBA - Backend Setup & Start"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo "Dependencies installed successfully!"
fi

echo ""
echo "Starting Kopi Kuba Backend Server..."
echo ""
echo "Server akan berjalan di: http://localhost:3000"
echo "Database: kopikuba.db"
echo ""
echo "Tekan CTRL+C untuk menghentikan server"
echo ""

npm start
