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
    <main className="flex-1 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-glow)_0%,_transparent_50%)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(var(--border) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.5,
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shadow-lg glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <span className="text-sm font-mono text-foreground-subtle">
                v1.0
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Spotify <span className="text-gradient">Roaster</span>
            </h1>
            <p className="text-foreground-muted max-w-md">
              Brutally analyze your music taste. No mercy. No apologies.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex gap-3 animate-slide-up">
            {[
              { label: 'Playlists', value: '∞' },
              { label: 'Roasts', value: '999+' },
              { label: 'Burnt', value: '100%' },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-lg border border-border bg-background-elevated/50 backdrop-blur"
              >
                <p className="text-lg font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-foreground-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated" padding="lg" className="animate-slide-up">
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-mono text-foreground-muted">
                    INPUT_URL
                  </span>
                </div>
                <div className="space-y-4">
                  <Input
                    placeholder="https://open.spotify.com/playlist/..."
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRoast()}
                    className="font-mono text-sm input-ring bg-background/50"
                  />
                  {error && (
                    <p className="text-sm text-error flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </p>
                  )}
                  <Button
                    onClick={handleRoast}
                    disabled={isLoading}
                    className="w-full h-11"
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="font-mono">ANALYZING...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        <span className="font-mono">EXECUTE_ROAST</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How it works - Compact */}
            <div className="animate-slide-up stagger-2">
              <h3 className="text-sm font-mono text-foreground-muted mb-3">
                {/* */} PROCESS
              </h3>
              <div className="space-y-2">
                {[
                  {
                    step: '01',
                    title: 'Paste URL',
                    desc: 'Spotify link input',
                  },
                  { step: '02', title: 'Analyze', desc: 'AI scans tracks' },
                  { step: '03', title: 'Roast', desc: 'Get destroyed' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background-elevated/30"
                  >
                    <span className="text-xs font-mono text-accent">
                      {item.step}
                    </span>
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-foreground-subtle ml-auto">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3">
            {result ? (
              <div className="space-y-6 animate-scale-in">
                {/* Roast Output */}
                <Card
                  variant="elevated"
                  padding="lg"
                  className="glow relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <CardContent className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-accent"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">
                            {result.name}
                          </h2>
                          <p className="text-xs text-foreground-muted">
                            by {result.creator}
                          </p>
                        </div>
                      </div>
                      <Badge variant="accent" className="font-mono text-xs">
                        OUTPUT
                      </Badge>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-transparent rounded-full" />
                      <div className="pl-5 space-y-3">
                        <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
                          {result.roast}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {
                      label: 'TRACKS',
                      value: result.tracks.length,
                      sub: 'total',
                    },
                    {
                      label: 'POPULARITY',
                      value: Math.round(result.avgPopularity),
                      sub: 'avg',
                    },
                    {
                      label: 'VIBE',
                      value: getPopularityLabel(result.avgPopularity).label,
                      isBadge: true,
                      variant: getPopularityLabel(result.avgPopularity).variant,
                    },
                    {
                      label: 'EXPLICIT',
                      value: result.explicitCount,
                      sub: 'tracks',
                    },
                  ].map((stat, i) => (
                    <Card
                      key={i}
                      variant="bordered"
                      padding="sm"
                      className="card-hover"
                    >
                      <CardContent className="text-center p-3">
                        {'isBadge' in stat ? (
                          <Badge variant={stat.variant} className="text-[10px]">
                            {stat.value}
                          </Badge>
                        ) : (
                          <p className="text-xl font-bold text-foreground font-mono">
                            {stat.value}
                          </p>
                        )}
                        <p className="text-[10px] text-foreground-muted mt-1 font-mono">
                          {'sub' in stat ? stat.sub : stat.label}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Track List */}
                <Card variant="bordered" padding="md">
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-mono text-foreground-muted">
                        TRACKS_ANALYZED
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono"
                      >
                        {result.tracks.length} items
                      </Badge>
                    </div>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                      {result.tracks.slice(0, 10).map((track, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded hover:bg-background-subtle transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-mono text-foreground-subtle w-4">
                              {i + 1}
                            </span>
                            <span className="text-sm truncate group-hover:text-accent transition-colors">
                              {track.name}
                            </span>
                            {track.explicit && (
                              <Badge
                                variant="error"
                                className="text-[8px] px-1"
                              >
                                E
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground-muted hidden sm:inline">
                              {track.artist}
                            </span>
                            <div className="w-8 h-1 rounded-full bg-background-muted overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full"
                                style={{ width: `${track.popularity}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Empty State */
              <div className="h-full flex items-center justify-center min-h-[400px] animate-fade-in">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-background-elevated border border-border flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-foreground-subtle"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Roast</h3>
                  <p className="text-sm text-foreground-muted max-w-xs mx-auto">
                    Enter a Spotify playlist or album URL above and hit execute
                    to receive your personalized roast.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-foreground-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              SYSTEM_ONLINE
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-foreground-muted hover:text-foreground transition-colors font-mono"
              >
                PRIVACY
              </a>
              <a
                href="#"
                className="text-xs text-foreground-muted hover:text-foreground transition-colors font-mono"
              >
                TERMS
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
