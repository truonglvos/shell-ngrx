import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterService } from './services/router.service';
import { Route, Router } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { Store } from '@ngrx/store';
import * as authAction from './states/auth/auth.action';
import * as authSelector from './states/auth/auth.selector';
import { authGuard } from './guards/auth.guard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'shell';
  vm$ = this.store.select(authSelector.selectAuthState);
  constructor(
    private routerService: RouterService,
    private router: Router,
    private store: Store
  ) {}
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.routerService
      .loadRouter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((listRouter) => {
        this.router.resetConfig([
          this.router.config[0],
          ...listRouter.map(
            (item) =>
              ({
                canMatch: [authGuard],
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

    console.log('@@@routerConfig', this.router.config);
    this.store.dispatch(authAction.checkLogin());
    window.addEventListener('v-logout', this.handleLogout);
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
