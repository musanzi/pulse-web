import '@angular/compiler';
import { IUser } from '@libs/utils';
import { describe, expect, it } from 'vitest';
import { TalentProfileAdapter } from './talent-profile.adapter';

describe('TalentProfileAdapter', () => {
  it('preserves official user identity while creating the mock talent profile snapshot', () => {
    const user: IUser = {
      avatar: 'alex.png',
      email: 'alex@example.com',
      id: 'user-123',
      name: 'Alex Morgan',
      password: '',
      roles: ['talent']
    };

    const profile = new TalentProfileAdapter().fromUser(user);

    expect(profile.userId).toBe(user.id);
    expect(profile.displayName).toBe(user.name);
    expect(profile.avatar).toBe(user.avatar);
    expect(profile.source).toBe('mock');
    expect(profile.skills.map((skill) => skill.id)).toEqual(['python', 'data-analysis', 'sql']);
  });
});
