import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InjectStyleService {
  private listElement: HTMLElement[] = [];
  attact(url: string) {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('link') as HTMLLinkElement;
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', url);
    head.appendChild(style);
    this.listElement.push(head);
  }

  deAttact() {
    for (const item of this.listElement) {
      item.remove();
    }
  }
}
