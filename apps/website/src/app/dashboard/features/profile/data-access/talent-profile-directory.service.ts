import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ITalentProfileDirectoryApiResponse, ITalentProfileDirectoryEntry } from '../interfaces';

@Service()
export class TalentProfileDirectoryService {
  private readonly http = inject(HttpClient);

  findById(talentProfileId: string): Observable<ITalentProfileDirectoryEntry> {
    return this.http.get<ITalentProfileDirectoryApiResponse>('/talent-profile/me').pipe(
      map((profile) => {
        if (talentProfileId !== profile.id && talentProfileId !== `talent-${profile.userId}`) {
          throw new Error('The API does not expose talent profiles by id.');
        }

        return {
          availability: profile.availability,
          displayName: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.userId,
          headline: profile.educationSummary,
          id: profile.id,
          location: profile.location,
          projects: [],
          skills: profile.skills.map((skill) => ({ id: skill.id, name: skill.name })),
          source: 'api' as const,
          summary: profile.bio
        };
      })
    );
  }
}
