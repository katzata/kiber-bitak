import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from "../../../models/User.model";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {
  userData!: User;
  purchases: Array<any> = [];
  products: Array<any> = [];
  sold: Array<any> = [];

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ) {
    this.titleService.setTitle("Profile");

    const result = this.authService.userData()!;
    this.userData = result;
    this.purchases = this.userData.purchases;
    console.log(this.purchases);
    
    Promise.all([
      this.authService.getProducts(),
      this.authService.getSold()
    ]).then((lists) => {
      const [products, sold] = lists;
      
      this.products = products;
      this.sold = this.formatSold(sold);;
    }, (err) => {
      this.errorService.httpError("profile", err);
    });
    // this.authService.getProducts()!.then((list) => {
    //   this.products = list;
    // }, (err) => {
    //   this.errorService.httpError("profile", err);
    // });
  }

  formatSold(sold: Array<any>) {
    return sold.map((el: any) => {
      return {
        id: el.get("product").id,
        name: el.get("product").get("name"),
        quantity: el.get("quantity"),
        price: el.get("price"),
        date: el.get("createdAt")
      };
    });
  };

  formatRating(ratingArr: Array<number>) {
    return ratingArr.length > 0 ? ratingArr.reduce((a: number, b: number) => a + b) / 5 : 0
  };
};
