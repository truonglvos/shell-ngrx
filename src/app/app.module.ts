import { ImageModule } from 'truonlv4-lib/image';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellCom1Component } from './shell-com1/shell-com1.component';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './states';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffect } from './states/auth/auth.effect';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthIntercep } from './interceotor/auth.interceptor';
import { AuthenticationComponent } from './components/authentication/authentication.component';

@NgModule({
  declarations: [AppComponent, ShellCom1Component, AuthenticationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      trace: true,
    }),
    EffectsModule.forRoot([AuthEffect]),
    HttpClientModule,
    ImageModule.forRoot({ shell: '', mfe: '' }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercep,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
