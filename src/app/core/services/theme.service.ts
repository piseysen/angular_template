import { Injectable, signal, effect } from '@angular/core';

export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'selectedTheme';
  
  readonly availableThemes: Theme[] = [
    { 
      id: 'light', 
      name: 'Light', 
      icon: 'light_mode', 
      description: 'Clean and bright interface' 
    },
    { 
      id: 'dark', 
      name: 'Dark', 
      icon: 'dark_mode', 
      description: 'Easy on the eyes in low light' 
    },
    { 
      id: 'auto', 
      name: 'System', 
      icon: 'brightness_auto', 
      description: 'Follows your system preference' 
    }
  ];

  readonly currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });

    // Listen for system theme changes when auto is selected
    this.setupSystemThemeListener();
  }

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const theme = this.availableThemes.find(t => t.id === saved);
      if (theme) return theme;
    }
    
    // Default to system preference
    return this.availableThemes.find(t => t.id === 'auto') || this.availableThemes[0];
  }

  changeTheme(themeId: string): void {
    const theme = this.availableThemes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
      localStorage.setItem(this.storageKey, themeId);
    }
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    const html = document.documentElement;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    html.classList.remove('light-theme', 'dark-theme');
    
    let actualTheme: string;
    
    if (theme.id === 'auto') {
      // Use system preference
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      actualTheme = theme.id;
    }
    
    // Apply theme classes
    body.classList.add(`${actualTheme}-theme`);
    html.classList.add(`${actualTheme}-theme`);
    
    // Update color-scheme
    body.style.colorScheme = actualTheme;
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme().id === 'auto') {
        this.applyTheme(this.currentTheme());
      }
    });
  }
}