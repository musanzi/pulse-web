import { HttpBackend, HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID, REQUEST, Service } from '@angular/core';
import { BetaFeedbackStatus, IBetaFeedbackCollection, IBetaFeedbackRecord, IBetaFeedbackUpdate } from '@libs/utils';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Service()
export class BetaFeedbackLogService {
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly platformId = inject(PLATFORM_ID);
  private readonly request = inject(REQUEST, { optional: true });

  loadFeedback(): Observable<IBetaFeedbackRecord[]> {
    return this.http
      .get<IBetaFeedbackCollection>(`${this.apiUrl}/feedback`)
      .pipe(map((collection) => collection.items));
  }

  updateStatus(id: string, status: BetaFeedbackStatus): Observable<IBetaFeedbackRecord> {
    const payload: IBetaFeedbackUpdate = { status };
    return this.http.patch<IBetaFeedbackRecord>(`${this.apiUrl}/feedback/${id}`, payload);
  }

  private get apiUrl(): string {
    if (!isPlatformServer(this.platformId) || environment.feedbackApiUrl.startsWith('http')) {
      return environment.feedbackApiUrl;
    }

    const origin = this.request ? new URL(this.request.url).origin : environment.appUrl;
    return new URL(environment.feedbackApiUrl, origin).toString().replace(/\/$/, '');
  }
}
