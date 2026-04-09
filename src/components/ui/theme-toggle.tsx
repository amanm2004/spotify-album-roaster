'use client';

import { useSyncExternalStore } from 'react';

interface ThemeToggleProps {
  className?: string;
}

function getTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  mediaQuery.addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    mediaQuery.removeEventListener('change', callback);
  };
}

const emptySubscribe = () => () => {};

function getHydrated() {
  return true;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'dark');
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getHydrated,
    () => false
  );

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.location.reload();
  };

  if (!hydrated) return null;

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-10 h-10
        flex items-center justify-center
        rounded-md
        border border-border
        bg-background-elevated
        text-foreground-muted
        hover:bg-background-subtle hover:text-foreground
        hover:border-border-hover
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        ${className}
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
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
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
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
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
