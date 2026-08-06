import { Service } from '@angular/core';
import { ITalentProfile, ITalentProfileApiResponse } from '../interfaces';

@Service()
export class TalentProfileAdapter {
  fromApi(profile: ITalentProfileApiResponse): ITalentProfile {
    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

    return {
      avatar: profile.avatarUrl,
      availability: profile.availability,
      createdAt: profile.createdAt,
      displayName: displayName || profile.userId,
      educationSummary: profile.educationSummary,
      firstName: profile.firstName,
      headline: profile.educationSummary,
      id: profile.id,
      isComplete: profile.isComplete,
      lastName: profile.lastName,
      location: profile.location,
      phone: profile.phone,
      portfolio: profile.portfolio,
      projects: [],
      skills: profile.skills.map((skill) => ({
        category: 'profile',
        id: skill.id,
        name: skill.name
      })),
      source: 'api',
      summary: profile.bio,
      updatedAt: profile.updatedAt,
      userId: profile.userId,
      yearsExperience: profile.yearsExperience
    };
  }
}
