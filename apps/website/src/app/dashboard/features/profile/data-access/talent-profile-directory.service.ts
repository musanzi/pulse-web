import { Service } from '@angular/core';
import { map, Observable, timer } from 'rxjs';
import { ITalentProfileDirectoryEntry } from '../interfaces';

const PROFILES: Record<string, ITalentProfileDirectoryEntry> = {
  'talent-123': {
    availability: 'profile.directory.availability.open',
    displayName: 'Alex Morgan',
    headline: 'Data analyst building evidence-driven products',
    id: 'talent-123',
    location: 'Chicago, IL',
    projects: [
      {
        id: 'project-data-quality',
        summary: 'Cleaned and analyzed an open dataset, then presented measurable quality improvements.',
        title: 'Data Quality Explorer'
      }
    ],
    skills: [
      { id: 'python', level: 4, name: 'Python', verified: true },
      { id: 'data-analysis', level: 5, name: 'Data Analysis', verified: true },
      { id: 'sql', level: 3, name: 'SQL', verified: false }
    ],
    source: 'mock',
    summary: 'Combines technical analysis, project evidence, and clear stakeholder communication.'
  },
  'talent-456': {
    availability: 'profile.directory.availability.limited',
    displayName: 'Noah Williams',
    headline: 'Community researcher and service designer',
    id: 'talent-456',
    location: 'Toronto, ON',
    projects: [
      {
        id: 'project-civic-signals',
        summary: 'Mapped resident feedback into prioritized service improvements.',
        title: 'Civic Signals Sprint'
      }
    ],
    skills: [
      { id: 'research', level: 4, name: 'User Research', verified: true },
      { id: 'facilitation', level: 3, name: 'Facilitation', verified: true }
    ],
    source: 'mock',
    summary: 'Turns qualitative research into focused, testable program decisions.'
  },
  'talent-789': {
    availability: 'profile.directory.availability.open',
    displayName: 'Camille Dubois',
    headline: 'Accessibility-focused frontend developer',
    id: 'talent-789',
    location: 'Montreal, QC',
    projects: [
      {
        id: 'project-accessibility',
        summary: 'Delivered a keyboard-first workflow and documented WCAG improvements.',
        title: 'Accessibility Quest'
      }
    ],
    skills: [
      { id: 'angular', level: 4, name: 'Angular', verified: true },
      { id: 'accessibility', level: 5, name: 'Accessibility', verified: true }
    ],
    source: 'mock',
    summary: 'Builds inclusive interfaces with strong technical and interaction-design evidence.'
  }
};

@Service()
export class TalentProfileDirectoryService {
  findById(talentProfileId: string): Observable<ITalentProfileDirectoryEntry> {
    return timer(180).pipe(
      map(() => ({ ...(PROFILES[talentProfileId] ?? PROFILES['talent-123']), id: talentProfileId }))
    );
  }
}
