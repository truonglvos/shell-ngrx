import { ImageModule } from 'truonlv4-lib/image';
import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellCom1Component } from './shell-com1/shell-com1.component';
import { Store, StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './states';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffect } from './states/auth/auth.effect';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthIntercep } from './interceotor/auth.interceptor';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterService } from './services/router.service';
import { RouterDynamic } from './models/router.model';
import { Route, Router } from '@angular/router';
import { authGuard, notCheckAuthGuard } from './guards/auth.guard';
import { loadRemoteModule } from '@angular-architects/module-federation';
import * as commonAction from './states/common/common.action';
import { lastValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SpinnerOverlayComponent } from './components/spinner-overlay/spinner-overlay.component';
import { SpinnerInterceptor } from './interceotor/spinner.interceptor';

import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [
    AppComponent,
    ShellCom1Component,
    AuthenticationComponent,
    SpinnerOverlayComponent,
  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    AppRoutingModule,
    // DragDropModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      trace: true,
    }),
    EffectsModule.forRoot([AuthEffect]),
    HttpClientModule,
    ImageModule.forRoot({ shell: '', mfe: '' }),
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    FileUploadModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercep,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [RouterService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private router: Router, private store: Store) {
    const listRouter: RouterDynamic[] = JSON.parse(
      localStorage.getItem('routerConfig') || '[]'
    );
    localStorage.removeItem('routerConfig');
    this.store.dispatch(
      commonAction.loadRouterConfigSuccess({ routerConfig: listRouter })
    );
    this.router.resetConfig([
      this.router.config[0],
      ...listRouter.map(
        (item) =>
          ({
            canMatch: [item.guard ? authGuard : notCheckAuthGuard],
            path: item.path,
            loadChildren: () => {
              return loadRemoteModule<{ [index: string]: unknown }>({
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
  }
}

export function initializeApp(routerService: RouterService) {
  return (): Promise<void> => {
    return lastValueFrom(routerService.loadRouter()).then((config) => {
      localStorage.setItem('routerConfig', JSON.stringify(config));
    });
  };
}
