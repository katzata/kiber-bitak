import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  isLogged: boolean = this.authService.isLogged;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.userStatus.subscribe(() => {
      
      this.isLogged = this.authService.isLogged;
    })
  };

  logOut() {
    this.authService.logOut()
      .subscribe((data: any) => {
        console.log("logOut", data);
        this.authService.handleStatus({ status: false });
      });
  }
};