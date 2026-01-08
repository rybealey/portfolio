'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Home, FolderOpen, FileText, Heart } from 'lucide-react';

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark || systemPrefersDark ? 'dark' : 'light');
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

  const isDark = theme === 'dark';

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-muted focus-visible-ring transition-colors shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
        style={{
          top: 'max(1rem, env(safe-area-inset-top))',
          right: 'max(1rem, env(safe-area-inset-right))',
        }}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="navigation-menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <nav
        id="navigation-menu"
        className={`fixed z-50 flex flex-col md:flex-row gap-3 min-w-[140px] transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
        style={{
          top: `calc(max(1rem, env(safe-area-inset-top)) + 3.5rem)`,
          right: 'max(1rem, env(safe-area-inset-right))',
        }}
        aria-label="Main navigation"
      >
        {/* Home */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className={`px-5 py-2.5 rounded-full bg-background/95 backdrop-blur-sm border border-border hover:bg-accent hover:border-accent-foreground/20 focus-visible-ring transition-all shadow-md text-sm font-medium flex items-center gap-3 min-h-[44px] touch-manipulation ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
          }`}
          style={{ transitionDelay: isOpen ? '75ms' : '0ms' }}
        >
          <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>Home</span>
        </Link>

            {/* Case Studies */}
            <Link
              href="/case-studies"
              onClick={() => setIsOpen(false)}
              className={`px-5 py-2.5 rounded-full bg-background/95 backdrop-blur-sm border border-border hover:bg-accent hover:border-accent-foreground/20 focus-visible-ring transition-all shadow-md text-sm font-medium flex items-center gap-3 min-h-[44px] touch-manipulation ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
            >
              <FolderOpen className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Case Studies</span>
            </Link>

            {/* Passions */}
            <Link
              href="/passions"
              onClick={() => setIsOpen(false)}
              className={`px-5 py-2.5 rounded-full bg-background/95 backdrop-blur-sm border border-border hover:bg-accent hover:border-accent-foreground/20 focus-visible-ring transition-all shadow-md text-sm font-medium flex items-center gap-3 min-h-[44px] touch-manipulation ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '125ms' : '0ms' }}
            >
              <Heart className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Passions</span>
            </Link>

            {/* Résumé */}
            <Link
              href="/resume"
              onClick={() => setIsOpen(false)}
              className={`px-5 py-2.5 rounded-full bg-background/95 backdrop-blur-sm border border-border hover:bg-accent hover:border-accent-foreground/20 focus-visible-ring transition-all shadow-md text-sm font-medium flex items-center gap-3 min-h-[44px] touch-manipulation ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '150ms' : '0ms' }}
            >
              <FileText className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Résumé</span>
            </Link>

      </nav>

      {/* Theme Toggle - Bottom Right */}
      {mounted && isOpen && (
        <button
          onClick={toggleTheme}
          className="fixed z-50 p-2 rounded-md hover:bg-muted/50 focus-visible-ring transition-all opacity-60 hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          style={{
            bottom: 'max(1rem, env(safe-area-inset-bottom))',
            right: 'max(1rem, env(safe-area-inset-right))',
          }}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}

