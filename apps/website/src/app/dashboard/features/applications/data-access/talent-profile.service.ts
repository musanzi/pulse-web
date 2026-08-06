import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ITalentProfileApiResponse } from '../interfaces';

@Service()
export class TalentProfileService {
  private readonly http = inject(HttpClient);

  loadMyProfile(): Observable<ITalentProfileApiResponse> {
    return this.http.get<ITalentProfileApiResponse>('/talent-profile/me');
  }
}
