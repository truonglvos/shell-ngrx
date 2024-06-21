import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterService } from './services/router.service';
import { NavigationEnd, Route, Router } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { Store, createSelector } from '@ngrx/store';
import { authGuard, notCheckAuthGuard } from './guards/auth.guard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import * as commonAction from './states/common/common.action';
import * as commonSelector from './states/common/common.selector';
import * as authAction from './states/auth/auth.action';
import * as authSelector from './states/auth/auth.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shell';
  appSelector = createSelector(
    authSelector.selectAuthState,
    commonSelector.commonSelector,
    (auth, common) => ({
      auth,
      common,
    })
  );
  vm$ = this.store.select(this.appSelector);
  constructor(
    private routerService: RouterService,
    private router: Router,
    private store: Store
  ) {}
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) =>
        this.store.dispatch(
          commonAction.updatePath({
            path: (event as NavigationEnd).urlAfterRedirects,
          })
        )
      );
    this.routerService
      .loadRouter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((listRouter) => {
        this.router.resetConfig([
          this.router.config[0],
          ...listRouter.map(
            (item) =>
              ({
                canMatch: [item.guard ? authGuard : notCheckAuthGuard],
                path: item.path,
                loadChildren: () => {
                  return loadRemoteModule({
                    type: 'module',
                    remoteEntry: item.remoteEntry,
                    exposedModule: `./${item.exposedModule}`,
                  }).then((m) => {
                    return m[item.exposedModule];
                  });
                },
              } as Route)
          ),
          this.router.config[1],
        ]);
      });
    this.store.dispatch(authAction.checkLogin());
    window.addEventListener('v-logout', this.handleLogout);
  }

  ngOnDestroy(): void {
    window.removeEventListener('v-logout', this.handleLogout);
  }

  handleLogout() {
    console.log('logout ở mfelogin nè');
  }

  loginShell() {
    const userName = 'anhtruonglavm2@gmail.com';
    const password = '123456';
    this.store.dispatch(authAction.login({ userName, password }));
  }

  logoutShell() {
    this.store.dispatch(authAction.logOut());
  }
}
