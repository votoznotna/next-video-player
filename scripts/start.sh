#!/bin/bash

echo "🚀 Starting Video Player Application..."

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
echo "🔧 Backend GraphQL: http://localhost:3001/graphql"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📝 To view logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "🛑 To stop: ./scripts/stop.sh"
