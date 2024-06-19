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
import { ACCESS_TOKEN } from '../constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogin = new BehaviorSubject(false);
  isLogin$ = this.isLogin.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

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
}
