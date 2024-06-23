import { createAction, props } from '@ngrx/store';
import { Error, User } from './auth.state';

export const updateIsLogin = createAction(
  '[Update login] update is login',
  props<{ isLogin: boolean }>()
);

export const loginSuccess = createAction(
  '[Update login] login success',
  props<{ user: User }>()
);

export const loginError = createAction(
  '[Update login] login error',
  props<{ error: Error }>()
);

export const login = createAction(
  '[Update login] login',
  props<{ userName: string; password: string }>()
);

export const updateLoading = createAction(
  '[Update login] loading',
  props<{ loading: boolean }>()
);

export const logout = createAction('[Log out] Log out');
export const logoutSuccess = createAction('[Log out] Log out Success');

export const checkLogin = createAction('[Check login] login');
export const actionNoop = createAction('[Noop] noop');
