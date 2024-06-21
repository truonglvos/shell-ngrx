export interface CommonState {
  path: string;
  pathsDisplayLeftMenu: string[];
}

export const initCommonState: CommonState = {
  path: '/',
  pathsDisplayLeftMenu: ['/', '/shell-com1'],
};
