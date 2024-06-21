import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellCom1Component } from './shell-com1/shell-com1.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthenticationComponent,
  },
  {
    path: 'shell-com1',
    component: ShellCom1Component,
  },
  {
    path: '**',
    redirectTo: 'shell-com1',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
