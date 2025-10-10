# Video Player Backend

A robust NestJS backend API for the Advanced Video Player application, featuring GraphQL, PostgreSQL, and video streaming capabilities.

## 🏗️ Architecture

- **NestJS** - Scalable Node.js framework
- **GraphQL** - Type-safe API with Apollo Server
- **TypeORM** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Multer** - File upload handling

## 🚀 Features

### Core Features

- **GraphQL API** with introspection and playground
- **Video Management** - CRUD operations for videos
- **Annotation System** - Time-based video annotations
- **File Streaming** - Efficient video file serving
- **Database Relations** - Proper foreign key relationships
- **Validation** - Input validation with class-validator
- **Error Handling** - Comprehensive error responses

### API Endpoints

#### GraphQL Playground

- **URL**: `http://localhost:3001/graphql`
- **Features**: Interactive query builder, schema documentation

#### Video Streaming

- **URL**: `http://localhost:3001/videos/{filename}`
- **Features**: Direct video file access, proper MIME types

## 📊 Database Schema

### Videos Table

```typescript
@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column('bigint')
  size: number;

  @Column('float')
  duration: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Annotation, (annotation) => annotation.video)
  annotations?: Annotation[];
}
```

### Annotations Table

```typescript
@Entity('annotations')
export class Annotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column('float')
  startTime: number;

  @Column('float')
  endTime: number;

  @Column({ default: 'chapter' })
  type: string;

  @Column({ default: '#3B82F6' })
  color: string;

  @ManyToOne(() => Video, (video) => video.annotations)
  video: Video;
}
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

3. **Database setup**

   ```bash
   # Using Docker
   docker-compose up -d postgres

   # Or install PostgreSQL locally
   # Create database: video_player
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging
npm run start:prod         # Start production build

# Building
npm run build              # Build the application
npm run build:watch        # Build with watch mode

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Database
npm run seed               # Seed database with sample data

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🔌 API Reference

### GraphQL Schema

#### Queries

```graphql
# Get all videos
query GetVideos {
  videos {
    id
    title
    description
    filename
    duration
    views
    annotations {
      id
      title
      startTime
      endTime
      color
    }
  }
}

# Get video by ID
query GetVideo($id: ID!) {
  video(id: $id) {
    id
    title
    description
    filename
    duration
    views
    annotations {
      id
      title
      description
      startTime
      endTime
      type
      color
    }
  }
}

# Get annotations by video
query GetAnnotationsByVideo($videoId: ID!) {
  annotationsByVideo(videoId: $videoId) {
    id
    title
    description
    startTime
    endTime
    type
    color
  }
}
```

#### Mutations

```graphql
# Create annotation
mutation CreateAnnotation($createAnnotationInput: CreateAnnotationInput!) {
  createAnnotation(createAnnotationInput: $createAnnotationInput) {
    id
    title
    description
    startTime
    endTime
    type
    color
  }
}

# Update annotation
mutation UpdateAnnotation(
  $id: ID!
  $updateAnnotationInput: UpdateAnnotationInput!
) {
  updateAnnotation(id: $id, updateAnnotationInput: $updateAnnotationInput) {
    id
    title
    description
    startTime
    endTime
    type
    color
  }
}

# Delete annotation
mutation DeleteAnnotation($id: ID!) {
  removeAnnotation(id: $id)
}
```

### Input Types

```graphql
input CreateAnnotationInput {
  title: String!
  description: String
  startTime: Float!
  endTime: Float!
  type: String = "chapter"
  color: String = "#3B82F6"
  isActive: Boolean = true
  videoId: ID!
}

input UpdateAnnotationInput {
  title: String
  description: String
  startTime: Float
  endTime: Float
  type: String
  color: String
  isActive: Boolean
}
```

## 🗄️ Database Operations

### Seeding

The application includes a comprehensive seeding script that creates:

- Sample videos with metadata
- Annotations with different types and colors
- Placeholder video files

```bash
npm run seed
```

### Migrations

TypeORM handles database schema automatically in development mode. For production:

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## 🔒 Security

### CORS Configuration

```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'http://frontend:3000'],
  credentials: true,
});
```

### Input Validation

All inputs are validated using class-validator decorators:

- Required fields validation
- Type checking
- Custom validation rules
- Sanitization

### File Security

- File type validation
- Size limits
- Secure file serving
- Path traversal protection

## 📁 Project Structure

```
backend-nestjs/
├── src/
│   ├── video/                 # Video module
│   │   ├── dto/              # Data transfer objects
│   │   ├── entities/         # Database entities
│   │   ├── video.module.ts   # Module definition
│   │   ├── video.resolver.ts # GraphQL resolver
│   │   └── video.service.ts  # Business logic
│   ├── annotation/           # Annotation module
│   │   ├── dto/              # Data transfer objects
│   │   ├── entities/         # Database entities
│   │   ├── annotation.module.ts
│   │   ├── annotation.resolver.ts
│   │   └── annotation.service.ts
│   ├── app.module.ts         # Main application module
│   ├── main.ts              # Application entry point
│   └── seed.ts              # Database seeding script
├── videos/                   # Video file storage
├── Dockerfile               # Docker configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🐳 Docker

### Development

```bash
# Build and run
docker-compose up -d backend

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Production

```bash
# Build production image
docker build -t video-player-backend .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  video-player-backend
```

## 🔍 Monitoring & Logging

### Logging

- Structured logging with timestamps
- Different log levels (error, warn, info, debug)
- Request/response logging
- Database query logging

### Health Checks

- Database connection status
- Service availability
- Memory usage monitoring

## 🚀 Performance

### Optimizations

- Database connection pooling
- Query optimization with TypeORM
- Efficient file streaming
- GraphQL query caching
- Response compression

### Caching

- Apollo Server caching
- Database query caching
- Static file caching

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/video_player
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=video_player

# Application
NODE_ENV=development
PORT=3001

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Production

```bash
docker build -t video-player-backend .
docker run -p 3001:3001 video-player-backend
```

### Environment Setup

1. Set production environment variables
2. Configure database connection
3. Set up reverse proxy
4. Configure SSL certificates
5. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
