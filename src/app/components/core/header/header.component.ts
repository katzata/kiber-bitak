import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  isLogged: boolean = this.authService.isLogged;
  id: string | undefined;
  name: string | undefined;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.id = this.authService.userData()?.id;
    this.name = this.authService.userData()?.username;

    this.authService.userStatus.subscribe(() => {
      this.isLogged = this.authService.isLogged;
      this.id = this.authService.userData()?.id;
      this.name = this.authService.userData()?.username;
    });
  };

  goToCart() {
    this.router.navigate(["cart/" + this.id])
  };

  logOut(e: Event) {
    e.preventDefault();
    
    this.authService.logOut();
  };
};