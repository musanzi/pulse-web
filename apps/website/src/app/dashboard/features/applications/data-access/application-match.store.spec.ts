import '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { ApplicationMatchService } from './application-match.service';
import { ApplicationMatchStore } from './application-match.store';
import { TalentProfileAdapter } from './talent-profile.adapter';
import { TalentProfileService } from './talent-profile.service';

describe('ApplicationMatchStore', () => {
  it('maps pulse-api profile and OpenRouter recommendation contracts into the match dashboard', () => {
    const http = {
      get: vi.fn((url: string) =>
        of(
          url === '/talent-profile/me'
            ? {
                availability: 20,
                avatarUrl: null,
                bio: 'Builds evidence-driven data products.',
                createdAt: '2026-07-01T00:00:00.000Z',
                educationSummary: 'Data analytics certificate',
                firstName: 'Alex',
                id: 'profile-123',
                isComplete: true,
                lastName: 'Morgan',
                location: 'Chicago, IL',
                phone: null,
                portfolio: null,
                skills: [
                  {
                    createdAt: '2026-07-01T00:00:00.000Z',
                    id: 'skill-python',
                    name: 'Python',
                    profileId: 'profile-123',
                    updatedAt: '2026-07-01T00:00:00.000Z'
                  },
                  {
                    createdAt: '2026-07-01T00:00:00.000Z',
                    id: 'skill-sql',
                    name: 'SQL',
                    profileId: 'profile-123',
                    updatedAt: '2026-07-01T00:00:00.000Z'
                  }
                ],
                updatedAt: '2026-07-17T00:00:00.000Z',
                userId: 'user-123',
                yearsExperience: 2
              }
            : [
                {
                  createdAt: '2026-07-17T00:00:00.000Z',
                  id: 'recommendation-123',
                  modelVersion: 'openai/gpt-4.1-mini',
                  questId: 'quest-123',
                  reason: 'Python evidence is strong; SQL is the next focused growth area.',
                  score: 0.88,
                  skillGaps: [{ current: 2, required: 4, skill: 'SQL' }],
                  status: 'SUGGESTED',
                  targetRoleId: null,
                  type: 'QUEST',
                  updatedAt: '2026-07-17T00:00:00.000Z',
                  userId: 'user-123'
                }
              ]
        )
      ),
      post: vi.fn()
    };
    const injector = createEnvironmentInjector([
      { provide: HttpClient, useValue: http },
      ApplicationMatchService,
      TalentProfileAdapter,
      TalentProfileService
    ]);
    const store = runInInjectionContext(injector, () => new ApplicationMatchStore());

    store.loadMatchResult({ applicationId: 'application-123', roleId: 'quest-123' });

    expect(http.get).toHaveBeenNthCalledWith(1, '/talent-profile/me');
    expect(http.get).toHaveBeenNthCalledWith(2, '/matching/me/recommendations');
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.talentProfile()?.source).toBe('api');
    expect(store.matchResult()?.compatibilityScore).toBe(88);
    expect(store.matchResult()?.ai.source).toBe('api');
    expect(store.matchResult()?.matchedSkills.map((skill) => skill.name)).toEqual(['Python']);
    expect(store.matchResult()?.missingSkills.map((skill) => skill.name)).toEqual(['SQL']);

    injector.destroy();
  });
});
