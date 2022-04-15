import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from "../../shared/models/User.model";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  userData!: User;
  products: Array<any> = [];

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ) {
    this.titleService.setTitle("Profile");

    const result = this.authService.userData()!;
    this.userData = result;

    this.authService.getProducts()!.then((list) => {
      this.products = list;
    }, (err) => {
      this.errorService.httpError("profile", err);
    });
  }

  ngOnInit(): void {
    
  };

  formatRating(ratingArr: Array<number>) {
    return ratingArr.length > 0 ? ratingArr.reduce((a: number, b: number) => a + b) / 5 : 0
  };
};
