# Implementation Guide - Enhanced Video Player

## ✅ Completed (Phase 1)

### 1. Dependencies Added

```json
"zustand": "^4.4.7",           // State management
"date-fns": "^3.0.6",           // Time utilities
"@radix-ui/react-dialog": "^1.0.5",
"@radix-ui/react-select": "^2.0.0",
"@radix-ui/react-slider": "^1.1.2",
"@radix-ui/react-tooltip": "^1.0.7"
```

### 2. New Files Created

**Hooks:**

- `frontend/src/hooks/useKeyboardShortcuts.ts` - Keyboard shortcut management

**Store:**

- `frontend/src/store/videoPlayerStore.ts` - Zustand state management

**Components:**

- `frontend/src/components/EnhancedVideoPlayer.tsx` - Full-featured video player

### 3. Features Implemented

✅ **Playback Controls:**

- Variable speed (0.25x - 8x)
- Play/Pause
- Skip forward/backward (5s, 10s, 30s)
- Jump to start/end
- Go to timestamp dialog

✅ **Frame-Accurate Navigation:**

- Frame-by-frame stepping (forward/backward)
- Frame counter display
- FPS-based calculations

✅ **Keyboard Shortcuts (30+):**

- Space/K - Play/Pause
- J/L - Skip 10s
- ←/→ - Seek 5s
- ,/. - Frame step
- [/] - Speed control
- ↑/↓ - Volume
- M - Mute
- F - Fullscreen
- G - Go to timestamp
- ? - Show shortcuts
- 1-5 - Quick annotations

✅ **UI Enhancements:**

- Speed indicator overlay
- Frame number display
- Playback speed menu
- Keyboard shortcuts help overlay
- Smooth transitions
- Auto-hide controls

✅ **Annotation Support:**

- Visual markers on timeline
- Color-coded by type
- Clickable for navigation
- Hover tooltips

## 🔄 Next Steps (Phase 2)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Update Existing Pages

Replace the old VideoPlayer with EnhancedVideoPlayer:

```typescript
// In your page component
import EnhancedVideoPlayer from '@/components/EnhancedVideoPlayer';

// Usage
<EnhancedVideoPlayer
  video={video}
  annotations={annotations}
  onAnnotationClick={handleAnnotationClick}
  onTimeUpdate={handleTimeUpdate}
  onCreateAnnotation={handleCreateAnnotation}
/>;
```

### 3. Create Annotation Dialog Component

Create `frontend/src/components/AnnotationDialog.tsx`:

```typescript
import * as Dialog from '@radix-ui/react-dialog';

interface AnnotationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (annotation: AnnotationInput) => void;
  initialTime: number;
}

export const AnnotationDialog = ({ open, onClose, onSave, initialTime }: AnnotationDialogProps) => {
  // Form for creating annotations
  // Types: Critical, Suspicious, Policy Violation, Note, Evidence
  // Fields: title, description, severity, tags
};
```

### 4. Create Timeline Component (Canvas-based)

For Phase 3, create a dedicated timeline component:

```typescript
// frontend/src/components/Timeline.tsx
import { useRef, useEffect } from 'react';

export const Timeline = ({ duration, currentTime, annotations, zoom }) => {
  // Canvas-based rendering for performance
  // Zoomable (10 levels)
  // Thumbnail previews on hover
};
```

### 5. Create Annotation Panel

```typescript
// frontend/src/components/AnnotationPanel.tsx
export const AnnotationPanel = ({ annotations, onSelect, onDelete, onEdit }) => {
  // Sidebar with annotation list
  // Filter by type/severity
  // Search functionality
  // Click to jump to time
};
```

### 6. Create Export Dialog

```typescript
// frontend/src/components/ExportDialog.tsx
export const ExportDialog = ({ videoId, startTime, endTime }) => {
  // Clip selection
  // Quality options
  // Format selection
  // Progress tracking
};
```

## 📋 Testing Checklist

### Keyboard Shortcuts

- [ ] Space - Play/Pause
- [ ] J/L - Skip 10s
- [ ] ←/→ - Seek 5s
- [ ] Shift+←/→ - Seek 30s
- [ ] ,/. - Frame step
- [ ] [/] - Speed control
- [ ] ↑/↓ - Volume
- [ ] M - Mute
- [ ] F - Fullscreen
- [ ] G - Go to timestamp
- [ ] ? - Show shortcuts
- [ ] 1-5 - Quick annotations
- [ ] Home/End - Jump to start/end

### Playback

- [ ] All speeds work (0.25x - 8x)
- [ ] Frame stepping is smooth
- [ ] Seeking is accurate
- [ ] Volume control works
- [ ] Fullscreen works

### UI

- [ ] Controls auto-hide
- [ ] Speed indicator shows
- [ ] Frame counter updates
- [ ] Keyboard help displays
- [ ] Annotations visible on timeline

### Performance

- [ ] No lag during playback
- [ ] Smooth frame stepping
- [ ] Quick speed changes
- [ ] Responsive controls

## 🎨 Customization

### Theme Colors

Update in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'critical': '#EF4444',      // Red
      'suspicious': '#F97316',    // Orange
      'policy': '#EAB308',        // Yellow
      'note': '#3B82F6',          // Blue
      'evidence': '#A855F7',      // Purple
    }
  }
}
```

### Keyboard Shortcuts

Modify in `EnhancedVideoPlayer.tsx`:

```typescript
useKeyboardShortcuts([
  { key: 'your-key', action: yourAction, description: 'Description' },
  // Add custom shortcuts
]);
```

## 🐛 Troubleshooting

### Video not loading

- Check video URL in component
- Verify backend is running on port 8000
- Check CORS settings

### Keyboard shortcuts not working

- Ensure no input fields are focused
- Check browser console for errors
- Verify useKeyboardShortcuts hook is active

### Performance issues

- Reduce annotation count
- Lower video quality
- Check browser performance

## 📚 API Integration

### GraphQL Mutations Needed

```graphql
mutation CreateAnnotation($input: CreateAnnotationInput!) {
  createAnnotation(input: $input) {
    id
    videoId
    startTime
    endTime
    type
    title
    description
    severity
    tags
    color
  }
}

mutation UpdateAnnotation($id: ID!, $input: UpdateAnnotationInput!) {
  updateAnnotation(id: $id, input: $input) {
    id
    title
    description
    severity
  }
}

mutation DeleteAnnotation($id: ID!) {
  deleteAnnotation(id: $id)
}

mutation CreateExportJob($input: CreateExportJobInput!) {
  createExportJob(input: $input) {
    id
    status
    progress
  }
}
```

## 🚀 Deployment

### Build for Production

```bash
cd frontend
npm run build
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
NEXT_PUBLIC_VIDEO_URL=http://localhost:8000
```

## 📈 Performance Optimization

### Recommendations

1. **Lazy load annotations** - Only load visible annotations
2. **Debounce time updates** - Reduce state updates
3. **Memoize calculations** - Use React.memo for expensive components
4. **Virtual scrolling** - For long annotation lists
5. **Canvas timeline** - Better performance than DOM elements

## 🔮 Future Enhancements

### Phase 3: Timeline & Visualization

- Canvas-based timeline with Konva
- Thumbnail preview on hover
- Zoom functionality (10 levels)
- Heatmap visualization

### Phase 4: Multi-Video

- Grid layout (2x2, 2x1)
- Synchronized playback
- Shared timeline
- Independent controls

### Phase 5: Export

- FFmpeg integration
- Clip extraction
- Watermarking
- Progress tracking

### Phase 6: AI Features

- Automatic incident detection
- Face recognition
- Object detection
- Activity classification

---

**Status:** Phase 1 Complete ✅  
**Next:** Install dependencies and test the enhanced player
