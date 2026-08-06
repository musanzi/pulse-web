import '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { createEnvironmentInjector } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { TalentProfileDirectoryService } from './talent-profile-directory.service';

describe('TalentProfileDirectoryService', () => {
  it('maps the signed-in profile and rejects unsupported arbitrary profile lookup', async () => {
    const http = {
      get: vi.fn(() =>
        of({
          availability: 24,
          bio: 'Evidence-driven analyst.',
          educationSummary: 'Data analytics certificate',
          firstName: 'Alex',
          id: 'profile-123',
          lastName: 'Morgan',
          location: 'Chicago, IL',
          skills: [{ id: 'skill-python', name: 'Python', profileId: 'profile-123' }],
          userId: 'user-123'
        })
      )
    };
    const injector = createEnvironmentInjector([
      { provide: HttpClient, useValue: http },
      TalentProfileDirectoryService
    ]);
    const service = injector.get(TalentProfileDirectoryService);

    const profile = await firstValueFrom(service.findById('profile-123'));

    expect(http.get).toHaveBeenCalledWith('/talent-profile/me');
    expect(profile.source).toBe('api');
    expect(profile.skills).toEqual([{ id: 'skill-python', name: 'Python' }]);
    expect(profile.projects).toEqual([]);
    await expect(firstValueFrom(service.findById('profile-456'))).rejects.toThrow(
      'The API does not expose talent profiles by id.'
    );

    injector.destroy();
  });
});
