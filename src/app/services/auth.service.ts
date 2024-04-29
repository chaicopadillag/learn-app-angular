import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AuthResponse,
  AuthUser,
  VerifyTokenResponse,
} from '@interfaces/response/auth-response';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ENV } from '../env';
import { AuthStatus } from '../interfaces/response/auth-response';
import { httpHeaders } from './http-headers';

interface AuthState {
  authUser: AuthUser | null;
  token: string;
  authStatus: AuthStatus;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  #state = signal<AuthState>({
    authUser: null,
    token: '',
    authStatus: 'unauthenticated',
  });

  public authState = computed(() => this.#state());
  public authStatus = computed(() => this.#state().authStatus);

  constructor() {
    this.ferifyToken().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<AuthResponse>(
        `${ENV.API_HOST_URL}/auth/login`,
        { email, password },
        { headers: httpHeaders() }
      )
      .pipe(
        tap(({ authUser, token }) => {
          this.#state.set({
            authUser,
            token,
            authStatus: 'authenticated',
          });

          localStorage.setItem('token', token);
        }),

        map(() => true),
        catchError(({ error }) =>
          throwError(() => error?.message || 'email or password fails')
        )
      );
  }

  ferifyToken() {
    const token = localStorage.getItem('token');

    if (!token) return of(false);

    this.#state.update((prev) => ({ ...prev, authStatus: 'verifying' }));

    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .get<VerifyTokenResponse>(`${ENV.API_HOST_URL}/auth/user`, config)
      .pipe(
        tap(({ data }) => {
          this.#state.set({
            authUser: data,
            token,
            authStatus: 'authenticated',
          });
        }),
        map(() => true),
        catchError(() => {
          localStorage.removeItem('token');
          this.#state.set({
            authUser: null,
            token,
            authStatus: 'unauthenticated',
          });
          return of(false);
        })
      );
  }

  logout() {
    const token = localStorage.getItem('token');
    if (!token) return of(false);

    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .post(`${ENV.API_HOST_URL}/auth/logout`, {}, config)
      .pipe(
        tap(() => {
          this.#state.set({
            authUser: null,
            token: '',
            authStatus: 'unauthenticated',
          });
          localStorage.removeItem('token');
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }
}
