import { Service } from '@angular/core';
import { IUser } from '@libs/utils';
import { ITalentProfile } from '../interfaces';

@Service()
export class TalentProfileAdapter {
  fromUser(user: IUser): ITalentProfile {
    return {
      avatar: user.avatar,
      displayName: user.name,
      headline: 'Data analyst in training',
      id: `talent-${user.id}`,
      projects: [
        {
          id: 'data-quality-explorer',
          skillIds: ['python', 'data-analysis'],
          summary: 'Cleaned, analyzed, and communicated findings from an open dataset.',
          title: 'Data quality explorer'
        }
      ],
      skills: [
        { category: 'programming', id: 'python', level: 4, name: 'Python', verified: true },
        { category: 'analytics', id: 'data-analysis', level: 5, name: 'Data Analysis', verified: true },
        { category: 'data', id: 'sql', level: 3, name: 'SQL', verified: false }
      ],
      source: 'mock',
      summary: 'Builds evidence-driven data products and communicates actionable findings.',
      updatedAt: new Date().toISOString(),
      userId: user.id
    };
  }
}
