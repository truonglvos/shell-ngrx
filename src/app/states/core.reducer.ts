import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { State } from './core.state';
import * as authReducer from './auth/auth.reducer';
import * as commonReducer from './common/common.reducer';

export const reducers: ActionReducerMap<State> = {
  auth: authReducer.reducer,
  common: commonReducer.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];
