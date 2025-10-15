#!/bin/bash

echo "🔌 Killing processes on Video Player project ports..."

# Kill processes on port 3000 (Frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   Killing processes on port 3000 (Frontend)..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo "   ✅ Port 3000 cleared"
else
    echo "   ℹ️  No processes running on port 3000"
fi

# Kill processes on port 8000 (Backend)
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "   Killing processes on port 8000 (Backend)..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    echo "   ✅ Port 8000 cleared"
else
    echo "   ℹ️  No processes running on port 8000"
fi

# Kill processes on port 5432 (PostgreSQL)
if lsof -ti:5432 > /dev/null 2>&1; then
    echo "   Killing processes on port 5432 (PostgreSQL)..."
    lsof -ti:5432 | xargs kill -9 2>/dev/null || true
    echo "   ✅ Port 5432 cleared"
else
    echo "   ℹ️  No processes running on port 5432"
fi

echo "✅ Port cleanup completed!"
