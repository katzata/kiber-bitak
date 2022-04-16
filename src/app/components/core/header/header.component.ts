import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  isLogged: boolean = this.authService.isLogged;

  constructor(
    private authService: AuthService
  ) {
    this.authService.userStatus.subscribe(() => {
      this.isLogged = this.authService.isLogged;
    })
  };

  logOut() {
    this.authService.logOut()
      .subscribe((data: any) => {
        this.authService.handleStatus({ status: false });
      });
  }
};