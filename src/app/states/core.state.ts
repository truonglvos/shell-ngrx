import { AuthState } from './auth';
import { CommonState } from './common';

export interface State {
  auth: AuthState;
  common: CommonState;
}
