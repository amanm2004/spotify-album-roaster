'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Spinner } from './ui/spinner';

interface Track {
  name: string;
  artist: string;
  popularity: number;
  explicit: boolean;
}

interface RoastResult {
  name: string;
  creator: string;
  tracks: Track[];
  roast: string;
  avgPopularity: number;
  explicitCount: number;
}

export default function RoastInterface() {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState('');

  const handleRoast = async () => {
    if (!spotifyUrl.trim()) {
      setError('Please enter a Spotify playlist or album URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: spotifyUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roast');
      }

      const data = await response.json();
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPopularityLabel = (score: number) => {
    if (score >= 80) return { label: 'Mainstream', variant: 'accent' as const };
    if (score >= 60) return { label: 'Trending', variant: 'success' as const };
    if (score >= 40) return { label: 'Niche', variant: 'default' as const };
    return { label: 'Obscure', variant: 'secondary' as const };
  };

  return (
    <main className="flex-1">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Roast Your <span className="text-accent">Taste</span>
          </h1>
          <p className="text-lg text-foreground-muted max-w-xl mx-auto">
            Connect your Spotify and get brutally honest feedback on your music
            collection. No feelings allowed.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-xl mx-auto mb-12">
          <Card variant="bordered" padding="lg" className="animate-slide-up">
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-2">
                    Spotify Playlist or Album URL
                  </label>
                  <Input
                    placeholder="https://open.spotify.com/playlist/..."
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRoast()}
                    className="font-mono text-sm"
                  />
                </div>
                {error && <p className="text-sm text-error">{error}</p>}
                <Button
                  onClick={handleRoast}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span>Roasting...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                      </svg>
                      <span>Generate Roast</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-scale-in">
            {/* Roast Card */}
            <Card variant="elevated" padding="lg">
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-accent"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{result.name}</h2>
                    <p className="text-sm text-foreground-muted">
                      by {result.creator}
                    </p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground">
                    {result.roast}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="bordered" padding="md" className="text-center">
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    {result.tracks.length}
                  </p>
                  <p className="text-sm text-foreground-muted mt-1">Tracks</p>
                </CardContent>
              </Card>

              <Card variant="bordered" padding="md" className="text-center">
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(result.avgPopularity)}
                  </p>
                  <p className="text-sm text-foreground-muted mt-1">
                    Avg Popularity
                  </p>
                </CardContent>
              </Card>

              <Card variant="bordered" padding="md" className="text-center">
                <CardContent>
                  <Badge
                    variant={getPopularityLabel(result.avgPopularity).variant}
                  >
                    {getPopularityLabel(result.avgPopularity).label}
                  </Badge>
                  <p className="text-sm text-foreground-muted mt-1">Vibe</p>
                </CardContent>
              </Card>

              <Card variant="bordered" padding="md" className="text-center">
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    {result.explicitCount}
                  </p>
                  <p className="text-sm text-foreground-muted mt-1">Explicit</p>
                </CardContent>
              </Card>
            </div>

            {/* Track List */}
            <Card variant="bordered" padding="lg">
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">Tracks Analyzed</h3>
                <div className="space-y-2">
                  {result.tracks.slice(0, 8).map((track, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded hover:bg-background-subtle transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground-subtle w-6">
                          {index + 1}.
                        </span>
                        <span className="text-foreground">{track.name}</span>
                        {track.explicit && (
                          <Badge variant="error" className="text-[10px] px-1.5">
                            E
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground-muted">
                          {track.artist}
                        </span>
                        <span className="text-xs text-foreground-subtle">
                          {track.popularity}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {result.tracks.length > 8 && (
                  <p className="text-sm text-foreground-subtle mt-4 text-center">
                    + {result.tracks.length - 8} more tracks
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* How It Works Section */}
        <div className="mt-20" id="how-it-works">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="text-foreground-muted mt-2">
              Three steps to devastation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Paste URL',
                description:
                  'Grab any Spotify playlist or album URL. Yes, even that "Chill Vibes" one.',
              },
              {
                step: '02',
                title: 'Analyze',
                description:
                  'Our AI digs through your tracks, artists, and listening patterns.',
              },
              {
                step: '03',
                title: 'Get Roasted',
                description:
                  'Receive a brutally honest critique of your musical choices.',
              },
            ].map((item, index) => (
              <Card
                key={index}
                variant="bordered"
                padding="lg"
                className="group hover:border-border-hover transition-colors duration-200"
              >
                <CardContent>
                  <span className="text-5xl font-bold text-foreground-subtle group-hover:text-accent/30 transition-colors duration-200">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground-subtle">
              Built with spite and AI
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
