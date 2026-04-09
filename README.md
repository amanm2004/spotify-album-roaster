# Spotify Album Roaster

Brutally honest AI-powered roast of your Spotify playlists and albums.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Python (FastAPI), Google Gemini AI
- **Styling**: Custom design system with Geist fonts

## Quick Start

### Frontend (Next.js)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend (Python)

```bash
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
python main.py
```

## Environment Variables

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
GEMINI_API_KEY=your_gemini_key
```

## Commands

| Command                   | Description      |
| ------------------------- | ---------------- |
| `npm run dev`             | Start dev server |
| `npm run build`           | Production build |
| `npm run lint`            | Run ESLint       |
| `npm run format`          | Format code      |
| `python -m pytest tests/` | Run Python tests |

## Docker

```bash
docker build -t roaster .
docker run -p 3000:3000 roaster
```

## Project Structure

```
├── src/              # Next.js frontend
├── core/             # Python backend
├── tests/            # Python tests
├── .github/          # CI workflows
└── Dockerfile        # Production image
```

## License

MIT
