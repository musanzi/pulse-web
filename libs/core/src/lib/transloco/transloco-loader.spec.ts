import '@angular/compiler';
import { HttpBackend, HttpRequest, HttpResponse } from '@angular/common/http';
import { createEnvironmentInjector, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { APP_URL, TranslocoHttpLoader } from './transloco-loader';

describe('TranslocoHttpLoader', () => {
  it('prefixes translation assets with APP_URL during SSR', async () => {
    const backend = createBackend();
    const injector = createLoaderInjector('server', backend);
    const loader = runInInjectionContext(injector, () => injector.get(TranslocoHttpLoader));

    await firstValueFrom(loader.getTranslation('fr'));

    expect(backend.handle).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://pulse.example/i18n/fr.json' }));
    injector.destroy();
  });

  it('keeps translation asset URLs relative in the browser', async () => {
    const backend = createBackend();
    const injector = createLoaderInjector('browser', backend);
    const loader = runInInjectionContext(injector, () => injector.get(TranslocoHttpLoader));

    await firstValueFrom(loader.getTranslation('en'));

    expect(backend.handle).toHaveBeenCalledWith(expect.objectContaining({ url: '/i18n/en.json' }));
    injector.destroy();
  });
});

function createBackend() {
  return {
    handle: vi.fn((_request: HttpRequest<unknown>) => of(new HttpResponse({ body: {} })))
  };
}

function createLoaderInjector(platformId: string, backend: ReturnType<typeof createBackend>) {
  return createEnvironmentInjector([
    TranslocoHttpLoader,
    { provide: APP_URL, useValue: 'https://pulse.example' },
    { provide: PLATFORM_ID, useValue: platformId },
    { provide: HttpBackend, useValue: backend }
  ]);
}
