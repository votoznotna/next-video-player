#!/bin/bash

echo "🛑 Stopping Video Player Application..."

# Stop all services (both dev and production)
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Kill any processes running on project ports
echo "🔌 Killing processes on project ports..."

# Kill processes on port 3000 (Frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   Killing processes on port 3000 (Frontend)..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 8000 (Backend)
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "   Killing processes on port 8000 (Backend)..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 5432 (PostgreSQL)
if lsof -ti:5432 > /dev/null 2>&1; then
    echo "   Killing processes on port 5432 (PostgreSQL)..."
    lsof -ti:5432 | xargs kill -9 2>/dev/null || true
fi

echo "✅ All services and processes stopped successfully!"
