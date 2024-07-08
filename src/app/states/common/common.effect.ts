import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as commonAction from './common.action';
import { map, switchMap } from 'rxjs';
import { RouterService } from '../../services/router.service';

@Injectable()
export class CommonEffect {
  constructor(
    private actions$: Actions,
    private store: Store,
    private routerService: RouterService
  ) {}

  getRouterConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(commonAction.loadRouterConfig),
      switchMap(() =>
        this.routerService
          .loadRouter()
          .pipe(
            map((routerConfig) =>
              commonAction.loadRouterConfigSuccess({ routerConfig })
            )
          )
      )
    )
  );
}
