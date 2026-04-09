'use client';

import Link from 'next/link';
import { ThemeToggle } from './ui/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-foreground hover:text-accent transition-colors duration-150"
          >
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">
              Roaster
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-150 rounded-md hover:bg-background-subtle"
          >
            Home
          </Link>
          <Link
            href="#how-it-works"
            className="px-3 py-1.5 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-150 rounded-md hover:bg-background-subtle"
          >
            How it works
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
