import '@angular/compiler';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsStore } from './admin-analytics.store';

describe('AdminAnalyticsStore', () => {
  it('loads a mock analytics snapshot and reacts to range changes', async () => {
    vi.useFakeTimers();
    const injector = createEnvironmentInjector([AdminAnalyticsService]);
    const store = runInInjectionContext(injector, () => new AdminAnalyticsStore());

    store.loadAnalytics({ range: '30d' });
    await vi.advanceTimersByTimeAsync(300);

    expect(store.loading()).toBe(false);
    expect(store.data()?.source).toBe('mock');
    expect(store.data()?.metrics).toHaveLength(4);
    expect(store.data()?.programs[0]?.talentProfileRoute).toContain('/dashboard/talent/');

    const monthlyActiveTalents = store.data()?.metrics[0]?.value ?? 0;
    store.setRange('7d');
    await vi.advanceTimersByTimeAsync(300);

    expect(store.range()).toBe('7d');
    expect(store.data()?.range).toBe('7d');
    expect(store.data()?.metrics[0]?.value).toBeLessThan(monthlyActiveTalents);

    injector.destroy();
    vi.useRealTimers();
  });
});
