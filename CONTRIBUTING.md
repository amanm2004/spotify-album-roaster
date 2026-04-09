# Contributing

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/spotify-album-roaster.git`
3. Install dependencies: `npm install`

## Development

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

## Code Style

- Use TypeScript for all new code
- Follow existing component patterns in `src/components/ui/`
- Run `npm run format` before committing
- Ensure `npm run lint` passes

## Pull Requests

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and test locally
3. Run lint and format checks
4. Push and open a PR

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API
│   ├── api/       # API routes
│   └── *.tsx      # Page components
└── components/    # React components
    └── ui/        # Reusable UI primitives
```

## Questions

Open an issue for bugs, feature requests, or general questions.
