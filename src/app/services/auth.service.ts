import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  of,
  take,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../states/auth';
import { ACCESS_TOKEN, CURRENT_USER, REFRESH_TOKEN } from '../constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from './cookie.service';
import { ApiUrl } from '../constants/apiUrl';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper: JwtHelperService;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  login(payload: { userName: string; password: string }): Observable<User> {
    return this.http.post<User>(`${environment.bff}/auth/login`, payload).pipe(
      tap((u) => {
        this.setAccessToken(u.accessToken);
        if (u.refreshToken) {
          this.setRefreshToken(u.refreshToken);
        }
        this.setUser(u);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  checkLogin(): Observable<User | null> {
    const user = this.getCurrentUser();
    if (user) {
      return of(user);
    }
    return of(null);
  }

  logout(): Observable<unknown> {
    return this.http.get<unknown>(`${ApiUrl.Url.logout}`).pipe(
      take(1),
      finalize(() => {
        this.setUser(null);
        this.setAccessToken(null);
        this.setRefreshToken(null);
      })
    );
  }

  refreshToken(): Observable<{ refreshToken: string; accessToken: string }> {
    const headers = new HttpHeaders();
    return this.http
      .get<{ refreshToken: string; accessToken: string }>(
        `${environment.bff}/auth/refresh`,
        {
          headers: headers.set('refresh', 'true'),
        }
      )
      .pipe(
        tap((u) => {
          this.setAccessToken(u.accessToken);
          this.setRefreshToken(u.refreshToken);
        })
      );
  }

  // use coookie

  isTokenValid() {
    const token = this.getAccessToken();
    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        return false;
      }
    } catch {
      return false;
    }
    return true;
  }

  getAccessToken() {
    return this.cookieService.get(ACCESS_TOKEN);
  }

  setAccessToken(token: string | null) {
    if (!token) {
      this.cookieService.remove(ACCESS_TOKEN);
      return;
    }
    this.cookieService.set(ACCESS_TOKEN, token);
  }

  getRefreshToken() {
    return this.cookieService.get(REFRESH_TOKEN);
  }

  authenticate(): boolean {
    try {
      const accessToken = this.getAccessToken();
      const tknInfo = JSON.parse(atob(accessToken.split('.')[1]));

      if (!tknInfo.verified) {
        return false;
      }

      const currentUser = this.getCurrentUser();
      return !!currentUser;
    } catch (e) {
      return false;
    }
  }

  getCurrentUser(): User | null {
    const user = this.cookieService.get(CURRENT_USER);
    try {
      return JSON.parse(user) as User;
    } catch {
      return null;
    }
  }

  setRefreshToken(refreshToken: string | null) {
    if (!refreshToken) {
      this.cookieService.remove(REFRESH_TOKEN);
      return;
    }
    this.cookieService.set(REFRESH_TOKEN, refreshToken);
  }

  setUser(user: User | null) {
    if (!user) {
      this.cookieService.remove(CURRENT_USER);
      return;
    }
    this.cookieService.set(CURRENT_USER, JSON.stringify(user));
  }
}
