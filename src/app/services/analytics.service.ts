import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { AnalyticsResponseI } from '@interfaces/response/analytics-response';
import { map } from 'rxjs';
import { ENV } from '../env';
import { httpHeaders } from './http-headers';

interface AnalyticsState {
  analytics: AnalyticsResponseI | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private httpClient = inject(HttpClient);

  #state = signal<AnalyticsState>({
    analytics: null,
    loading: true,
  });

  get data() {
    return this.#state().analytics;
  }

  getAnalytics() {
    const config = {
      headers: httpHeaders(),
    };
    return this.httpClient
      .get<AnalyticsResponseI>(`${ENV.API_HOST_URL}/analytics`, config)
      .pipe(
        map((data) =>
          this.#state.set({
            loading: false,
            analytics: data,
          })
        )
      );
  }
}
