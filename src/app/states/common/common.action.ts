import { createAction, props } from '@ngrx/store';
import { RouterDynamic } from '../../models/router.model';

export const updatePath = createAction(
  '[Update Common State] update path',
  props<{ path: string }>()
);

export const updateListPathMenuLeft = createAction(
  '[Update Common State] update list path display left menu',
  props<{ pathsDisplayLeftMenu: string[] }>()
);

export const loadRouterConfigSuccess = createAction(
  '[Update Common State] update router config success',
  props<{ routerConfig: RouterDynamic[] }>()
);

export const loadRouterConfig = createAction(
  '[Update Common State] update router config'
);
