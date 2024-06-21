import { Action, createReducer, on } from '@ngrx/store';
import { CommonState, initCommonState } from './common.state';
import * as commonAction from './common.action';

const commonReducer = createReducer(
  initCommonState,
  on(commonAction.updatePath, (state, { path }) => ({
    ...state,
    path,
  })),
  on(
    commonAction.updateListPathMenuLeft,
    (state, { pathsDisplayLeftMenu }) => ({
      ...state,
      pathsDisplayLeftMenu,
    })
  )
);

export function reducer(state: CommonState | undefined, action: Action) {
  return commonReducer(state, action);
}
