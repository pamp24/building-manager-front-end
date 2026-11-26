import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  customsTheme = signal<string>('');
  isDarkMode = signal<boolean>(false);
  isRTLMode = signal<boolean>(false);
  isContainerMode = signal<boolean>(false);

  setDarkMode(isDark: boolean, applyToPage = true): void {
    const mode = isDark ? 'dark' : 'light';
    localStorage.setItem('theme-mode', mode);
    sessionStorage.setItem('theme-mode', mode);

    const active = isDark && applyToPage;
    this.document.body.classList.toggle('mantis-dark', active);
    this.document.documentElement.classList.toggle('dark', active);
    this.isDarkMode.set(active);
  }
}
