import { Injectable, isDevMode } from '@angular/core';
import { CookieAttributes, get, remove, set } from 'js-cookie';

export interface ICookieService {
  get(name: string): string | undefined;
  set(name: string, value: string, options?: CookieAttributes): void;
  remove(name: string, options?: CookieAttributes): void;
}

@Injectable({
  providedIn: 'root',
})
export class CookieService implements ICookieService {
  get(name: string): string | undefined {
    return get(name);
  }
  set(
    name: string,
    value: string,
    options?: CookieAttributes | undefined
  ): void {
    if (!isDevMode()) {
      if (!options) {
        options = { secure: true };
      }
      if (!options.secure) {
        options.secure = true;
      }
    }
    set(name, value, options);
  }
  remove(name: string, options?: CookieAttributes | undefined): void {
    remove(name, options);
  }
}
