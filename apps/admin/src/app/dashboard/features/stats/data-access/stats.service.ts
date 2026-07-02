import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IStat } from '../interfaces';

@Service()
export class StatsService {
  private readonly http = inject(HttpClient);

  findAll(): Observable<IStat[]> {
    return this.http.get<IStat[]>('/stats');
  }
}
