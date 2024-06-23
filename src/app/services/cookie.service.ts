import { Injectable, isDevMode } from '@angular/core';
import Cookies, { CookieAttributes } from 'js-cookie';

export interface ICookieService {
  get(name: string): string;
  set(name: string, value: string, options?: CookieAttributes): void;
  remove(name: string, options?: CookieAttributes): void;
}

@Injectable({
  providedIn: 'root',
})
export class CookieService implements ICookieService {
  get(name: string): string {
    return Cookies.get(name) || '';
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
    Cookies.set(name, value, options);
  }
  remove(name: string, options?: CookieAttributes | undefined): void {
    Cookies.remove(name, options);
  }
}
