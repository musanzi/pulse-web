import '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsStore } from './admin-analytics.store';

describe('AdminAnalyticsStore', () => {
  it('maps the stats API without filling unsupported analytics with mock data', () => {
    const http = {
      get: vi.fn(() =>
        of([
          { label: 'Utilisateurs', total: 1284 },
          { label: 'Roles', total: 4 }
        ])
      )
    };
    const injector = createEnvironmentInjector([
      { provide: HttpClient, useValue: http },
      AdminAnalyticsService
    ]);
    const store = runInInjectionContext(injector, () => new AdminAnalyticsStore());

    store.loadAnalytics({ range: '30d' });

    expect(http.get).toHaveBeenCalledWith('/stats');
    expect(store.loading()).toBe(false);
    expect(store.data()?.source).toBe('api');
    expect(store.data()?.metrics.map((metric) => metric.value)).toEqual([1284, 4]);
    expect(store.data()?.programs).toEqual([]);
    expect(store.data()?.usage).toEqual([]);
    expect(store.data()?.reports).toEqual([]);

    store.setRange('7d');

    expect(http.get).toHaveBeenCalledTimes(2);
    expect(store.range()).toBe('7d');
    expect(store.data()?.range).toBe('7d');

    injector.destroy();
  });
});
