#!/bin/bash

echo "🧪 Testing Next.js 15 and React 19 upgrade..."

# Navigate to frontend directory
cd frontend

# Install new dependencies
echo "📦 Installing updated dependencies..."
npm install

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check

# Run linting
echo "🧹 Running ESLint..."
npm run lint

# Try building the project
echo "🏗️ Building the project..."
npm run build

echo ""
echo "✅ Upgrade test completed!"
echo ""
echo "If all steps passed, the upgrade to Next.js 15 and React 19 was successful!"
echo "You can now run: npm run dev"
