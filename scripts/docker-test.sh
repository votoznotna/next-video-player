#!/bin/bash

echo "🧪 Testing Docker setup with Next.js 15 and React 19..."

# Create videos directory
mkdir -p videos

echo "🔧 Testing development mode..."
echo "📦 Building and starting development containers..."

# Test development setup
docker-compose -f docker-compose.dev.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 20

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.dev.yml ps

# Test if frontend is accessible
echo "🌐 Testing frontend accessibility..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible at http://localhost:3000"
else
    echo "❌ Frontend is not accessible"
fi

# Test if backend is accessible
echo "🔧 Testing backend accessibility..."
if curl -f http://localhost:3001/graphql > /dev/null 2>&1; then
    echo "✅ Backend GraphQL is accessible at http://localhost:3001/graphql"
else
    echo "❌ Backend GraphQL is not accessible"
fi

# Test if database is accessible
echo "🗄️ Testing database connectivity..."
if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is accessible"
else
    echo "❌ Database is not accessible"
fi

echo ""
echo "📝 Viewing logs for troubleshooting..."
echo "Frontend logs:"
docker-compose -f docker-compose.dev.yml logs --tail=10 frontend

echo ""
echo "Backend logs:"
docker-compose -f docker-compose.dev.yml logs --tail=10 backend

echo ""
echo "🧹 Cleaning up test containers..."
docker-compose -f docker-compose.dev.yml down

echo ""
echo "✅ Docker test completed!"
echo ""
echo "If all tests passed, your Docker setup is working correctly with Next.js 15 and React 19!"
echo ""
echo "To start the application:"
echo "  Development: ./scripts/start.sh dev"
echo "  Production:  ./scripts/start.sh"
