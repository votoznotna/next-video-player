#!/bin/bash

echo "🧹 Cleaning Video Player Application..."

# Stop and remove all containers, networks, and volumes (both dev and production)
docker-compose down -v
docker-compose -f docker-compose.dev.yml down -v

# Kill any processes running on project ports
echo "🔌 Killing processes on project ports..."

# Kill processes on port 3000 (Frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   Killing processes on port 3000 (Frontend)..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 3001 (Backend)
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "   Killing processes on port 3001 (Backend)..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 5432 (PostgreSQL)
if lsof -ti:5432 > /dev/null 2>&1; then
    echo "   Killing processes on port 5432 (PostgreSQL)..."
    lsof -ti:5432 | xargs kill -9 2>/dev/null || true
fi

# Remove unused Docker resources
docker system prune -f

# Remove videos directory
rm -rf videos

echo "✅ Cleanup completed successfully!"
