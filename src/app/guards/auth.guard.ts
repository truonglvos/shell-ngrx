import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLogin } from '../states/auth';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store$ = inject(Store);
  console.log('@@@check guard', next, state);
  return store$.select(selectIsLogin).pipe();
};
