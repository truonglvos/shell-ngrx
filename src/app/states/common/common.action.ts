import { createAction, props } from '@ngrx/store';

export const updatePath = createAction(
  '[Update Common State] update path',
  props<{ path: string }>()
);

export const updateListPathMenuLeft = createAction(
  '[Update Common State] update list path display left menu',
  props<{ pathsDisplayLeftMenu: string[] }>()
);
