#!/bin/bash

echo "🔄 Switching Video Player Backend..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [fastapi|nestjs]"
    echo ""
    echo "Available backends:"
    echo "  fastapi  - Use FastAPI backend (default, port 8000)"
    echo "  nestjs   - Use NestJS backend (port 3001)"
    exit 1
fi

BACKEND_TYPE=$1

case $BACKEND_TYPE in
    "fastapi")
        echo "🚀 Switching to FastAPI backend..."
        
        # Update docker-compose.dev.yml to use FastAPI as default
        sed -i.bak 's|context: ./backend|context: ./backend-fastapi|g' docker-compose.dev.yml
        sed -i.bak 's|dockerfile: Dockerfile.dev|dockerfile: Dockerfile.dev|g' docker-compose.dev.yml
        sed -i.bak 's|container_name: video-player-backend-dev|container_name: video-player-backend-dev|g' docker-compose.dev.yml
        sed -i.bak 's|DATABASE_URL: postgresql://|DATABASE_URL: postgresql+asyncpg://|g' docker-compose.dev.yml
        sed -i.bak 's|NODE_ENV: development|ENVIRONMENT: development|g' docker-compose.dev.yml
        sed -i.bak 's|ports:|ports:|g' docker-compose.dev.yml
        sed -i.bak 's|- '\''3001:3001'\''|- '\''8000:8000'\''|g' docker-compose.dev.yml
        sed -i.bak 's|NEXT_PUBLIC_API_URL: http://localhost:3001/graphql|NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1|g' docker-compose.dev.yml
        
        # Update docker-compose.yml for production
        sed -i.bak 's|context: ./backend|context: ./backend-fastapi|g' docker-compose.yml
        sed -i.bak 's|dockerfile: Dockerfile|dockerfile: Dockerfile|g' docker-compose.yml
        sed -i.bak 's|container_name: video-player-backend|container_name: video-player-backend|g' docker-compose.yml
        sed -i.bak 's|DATABASE_URL: postgresql://|DATABASE_URL: postgresql+asyncpg://|g' docker-compose.yml
        sed -i.bak 's|NODE_ENV: production|ENVIRONMENT: production|g' docker-compose.yml
        sed -i.bak 's|ports:|ports:|g' docker-compose.yml
        sed -i.bak 's|- '\''3001:3001'\''|- '\''8000:8000'\''|g' docker-compose.yml
        sed -i.bak 's|NEXT_PUBLIC_API_URL: http://localhost:3001/graphql|NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1|g' docker-compose.yml
        
        echo "✅ Switched to FastAPI backend (port 8000)"
        echo "📝 Updated docker-compose files"
        echo "🔄 Please restart the services: ./scripts/stop.sh && ./scripts/start.sh dev"
        ;;
        
    "nestjs")
        echo "🚀 Switching to NestJS backend..."
        
        # Update docker-compose.dev.yml to use NestJS as default
        sed -i.bak 's|context: ./backend-fastapi|context: ./backend|g' docker-compose.dev.yml
        sed -i.bak 's|dockerfile: Dockerfile.dev|dockerfile: Dockerfile.dev|g' docker-compose.dev.yml
        sed -i.bak 's|container_name: video-player-backend-dev|container_name: video-player-backend-dev|g' docker-compose.dev.yml
        sed -i.bak 's|DATABASE_URL: postgresql+asyncpg://|DATABASE_URL: postgresql://|g' docker-compose.dev.yml
        sed -i.bak 's|ENVIRONMENT: development|NODE_ENV: development|g' docker-compose.dev.yml
        sed -i.bak 's|ports:|ports:|g' docker-compose.dev.yml
        sed -i.bak 's|- '\''8000:8000'\''|- '\''3001:3001'\''|g' docker-compose.dev.yml
        sed -i.bak 's|NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1|NEXT_PUBLIC_API_URL: http://localhost:3001/graphql|g' docker-compose.dev.yml
        
        # Update docker-compose.yml for production
        sed -i.bak 's|context: ./backend-fastapi|context: ./backend|g' docker-compose.yml
        sed -i.bak 's|dockerfile: Dockerfile|dockerfile: Dockerfile|g' docker-compose.yml
        sed -i.bak 's|container_name: video-player-backend|container_name: video-player-backend|g' docker-compose.yml
        sed -i.bak 's|DATABASE_URL: postgresql+asyncpg://|DATABASE_URL: postgresql://|g' docker-compose.yml
        sed -i.bak 's|ENVIRONMENT: production|NODE_ENV: production|g' docker-compose.yml
        sed -i.bak 's|ports:|ports:|g' docker-compose.yml
        sed -i.bak 's|- '\''8000:8000'\''|- '\''3001:3001'\''|g' docker-compose.yml
        sed -i.bak 's|NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1|NEXT_PUBLIC_API_URL: http://localhost:3001/graphql|g' docker-compose.yml
        
        echo "✅ Switched to NestJS backend (port 3001)"
        echo "📝 Updated docker-compose files"
        echo "🔄 Please restart the services: ./scripts/stop.sh && ./scripts/start.sh dev"
        ;;
        
    *)
        echo "❌ Invalid backend type: $BACKEND_TYPE"
        echo "Available options: fastapi, nestjs"
        exit 1
        ;;
esac

# Clean up backup files
rm -f docker-compose.yml.bak docker-compose.dev.yml.bak

echo ""
echo "🎯 Current backend: $BACKEND_TYPE"
echo "📋 To restart services: ./scripts/stop.sh && ./scripts/start.sh dev"
echo "🌱 To seed database: ./scripts/seed-fastapi.sh (for FastAPI) or ./scripts/seed-nestjs.sh (for NestJS)"
