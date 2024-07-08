import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as authAction from './auth.action';
import { AuthService } from '../../services/auth.service';
import { catchError, exhaustMap, finalize, map, of, tap } from 'rxjs';
import { Error } from './auth.state';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AuthEffect {
  constructor(
    private actions$: Actions,
    private store: Store,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  handleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authAction.login),
      tap(() =>
        this.store.dispatch(authAction.updateLoading({ loading: true }))
      ),
      exhaustMap((action) => {
        console.log('@@@login', action);
        return this.authService.login(action).pipe(
          map((user) => authAction.loginSuccess({ user })),
          catchError((error: Error) => of(authAction.loginError({ error }))),
          finalize(() => {
            this.store.dispatch(authAction.updateLoading({ loading: false }));
            this.router.navigate(['/']);
          })
        );
      })
    )
  );

  checkLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authAction.checkLogin),
      exhaustMap(() =>
        this.authService.checkLogin().pipe(
          map((user) => {
            if (user) {
              return authAction.loginSuccess({ user });
            }
            return authAction.actionNoop();
          })
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authAction.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => authAction.logoutSuccess()),
          finalize(() => {
            this.router.navigate(['/login']);
          })
        )
      )
    )
  );
}
