#!/bin/bash

echo "🚀 Setting up Advanced Video Player..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create videos directory
echo "📁 Creating videos directory..."
mkdir -p videos

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend-nestjs && npm install && cd ..

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Seed the database
echo "🌱 Seeding database..."
cd backend-nestjs && npm run seed && cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend GraphQL: http://localhost:3001/graphql"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📝 Available commands:"
echo "  ./scripts/start.sh  - Start all services"
echo "  ./scripts/stop.sh   - Stop all services"
echo "  ./scripts/clean.sh  - Clean up everything"
echo ""
echo "🎉 Happy coding!"
