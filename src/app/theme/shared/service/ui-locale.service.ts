import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { MantisConfig } from 'src/app/app-config';
import { ThemeService } from './customs-theme.service';

export const UI_LANGUAGES = [
  { code: 'gr', nativeName: 'Ελληνικά', label: 'Greek' },
  { code: 'en', nativeName: 'English', label: 'English' },
  { code: 'fr', nativeName: 'Français', label: 'French' },
  { code: 'cn', nativeName: '中文', label: 'Chinese' },
  { code: 'de', nativeName: 'Deutsch', label: 'German' },
  { code: 'es', nativeName: 'Español', label: 'Spanish' },
  { code: 'he', nativeName: 'עברית', label: 'Hebrew' }
] as const;

export type UiLanguage = (typeof UI_LANGUAGES)[number]['code'];
export const UI_LOCALES: Record<UiLanguage, string> = {
  gr: 'el-GR',
  en: 'en-US',
  fr: 'fr-FR',
  cn: 'zh-CN',
  de: 'de-DE',
  es: 'es-ES',
  he: 'he-IL'
};

export function savedUiLanguage(): UiLanguage {
  const saved = localStorage.getItem('oikio.language');
  return UI_LANGUAGES.some((language) => language.code === saved) ? (saved as UiLanguage) : 'gr';
}

@Injectable({ providedIn: 'root' })
export class UiLocaleService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly theme = inject(ThemeService);

  readonly languages = UI_LANGUAGES;
  currentLanguage = savedUiLanguage();
  switching = false;

  get locale(): string {
    return UI_LOCALES[this.currentLanguage];
  }

  async initialize(): Promise<void> {
    this.translate.addLangs(UI_LANGUAGES.map((language) => language.code));
    this.translate.setDefaultLang('gr');
    try {
      await firstValueFrom(this.translate.use(this.currentLanguage));
    } catch {
      this.currentLanguage = 'gr';
      localStorage.setItem('oikio.language', 'gr');
      await firstValueFrom(this.translate.use('gr'));
    }
    this.applyDirection();
  }

  text(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  async setLanguage(language: string): Promise<void> {
    if (this.switching || language === this.currentLanguage || !UI_LANGUAGES.some((item) => item.code === language)) return;
    this.switching = true;
    try {
      await firstValueFrom(this.translate.use(language));
      localStorage.setItem('oikio.language', language);
      // Reload after loading the catalog so charts, calendar labels and date/number
      // pipes all start with the same locale.
      window.location.reload();
    } catch {
      await firstValueFrom(this.translate.use(this.currentLanguage));
      this.switching = false;
    }
  }

  private applyDirection(): void {
    const rtl = this.currentLanguage === 'he';
    this.document.documentElement.lang =
      this.currentLanguage === 'gr' ? 'el' : this.currentLanguage === 'cn' ? 'zh-CN' : this.currentLanguage;
    this.document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    this.document.body.classList.toggle('mantis-rtl', rtl);
    this.document.body.classList.toggle('mantis-ltr', !rtl);
    this.theme.isRTLMode.set(rtl);
    MantisConfig.isRtlLayout = rtl;
    MantisConfig.i18n = this.currentLanguage;
  }
}
