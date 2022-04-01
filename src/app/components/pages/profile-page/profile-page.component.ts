import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

interface Data {
  username: string;
  image: string;
  email: string;
  cart: Array<object>;
  messagesFrom: Array<object>;
  messagesTo: Array<object>;
  products: Array<object>;
  purchases: Array<object>;
  ratingAsBuyer: Array<number>;
  ratingAsSeller: Array<number>;
  sessionToken: string;
};

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  username: string = "";
  email: string = "";
  image: string = "";
  ratingAsBuyer: number = 0;
  ratingAsSeller: number = 0;
  purchases: Array<object> = [];
  products: Array<object> = [];
  messagesFrom: Array<object> = [];
  messagesTo: Array<object> = [];

  constructor(
    private authService: AuthService
  ) { 
    const { username, image, ratingAsBuyer, ratingAsSeller, purchases, products } = this.authService.userData() as Data;
    this.username = username;
    this.image = image;
    this.ratingAsBuyer = this.formatRating(ratingAsBuyer);
    this.ratingAsSeller = this.formatRating(ratingAsSeller);
    this.purchases = purchases;
    this.products = products;
        
    console.log(this.authService.userData());
  }

  ngOnInit(): void {
    
  };

  formatRating(ratingArr: Array<number>) {
    return ratingArr.length > 0 ? ratingArr.reduce((a: number, b: number) => a + b) : 0
  };
};
