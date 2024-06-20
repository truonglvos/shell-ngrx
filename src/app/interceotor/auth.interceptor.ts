import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  ReplaySubject,
  catchError,
  exhaustMap,
  map,
  share,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthIntercep implements HttpInterceptor {
  private refreshToken$$ = new ReplaySubject<void>(1);
  constructor(private authService: AuthService) {}
  private refreshToken$ = this.refreshToken$$.pipe(
    exhaustMap(() => this.authService.refreshToken()),
    map((res) => res.refreshToken),
    share()
  );
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getAuthorizationToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken),
    });
    return next.handle(authReq).pipe(
      catchError((error) => {
        console.log('@@@intercep', error);
        if (error instanceof HttpErrorResponse) {
          if (error.status == 401) {
            this.refreshToken$$.next();
            return this.refreshToken$.pipe(
              take(1),
              catchError((error) => throwError(() => error)),
              switchMap((token) =>
                next.handle(
                  req.clone({
                    headers: req.headers.set('Authorization', token),
                  })
                )
              )
            );
          }
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }
}