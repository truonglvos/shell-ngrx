import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, createSelector } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import * as commonAction from './states/common/common.action';
import * as commonSelector from './states/common/common.selector';
import * as authAction from './states/auth/auth.action';
import * as authSelector from './states/auth/auth.selector';
import { UploadEvent } from 'primeng/fileupload';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  files: File[] = [];
  title = 'shell';
  appSelector = createSelector(
    authSelector.selectAuthState,
    commonSelector.commonSelector,
    (auth, common) => ({
      auth,
      common,
      selectRolesString: (auth.user?.roles || []).map(
        (item) => item.roleDescEN
      ),
    })
  );
  vm$ = this.store.select(this.appSelector);
  constructor(
    private router: Router,
    private store: Store,
    private http: HttpClient
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
    this.store.dispatch(authAction.logout());
  }

  onUpload(event: any) {
    this.files = event.currentFiles;
    console.log(this.files);
  }

  upLoad() {
    const formData = new FormData();
    console.log(this.files);
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i], this.files[i].name);
    }

    this.http
      .request('post', 'http://localhost:3000/user/upload', {
        body: formData,
      })
      .subscribe();
  }
}
