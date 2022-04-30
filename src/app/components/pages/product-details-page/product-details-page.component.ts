import { Component, ViewChild, } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from '../../services/product-details-service/details.service';
import { Product } from "../../../models/Product.model";
import { AuthService } from '../../services/auth/auth.service';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { ShoppingCartService } from '../../services/shopping-cart-service/shopping-cart.service';
import { MessageService } from '../../../services/message/message.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

@Component({
  selector: 'app-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css'],
  animations: [
    trigger("addToggle", [
      state("true", style({
        width: "33px",
        // content: "Cancel"
      })),
      state("false", style({
        width: "100%",
        // content: "Add to cart"
      })),
      transition("false => true", [
        animate(".13s ease-in", keyframes([
          style({ width: "100%", offset: 0 }),
          style({ width: "33px", offset: 0.5 }),
        ])),
      ]),
      transition("true => false", [
        animate(".13s ease-in",
          keyframes([
            style({ width: "33px", offset: 0.5 }),
            style({ width: "100%", offset: 1 })
          ])
        )
      ])
    ]),
    trigger("addTextToggle", [
      state("true", style({
        opacity: "0"
      })),
      state("false", style({
        opacity: "1",
      })),
      transition("false => true", animate(".07s ease-in", keyframes([
        style({ opacity: "1", offset: 0.5 }),
        style({ opacity: "0", offset: 0.51 }),
      ]))),
      transition("true => false", animate(".13s", keyframes([
        style({ opacity: "0", offset: 0.9 }),
        style({ opacity: "1", offset: 1 }),
      ])))
    ]),
    trigger("cancelTextToggle", [
      state("true", style({
        opacity: "1"
      })),
      state("false", style({
        opacity: "0",
      })),
      transition("false => true", animate(".12s ease-in", keyframes([
        style({ opacity: "0", offset: 0.5 }),
        style({ opacity: "1", offset: 1 }),
      ]))),
      transition("true => false", animate(".26s ease-in", keyframes([
        style({ opacity: "1", offset: 0.9 }),
        style({ opacity: "0", offset: 1 }),
      ])))
    ]),
    trigger("formToggle", [
      state("true", style({
        opacity: "1"
      })),
      state("false", style({
        opacity: "0",
      })),
      transition("false => true",
        animate(".39s ease-out", 
          keyframes([
            style({ opacity: "0" }),
            style({ opacity: "1" }),
          ])
        )
      ),
      transition("true => false",
        animate(".07s ease-out",
          keyframes([
            style({ opacity: "1" }),
            style({ opacity: "0" }),
          ])
        )
      )
    ])
  ]
})
export class DetailsPageComponent {
  title: string = "Details";
  isLogged: boolean = this.authService.isLogged;
  isOwner: boolean = false;
  details: Product | null = null;
  isAdding: string = "false";

  @ViewChild("addToCartButton") addToCartButton!: HTMLButtonElement;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private authService: AuthService,
    private errorService: ErrorHandlingService,
    private shoppingCartService: ShoppingCartService,
    private messageService: MessageService,
    private detailsService: DetailsService
  ) {
    this.titleService.setTitle("Details");
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      
      this.detailsService.getDetails(id).subscribe((data: Product) => {
        this.isOwner = this.authService.checkOwnership(data.seller);
        this.details = data;
      });
    });
  };

  onSubmit(e: Event) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const fieldset = document.querySelector("#add-fields") as HTMLFieldSetElement;
    const id = form.get("id");
    const name = form.get("name");
    const quantity = Number(form.get("quantity"));
    const price = Number(form.get("price"));
    const seller = form.get("seller");
    
    fieldset.disabled = true;

    this.shoppingCartService.addToCart({ id, name, quantity, price, seller })
      .catch((err: Error) => {
        this.errorService.httpError("cart", err.message);
      })
      .finally(() => fieldset.disabled = false);
  };

  contactSeller() {
    this.messageService.handleStatus(true, this.details?.seller);
  };

  toggleAddForm() {
    if (this.isAdding === "true") {
      this.isAdding = "false";
    } else {
      this.isAdding = "true";
    };
  };
};
