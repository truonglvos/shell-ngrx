import { Action, createReducer, on } from '@ngrx/store';
import { AuthState, initAuthState } from './auth.state';
import * as authAction from './auth.action';

const authReducer = createReducer(
  initAuthState,
  on(authAction.updateIsLogin, (state, { isLogin }) => ({
    ...state,
    isLogin,
  }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
