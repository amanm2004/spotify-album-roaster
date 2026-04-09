# Codebase

## Overview

Spotify Album Roaster is a web application that takes a Spotify playlist/album URL and generates a brutally honest AI roast of the user's music taste.

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   API Route  │────▶│  Roast Engine  │
│   (Next.js)     │     │  /api/roast  │     │ (Python/AI)     │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Build**: Turbopack, Docker multi-stage build
- **Code Quality**: ESLint, Prettier

## Design System

### Color Palette

| Token          | Dark Mode | Light Mode | Usage              |
| -------------- | --------- | ---------- | ------------------ |
| `--background` | `#050505` | `#ffffff`  | Page background    |
| `--foreground` | `#fafafa` | `#09090b`  | Primary text       |
| `--accent`     | `#6366f1` | `#4f46e5`  | Primary actions    |
| `--border`     | `#262626` | `#e4e4e7`  | Dividers, outlines |

### Typography

- **Font**: Geist Sans (body), Geist Mono (code)
- **Scale**: 8px grid, sizes from 11px to 48px

### Components

All UI components follow shadcn/ui philosophy:

- Composable and reusable
- Props-based variants (not CSS classes)
- Forward refs for flexibility

Located in `src/components/ui/`:

- `Button` - 5 variants (primary, secondary, ghost, outline, danger)
- `Input` - With labels, icons, validation
- `Card` - 4 variants (default, elevated, bordered, ghost)
- `Badge` - Semantic variants (default, accent, success, error, etc.)

## File Structure

```
src/
├── app/
│   ├── api/roast/route.ts   # POST endpoint for roast generation
│   ├── globals.css          # Design tokens & animations
│   ├── layout.tsx           # Root layout with Geist fonts
│   └── page.tsx             # Home page
├── components/
│   ├── header.tsx           # Site header with nav
│   ├── roast-interface.tsx  # Main UI component
│   └── ui/                  # Design system components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
└── components/ui/...
```

## API Contract

### POST /api/roast

**Request**:

```json
{ "url": "https://open.spotify.com/playlist/..." }
```

**Response**:

```json
{
  "name": "Playlist Name",
  "creator": "username",
  "tracks": [
    { "name": "...", "artist": "...", "popularity": 85, "explicit": true }
  ],
  "roast": "Brutally honest critique...",
  "avgPopularity": 72,
  "explicitCount": 5
}
```

## Animations

CSS animations defined in `globals.css`:

- `fadeIn` - Page load fade
- `slideUp` - Content entry
- `scaleIn` - Modal/card appearance

Transition duration: 150ms for micro-interactions, 300-400ms for larger reveals.

## Docker

Multi-stage build optimized for production:

1. **deps** - Install node_modules
2. **builder** - Run next build with standalone output
3. **runner** - Minimal runtime image (~150MB)

Build: `docker build -t roaster .`
Run: `docker run -p 3000:3000 roaster`

## Environment

- Node 22 (alpine base)
- No external environment variables required for frontend
- Python backend integration prepared in `roast_generator.py`
