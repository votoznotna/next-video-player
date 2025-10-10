# Video Player Frontend

A modern, responsive video player frontend built with Next.js 15 and React 19, featuring advanced video controls, annotation navigation, and a professional user interface.

## 🎨 Features

### Video Player

- **Advanced Controls**: Play/pause, seek, volume, fullscreen
- **Chapter Navigation**: Click annotations to jump to specific sections
- **Progress Visualization**: Visual markers for annotations
- **Keyboard Shortcuts**: Space, arrow keys, F for fullscreen
- **Responsive Design**: Works on all device sizes

### User Interface

- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Dark/Light Theme**: Adaptive color scheme
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

### Annotation System

- **Visual Timeline**: Color-coded annotation markers
- **Chapter List**: Sidebar with all video chapters
- **Real-time Updates**: Current position indicators
- **Interactive Navigation**: Click to jump to any section

## 🏗️ Architecture

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with improved performance and features
- **TypeScript** - Type safety and better developer experience
- **Apollo Client** - GraphQL client with caching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons
- **Framer Motion** - Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on port 3001

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── VideoPlayer.tsx    # Main video player
│   │   ├── VideoPlayerPage.tsx # Video player page
│   │   ├── VideoCard.tsx      # Video card component
│   │   ├── AnnotationList.tsx # Annotations sidebar
│   │   └── ApolloWrapper.tsx  # Apollo Client wrapper
│   ├── lib/                   # Utilities and configuration
│   │   ├── apollo-client.ts   # Apollo Client setup
│   │   └── utils.ts           # Utility functions
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Shared types
│   └── graphql/               # GraphQL queries and mutations
│       └── queries.ts         # All GraphQL operations
├── public/                    # Static assets
├── Dockerfile                 # Docker configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🎮 User Interface

### Video Player Controls

#### Keyboard Shortcuts

- **Space** - Play/Pause
- **Left Arrow** - Seek backward 10 seconds
- **Right Arrow** - Seek forward 10 seconds
- **Up Arrow** - Volume up
- **Down Arrow** - Volume down
- **F** - Toggle fullscreen
- **M** - Mute/Unmute

#### Mouse Controls

- **Click video** - Play/Pause
- **Click progress bar** - Seek to position
- **Click annotation markers** - Jump to annotation
- **Hover controls** - Show/hide control bar

### Navigation

#### Video Library

- Grid layout of video cards
- Video thumbnails with play overlay
- Duration, views, and file size display
- Chapter count indicators

#### Video Player Page

- Full-screen video player
- Annotations sidebar
- Video metadata display
- Add annotation button

## 🎨 Design System

### Colors

```css
/* Primary Colors */
--primary-50: #eff6ff
--primary-500: #3b82f6
--primary-600: #2563eb
--primary-700: #1d4ed8

/* Gray Scale */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-500: #6b7280
--gray-900: #111827
```

### Typography

- **Font Family**: Inter (system font stack)
- **Headings**: Font weights 600-700
- **Body**: Font weight 400
- **Code**: Monospace font

### Components

#### Buttons

```tsx
// Primary button
<button className="btn btn-primary">Primary Action</button>

// Secondary button
<button className="btn btn-secondary">Secondary Action</button>

// Ghost button
<button className="btn btn-ghost">Ghost Action</button>
```

#### Cards

```tsx
<div className='card p-6'>{/* Card content */}</div>
```

#### Inputs

```tsx
<input className='input' placeholder='Enter text...' />
```

## 🔌 API Integration

### GraphQL Client Setup

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### Query Examples

```typescript
import { useQuery } from '@apollo/client';
import { GET_VIDEOS } from '@/graphql/queries';

function VideoList() {
  const { data, loading, error } = useQuery(GET_VIDEOS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
```

## 🎯 Component Architecture

### VideoPlayer Component

```typescript
interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    filename: string;
    duration: number;
  };
  annotations: Annotation[];
  onAnnotationClick?: (annotation: Annotation) => void;
  onTimeUpdate?: (currentTime: number) => void;
}
```

**Features:**

- HTML5 video element with custom controls
- Progress bar with annotation markers
- Volume and fullscreen controls
- Keyboard event handling
- Responsive design

### AnnotationList Component

```typescript
interface AnnotationListProps {
  annotations: Annotation[];
  currentTime: number;
  onAnnotationClick: (annotation: Annotation) => void;
  onSeekToTime: (time: number) => void;
}
```

**Features:**

- List of all video annotations
- Current position indicators
- Click-to-navigate functionality
- Progress visualization for active annotations

## 🎨 Styling

### Tailwind CSS Configuration

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... more color variants
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
};
```

### Custom CSS Classes

```css
/* Video player specific styles */
.video-player-container {
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations

- Touch-friendly controls
- Swipe gestures for seeking
- Optimized button sizes
- Responsive video player

### Desktop Features

- Keyboard shortcuts
- Hover effects
- Precise mouse controls
- Multi-column layouts

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/graphql

# Development
NODE_ENV=development
```

### Next.js Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination:
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/graphql',
      },
    ];
  },
};
```

## 🐳 Docker

### Development

```bash
# Build and run
docker-compose up -d frontend

# View logs
docker-compose logs -f frontend
```

### Production

```bash
# Build production image
docker build -t video-player-frontend .

# Run container
docker run -p 3000:3000 video-player-frontend
```

## 🧪 Testing

### Component Testing

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### E2E Testing

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

## 🚀 Performance

### Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Apollo Client caching
- **Lazy Loading**: Dynamic imports

### Performance Monitoring

- Core Web Vitals tracking
- Bundle size monitoring
- Runtime performance metrics

## 🔒 Security

### Best Practices

- Input sanitization
- XSS prevention
- CSRF protection
- Secure headers
- Environment variable protection

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker Production

```bash
# Build production image
docker build -t video-player-frontend .

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com/graphql \
  video-player-frontend
```

### Static Export

```bash
# Build static export
npm run build
npm run export

# Serve static files
npx serve out
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
