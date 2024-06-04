export type RouterType = 'script' | 'module' | 'manifest';

interface MenuItem {
  path: string;
  label: string;
}

export interface RouterDynamic {
  type: RouterType;
  remoteEntry: string;
  exposedModule: string;
  path: string;
  menu?: MenuItem[];
}
