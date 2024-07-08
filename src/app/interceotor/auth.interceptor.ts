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
import { JWT_INVALID } from '../constants';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthIntercep implements HttpInterceptor {
  private refreshToken$$ = new ReplaySubject<void>(1);
  constructor(private authService: AuthService, private store: Store) {}
  private refreshToken$ = this.refreshToken$$.pipe(
    exhaustMap(() => this.authService.refreshToken()),
    map((res) => res.accessToken),
    share()
  );
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.headers.get('no-token')) {
      return next.handle(req);
    }
    if (req.headers.get('refresh')) {
      return next.handle(
        req.clone({
          headers: req.headers.set(
            'Authorization',
            `Bearer ${this.authService.getRefreshToken()}`
          ),
        })
      );
    }
    const authToken = this.authService.getAccessToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              if (error.error.message === JWT_INVALID) {
                this.refreshToken$$.next();
                return this.refreshToken$.pipe(
                  take(1),
                  catchError((error) => throwError(() => error)),
                  switchMap((token) =>
                    next.handle(
                      req.clone({
                        headers: req.headers.set(
                          'Authorization',
                          `Bearer ${token}`
                        ),
                      })
                    )
                  )
                );
              } else {
                console.log('logout 401 and not get token again');
                // this.store.dispatch(logout());
              }
              break;
            default:
              break;
          }
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }
}
