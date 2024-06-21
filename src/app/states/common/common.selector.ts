import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommonState } from './common.state';

export const commonSelector = createFeatureSelector<CommonState>('common');
export const commonPathSelector = createSelector(
  commonSelector,
  (state) => state.path
);
export const commonListPathLeftMenuSelector = createSelector(
  commonSelector,
  (state) => state.pathsDisplayLeftMenu
);
