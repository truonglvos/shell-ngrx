import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectIsLogin = createSelector(
  selectAuth,
  (state) => state.isLogin
);

export const selectAuthState = createSelector(selectAuth, (state) => state);
