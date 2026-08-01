import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IBetaFeedbackRecord, IBetaFeedbackSubmission } from '@libs/utils';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Service()
export class BetaFeedbackService {
  private readonly http = new HttpClient(inject(HttpBackend));

  submitFeedback(payload: IBetaFeedbackSubmission): Observable<IBetaFeedbackRecord> {
    return this.http.post<IBetaFeedbackRecord>(`${environment.feedbackApiUrl}/feedback`, payload);
  }
}
