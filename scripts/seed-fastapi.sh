#!/bin/bash

echo "🌱 Seeding FastAPI database with Docker..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if Docker services are running
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "❌ Docker services are not running. Please start them first:"
    echo "   ./scripts/start.sh dev"
    exit 1
fi

# Run the seed script inside the FastAPI backend container
echo "📦 Running seed script in FastAPI backend container..."
docker-compose -f docker-compose.dev.yml exec backend-fastapi /usr/local/bin/python seed.py

echo "✅ FastAPI seeding completed!"
