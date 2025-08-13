import { Injectable, signal } from '@angular/core';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'selectedLanguage';
  
  readonly availableLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'km', name: 'Khmer', flag: '🇰🇭' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  readonly currentLanguage = signal<Language>(this.getInitialLanguage());

  private getInitialLanguage(): Language {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const language = this.availableLanguages.find(lang => lang.code === saved);
      if (language) return language;
    }
    
    // Default to English or browser language if available
    const browserLang = navigator.language.split('-')[0];
    return this.availableLanguages.find(lang => lang.code === browserLang) || this.availableLanguages[0];
  }

  changeLanguage(languageCode: string): void {
    const language = this.availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      this.currentLanguage.set(language);
      localStorage.setItem(this.storageKey, languageCode);
      
      // In a real app, you would integrate with Angular i18n or ngx-translate here
      console.log(`Language changed to: ${language.name}`);
    }
  }
}