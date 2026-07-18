import '@angular/compiler';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { ApplicationMatchService } from './application-match.service';
import { ApplicationMatchStore } from './application-match.store';

describe('ApplicationMatchStore', () => {
  it('loads a simulated AI match result for an application', async () => {
    vi.useFakeTimers();

    const injector = createEnvironmentInjector([ApplicationMatchService]);
    const store = runInInjectionContext(injector, () => new ApplicationMatchStore());

    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.matchResult()).toBeNull();

    store.loadMatchResult({
      applicationId: 'application-123',
      roleId: 'data-analyst-intern',
      talentProfile: {
        avatar: null,
        displayName: 'Alex Morgan',
        headline: 'Data analyst in training',
        id: 'talent-123',
        projects: [
          {
            id: 'project-1',
            skillIds: ['python', 'data-analysis'],
            summary: 'Cleaned and analyzed an open dataset.',
            title: 'Data quality explorer'
          }
        ],
        skills: [
          { category: 'programming', id: 'python', level: 4, name: 'Python', verified: true },
          { category: 'analytics', id: 'data-analysis', level: 5, name: 'Data Analysis', verified: true },
          { category: 'data', id: 'sql', level: 3, name: 'SQL', verified: false }
        ],
        source: 'mock',
        summary: 'Builds evidence-driven data products.',
        updatedAt: '2026-07-17T00:00:00.000Z',
        userId: 'user-123'
      }
    });

    expect(store.loading()).toBe(true);
    expect(store.error()).toBeNull();

    await vi.advanceTimersByTimeAsync(500);

    const matchResult = store.matchResult();

    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.talentProfile()?.userId).toBe('user-123');
    expect(matchResult?.applicationId).toBe('application-123');
    expect(matchResult?.compatibilityScore).toBe(88);
    expect(matchResult?.ai.provider).toBe('openrouter');
    expect(matchResult?.ai.source).toBe('mock');
    expect(matchResult?.matchedSkills.map((skill) => skill.name)).toEqual(['Python', 'Data Analysis', 'SQL']);
    expect(matchResult?.rationales).toHaveLength(3);

    injector.destroy();
    vi.useRealTimers();
  });
});
