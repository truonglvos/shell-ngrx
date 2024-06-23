import { Action, createReducer, on } from '@ngrx/store';
import { AuthState, initAuthState } from './auth.state';
import * as authAction from './auth.action';

const authReducer = createReducer(
  initAuthState,
  on(authAction.updateIsLogin, (state, { isLogin }) => ({
    ...state,
    isLogin,
  })),
  on(authAction.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isLogin: true,
  })),
  on(authAction.loginError, (state, { error }) => ({
    ...state,
    error,
    isLogin: false,
  })),
  on(authAction.updateLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
  on(authAction.logoutSuccess, (state) => ({
    ...state,
    isLogin: false,
    user: undefined,
    error: undefined,
  })),
  on(authAction.actionNoop, (state) => state)
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
