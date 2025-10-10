#!/bin/bash

echo "🌱 Seeding NestJS database with Docker..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if Docker services are running
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "❌ Docker services are not running. Please start them first:"
    echo "   ./scripts/start.sh dev"
    exit 1
fi

# Run the seed script inside the NestJS backend container
echo "📦 Running seed script in NestJS backend container..."
docker-compose -f docker-compose.dev.yml exec backend-nestjs npm run seed

echo "✅ NestJS seeding completed!"
