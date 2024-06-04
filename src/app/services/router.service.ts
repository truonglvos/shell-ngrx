import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RouterDynamic } from '../models/router.model';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor() {}
  public loadRouter(): Observable<RouterDynamic[]> {
    return of([
      {
        type: 'module',
        path: 'mfe1',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: 'Mfe1Module',
      },
      {
        type: 'module',
        path: 'mfe2',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: 'Mfe2Module',
      },
    ]);
  }
}
