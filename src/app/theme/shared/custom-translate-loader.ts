import { TranslateLoader } from '@ngx-translate/core';
import { from, map } from 'rxjs';

export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(language: string) {
    // Separate chunks keep the six unused dictionaries out of the initial bundle.
    const dictionary = (() => {
      switch (language) {
        case 'en':
          return import('../../../assets/i18n/en.json');
        case 'fr':
          return import('../../../assets/i18n/fr.json');
        case 'cn':
          return import('../../../assets/i18n/cn.json');
        case 'de':
          return import('../../../assets/i18n/de.json');
        case 'es':
          return import('../../../assets/i18n/es.json');
        case 'he':
          return import('../../../assets/i18n/he.json');
        default:
          return import('../../../assets/i18n/gr.json');
      }
    })();
    return from(dictionary).pipe(map((module) => module.default));
  }
}
