import { HttpBackend, HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID, Service } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

export const APP_URL = new InjectionToken<string>('APP_URL', {
  providedIn: 'root',
  factory: () => ''
});

@Service()
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly appUrl = inject(APP_URL);
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly platformId = inject(PLATFORM_ID);

  getTranslation(lang: string) {
    const assetPath = `/i18n/${lang}.json`;
    const assetUrl =
      isPlatformServer(this.platformId) && this.appUrl ? new URL(assetPath, this.appUrl).toString() : assetPath;

    return this.http.get<Translation>(assetUrl);
  }
}
