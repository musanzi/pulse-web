import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { ITalentProfileApiResponse } from '../interfaces';
import { TalentProfileAdapter } from './talent-profile.adapter';

describe('TalentProfileAdapter', () => {
  it('maps the pulse-api talent profile contract without inventing skills or project evidence', () => {
    const apiProfile: ITalentProfileApiResponse = {
      availability: 20,
      avatarUrl: 'alex.png',
      bio: 'Evidence-driven analyst.',
      createdAt: '2026-07-01T00:00:00.000Z',
      educationSummary: 'Data analytics certificate',
      firstName: 'Alex',
      id: 'profile-123',
      isComplete: true,
      lastName: 'Morgan',
      location: 'Chicago, IL',
      phone: null,
      portfolio: 'https://example.com',
      skills: [
        {
          createdAt: '2026-07-01T00:00:00.000Z',
          id: 'skill-python',
          name: 'Python',
          profileId: 'profile-123',
          updatedAt: '2026-07-01T00:00:00.000Z'
        }
      ],
      updatedAt: '2026-07-17T00:00:00.000Z',
      userId: 'user-123',
      yearsExperience: 2
    };

    const profile = new TalentProfileAdapter().fromApi(apiProfile);

    expect(profile.userId).toBe(apiProfile.userId);
    expect(profile.displayName).toBe('Alex Morgan');
    expect(profile.source).toBe('api');
    expect(profile.skills).toEqual([{ category: 'profile', id: 'skill-python', name: 'Python' }]);
    expect(profile.projects).toEqual([]);
  });
});
