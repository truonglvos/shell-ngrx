import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerOverlayService } from '../services/spinner-overlay.service';

@Injectable({
  providedIn: 'root',
})
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private readonly spinnerOverlayService: SpinnerOverlayService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.headers.get('no-flash')) {
      return next.handle(req);
    }

    const spinnerSubscription: Subscription =
      this.spinnerOverlayService.spinner$.subscribe();
    return next
      .handle(req)
      .pipe(finalize(() => spinnerSubscription.unsubscribe()));
  }
}
