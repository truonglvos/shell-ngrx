import { createAction, props } from '@ngrx/store';

export const updateIsLogin = createAction(
  '[Update login] update is login',
  props<{ isLogin: boolean }>()
);
