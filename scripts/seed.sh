#!/bin/bash

echo "🌱 Seeding database with sample data..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if Docker services are running
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "❌ Docker services are not running. Please start them first:"
    echo "   ./scripts/start.sh dev"
    exit 1
fi

# Run the seed script inside the backend container
echo "📦 Running seed script in backend container..."
docker-compose -f docker-compose.dev.yml exec backend python seed.py

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📊 Sample data created:"
    echo "  - 3 sample videos"
    echo "  - 5 annotations per video"
    echo "  - Sample video files"
    echo ""
    echo "🌐 Visit http://localhost:3000 to view videos"
    echo "📊 GraphQL Playground: http://localhost:8000/graphql"
else
    echo "❌ Failed to seed database"
    exit 1
fi
