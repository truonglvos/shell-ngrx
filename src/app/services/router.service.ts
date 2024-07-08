import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterDynamic } from '../models/router.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private http: HttpClient) {}
  public loadRouter(): Observable<RouterDynamic[]> {
    return this.http.get<RouterDynamic[]>(`${environment.bff}/router-config`);
  }
}
