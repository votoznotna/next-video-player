FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create videos directory
RUN mkdir -p videos

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
