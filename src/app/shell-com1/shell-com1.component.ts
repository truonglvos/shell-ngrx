import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-shell-com1',
  templateUrl: './shell-com1.component.html',
  styleUrl: './shell-com1.component.scss',
})
export class ShellCom1Component {
  constructor(private authService: AuthService) {
    this.authService.isLogin$.subscribe((v: unknown) => {
      console.log('@@@shell', v);
    });
  }
}
