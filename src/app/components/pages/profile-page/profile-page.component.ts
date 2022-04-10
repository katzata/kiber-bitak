import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from "../../shared/models/User.model";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  userData: User;

  constructor(
    private titleService: Title,
    private authService: AuthService
  ) { 
    const result = this.authService.userData()!;
    result.ratingAsBuyer = this.formatRating(result.ratingAsBuyer);
    result.ratingAsSeller = this.formatRating(result.ratingAsSeller);
    
    this.userData = result;
    this.titleService.setTitle("Profile");
  }

  ngOnInit(): void {
    
  };

  formatRating(ratingArr: Array<number>) {
    return ratingArr.length > 0 ? ratingArr.reduce((a: number, b: number) => a + b) / 5 : 0
  };
};
