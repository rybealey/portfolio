'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Sync with the script that runs on page load
    // Check if dark class is already present (set by the script)
    const isDark = document.documentElement.classList.contains('dark');
    
    // Also check localStorage to be sure
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Use system preference or current DOM state
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = isDark || systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const currentIsDark = document.documentElement.classList.contains('dark');
    const newTheme = currentIsDark ? 'light' : 'dark';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-md hover:bg-muted focus-visible-ring transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-md hover:bg-muted focus-visible-ring transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

