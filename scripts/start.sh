#!/bin/bash

echo "🚀 Starting Insider Threat Video Analyzer..."

# Create videos directory if it doesn't exist
mkdir -p videos

# Check if we should use development mode
if [ "$1" = "dev" ]; then
    echo "🔧 Starting in development mode..."
    COMPOSE_FILE="docker-compose.dev.yml"
else
    echo "🏭 Starting in production mode..."
    COMPOSE_FILE="docker-compose.yml"
fi

# Start all services
echo "📦 Starting Docker services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f $COMPOSE_FILE ps

echo "✅ Services started successfully!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend (FastAPI): http://localhost:8000"
echo "📊 GraphQL Playground: http://localhost:8000/graphql"
echo "📚 API Docs: http://localhost:8000/docs"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📝 To view logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "🛑 To stop: ./scripts/stop.sh"
echo "🌱 To seed database: ./scripts/seed.sh"
