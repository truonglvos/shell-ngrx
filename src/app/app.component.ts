import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterService } from './services/router.service';
import { Router } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { Store } from '@ngrx/store';
import * as authAction from './states/auth/auth.action';
import * as authSelector from './states/auth/auth.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'shell';
  vm$ = this.store.select(authSelector.selectIsLogin);
  constructor(
    private authService: AuthService,
    private routerService: RouterService,
    private router: Router,
    private store: Store
  ) {
    this.authService.isLogin$.subscribe((v: any) => {
      console.log('@@@shell', v);
    });
  }
  ngOnInit(): void {
    this.routerService.loadRouter().subscribe((listRouter) => {
      this.router.resetConfig([
        this.router.config[0],
        ...listRouter.map((item) => ({
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
        })),
        this.router.config[1],
      ]);
    });
    console.log('@@@routerConfig', this.router.config);
  }
  changeLogin(isLogin: boolean | null) {
    console.log(isLogin);
    this.store.dispatch(authAction.updateIsLogin({ isLogin: !isLogin }));
  }
}
