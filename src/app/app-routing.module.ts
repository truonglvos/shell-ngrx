import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellCom1Component } from './shell-com1/shell-com1.component';

export const routes: Routes = [
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
