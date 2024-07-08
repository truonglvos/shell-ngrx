import { RouterDynamic } from '../../models/router.model';

export interface CommonState {
  path: string;
  pathsDisplayLeftMenu: string[];
  routerConfig: RouterDynamic[];
}

export const initCommonState: CommonState = {
  path: '/',
  pathsDisplayLeftMenu: ['/', '/shell-com1'],
  routerConfig: [],
};
