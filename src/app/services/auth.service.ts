import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  delay,
  of,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../states/auth';
import { ACCESS_TOKEN, CURRENT_USER, REFRESH_TOKEN } from '../constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from './cookie.service';
import { AuthenticatedUser } from '../models/authenticated.user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper: JwtHelperService;
  isLogin = new BehaviorSubject(false);
  isLogin$ = this.isLogin.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  login(payload: { userName: string; password: string }): Observable<User> {
    console.log(payload);
    // return this.http.post<User>(ApiUrl.Url.login, {}).pipe(
    //   catchError(() =>
    //     of({
    //       email: 'anhtruonglavm2@gmail.com',
    //       userName: 'truonglv4',
    //       phone: '0965480046',
    //       accessToken: 'accessToken',
    //     })
    //   )
    // );
    return of({
      email: 'anhtruonglavm2@gmail.com',
      userName: 'truonglv4',
      phone: '0965480046',
      accessToken: 'accessToken',
    }).pipe(
      delay(3000),
      tap((u) => {
        sessionStorage.setItem(ACCESS_TOKEN, u.accessToken);
      }),
      catchError((error) => {
        sessionStorage.removeItem(ACCESS_TOKEN);
        return throwError(() => error);
      })
    );
  }

  checkLogin(): Observable<User | null> {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    if (token) {
      return of({
        email: 'anhtruonglavm2@gmail.com',
        userName: 'truonglv4',
        phone: '0965480046',
        accessToken: 'accessToken',
      });
    }

    return of(null);
  }

  logOut(): Observable<boolean> {
    sessionStorage.removeItem(ACCESS_TOKEN);
    this.router.navigate(['/']);
    return of(true);
  }

  getAuthorizationToken() {
    return sessionStorage.getItem(ACCESS_TOKEN) || '';
  }

  refreshToken(): Observable<{ refreshToken: string }> {
    return of({ refreshToken: 'new AccessToken' });
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
    return this.cookieService.get(ACCESS_TOKEN) || null;
  }

  setAccessToken(token: string) {
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
      const accessToken = this.getAccessToken() || '';
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

  getCurrentUser(): AuthenticatedUser | null {
    const user = this.cookieService.get(CURRENT_USER) || '';
    try {
      return JSON.parse(user) as AuthenticatedUser;
    } catch {
      return null;
    }
  }
}
