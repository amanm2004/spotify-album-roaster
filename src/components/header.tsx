'use client';

import { ThemeToggle } from './ui/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/40 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-foreground-subtle">
            SPOTIFY_ROASTER
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
