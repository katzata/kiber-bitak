import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart-service/shopping-cart.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  animations: [
    trigger("toggleClick", [
      state("true", style({
        maxHeight: "100vh",
        transform: "scaleY(1)"
      })),
      state("false", style({
        maxHeight: "0vh",
        transform: "scaleY(0)"
      })),
      transition("false => true", [
        animate(".13s ease-out", keyframes([
          style({ maxHeight: "0", offset: 0 }),
          style({ transform: "scaleY(0)", offset: 0.4 }),
          style({ maxHeight: "101px", offset: 0.499 }),
          style({ maxHeight: "100vh", offset: 0.5 }),
          style({ transform: "scaleY(1)", offset: 1 })
        ])),
      ]),
      transition("true => false", [
        animate(".13s ease-out",
          keyframes([
            style({ transform: "scaleY(1)", offset: 0 }),
            style({ maxHeight: "100vh", offset: 0.5 }),
            style({ transform: "scaleY(0)", offset: 0.6 }),
            style({ maxHeight: "0vh", offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class ShoppingCartComponent {
  cart: Array<any> = [];
  userData: any;
  isCheckingOut: string = "false";

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService
  ) {
    this.setData();
  };

  toggleCheckout() {
    if (this.isCheckingOut === "false") {
      this.isCheckingOut = "true"
    } else {
      this.isCheckingOut = "false"
    };
  };

  confirmPurchases() {
    this.shoppingCartService.checkOut(this.userData.cart)
      .then(() => {
        this.setData();
      });
  };

  setData() {
    this.userData = this.authService.userData();
    this.userData.totalProducts = this.userData.cart.length;
    
    if (this.userData.cart.length > 1) {
      this.userData.totalPeaces = this.userData.cart.reduce((a: any, b: any) => a.quantity + b.quantity);
      this.userData.totalAmount = this.userData.cart.reduce((a: any, b: any) => {
        const v1 = a.quantity * a.price;
        const v2 = b.quantity * b.price;

        return v1 + v2;
      });
    } else {
      if (this.userData.cart[0]) {
        const { quantity, price } = this.userData.cart[0];

        this.userData.totalPeaces = quantity;
        this.userData.totalAmount = quantity * price;
      } else {
        this.userData.totalPeaces = 0;
        this.userData.totalAmount = 0;
      }
    };
  };

  removeItem(id: string) {
    this.shoppingCartService.removeFromCart(id).then(() => {
      this.setData();
    });
  };
}
