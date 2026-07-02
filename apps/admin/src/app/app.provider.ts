import { isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { AuthStore } from './auth/data-access';

const LANGUAGE_STORAGE_KEY = 'admin.language';
const SUPPORTED_LANGUAGES = ['fr', 'en'];

export const provideApp = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      const transloco = inject(TranslocoService);

      if (!isPlatformBrowser(platformId)) {
        transloco.setActiveLang('fr');
        return;
      }

      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const browserLanguage = navigator.language.split('-')[0];
      const language = [storedLanguage, browserLanguage].find(
        (value): value is string => value !== null && SUPPORTED_LANGUAGES.includes(value)
      );

      transloco.setActiveLang(language ?? 'fr');
      localStorage.setItem(LANGUAGE_STORAGE_KEY, transloco.getActiveLang());
      transloco.langChanges$.subscribe((activeLanguage) => {
        document.documentElement.lang = activeLanguage;
        localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage);
      });

      inject(AuthStore).getProfile();
    })
  ]);
