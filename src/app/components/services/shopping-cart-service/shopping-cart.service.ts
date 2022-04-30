import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from "parse";
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  _cart: Array<any> = [];

  constructor(
    private authService: AuthService
  ) { 
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";

    this.authService.userStatus.subscribe((data: any) => {
      console.log(data);
      
    })
  };

  async addToCart(data: any) {
    const product = new Parse.Query("Products");

    await product.get(data.id)
      .then((foundProduct: any) => {
        const quantity = foundProduct.get("quantity");
        
        if (quantity - data.quantity < 0) {
          throw new Error(`The available product quantity is ${quantity}.//Please enter a lower value.`);
        };

        const user = Parse.User.current();
        const cart = user?.get("cart");
        const existing = cart.filter((el: any) => el.id === data.id)[0];

        if (existing) {
          existing.quantity += data.quantity;
          user?.set("cart", cart);
        } else {
          data.name = foundProduct.get("name");
          user?.set("cart", [data, ...cart]);
        };

        return Promise.all([
          user?.save()
        ])
      });
  };

  async checkOut(items: any) {
    const buyer = Parse.User.current();
    const SoldProducts = Parse.Object.extend("Sold");
    // const sellersQuery = new Parse.Query(Parse.User);
    const productsQuery = new Parse.Query("Products");
    const itemIds = items.map((el: any) => el.id);
    const sellerIds = items.map((el: any) => el.seller);
    
    // sellersQuery.containedIn("objectId", sellerIds);
    productsQuery.containedIn("objectId", itemIds);

    return productsQuery.find({})
      .then((data: any) => {
        const itemsObj = Object.fromEntries(items.map((el: any) => [el.id, el]));
        const purchases = buyer?.get("purchases");
        const soldItems: Array<any> = [];

        data.forEach((el: any) => {
          const productQuantity = el.get("quantity");
          el.set("quantity", productQuantity - itemsObj[el.id].quantity);

          const soldProduct = new SoldProducts();
          soldProduct.set({
            product: el,
            buyer: Parse.User.current(),
            seller: el.get("seller"), 
            price: el.get("price"),
            quantity: itemsObj[el.id].quantity,
          });

          soldItems.push(soldProduct);
        });
        
        purchases.push(...items);
        buyer?.set("purchases", purchases);
        buyer?.set("cart", []);

        return Promise.all([
          Parse.Object.saveAll(soldItems),
          buyer?.save()
        ]);
      })
      .catch(err => console.log(err))


    // return await Promise.all([
    //   productsQuery.find({}),
    //   sellersQuery.find({})
    // ]).then((values: Array<any>) => {
    //   const [productz, sellers] = values;

    //   const itemsObj = Object.fromEntries(items.map((el: any) => [el.id, el]));
    //   // const productsObj = Object.fromEntries(products.map((el: any) => [el.id, el]));
    //   const sellersObj = Object.fromEntries(sellers.map((el: any) => [el.id, el]));
    //   // console.log(products, sellersObj);

    //   productz.forEach((el: any) => {
    //     const totalQuantity = el.get("quantity");
    //     const buyQuantity = itemsObj[el.id].quantity;
    //     const seller = el.get("seller").id;
    //     const sellerItemsSold = sellersObj[seller].get("sold");
        
    //     el.set("quantity", totalQuantity - buyQuantity);
        
    //     const sold = this.formatSoldItem(el, buyer);
    //     sellersObj[seller].set("sold", [sold, ...sellerItemsSold]);
    //   });

    //   const purchases = buyer?.get("purchases");
    //   purchases.push(...items);

    //   console.log(productz);
    //   // buyer?.set("purchases", purchases);
    //   // buyer?.set("cart", []);

    //   Parse.Object.saveAll(productz)
    //     .then((data: any) => {
    //       console.log(data);
    //     })
    //     .catch(err => console.log(err))
    //   Promise.all([
    //     // productz[0].save(),
    //     // buyer?.save(),
    //     // Promise.all(productz.map((el: any) => el.save()))
    //     // Parse.Object.saveAll(sellers)
    //   ])
    //   .then((data: any) => {
    //     console.log(data);
    //   })
    //   .catch(err => console.log(err))
    // })
  };

  private formatSoldItem(item: any, user: any) {
    return {
      id: item.id,
      name: item.get("name"),
      quantity: item.get("quantity"),
      price: item.get("price"),
      buyer: user.id
    };
  };

  async removeFromCart(id: string) {
    const user = Parse.User.current();
    // const products = new Parse.Query("Products");
    const { cart } = this.authService.userData();
    const cartItem = cart.filter((el: any) => el.id === id)[0];

    cart.splice(cartItem, 1);
    user?.set("cart", cart);
    // await products.get(id)
    //   .then((foundProduct: any) => {
    //     const user = Parse.User.current();
    //     const quantity = foundProduct.get("quantity");
    //     const newQuantity = quantity + cartItem.quantity;

    //     user?.set("cart", cart);
    //     foundProduct.set("quantity", newQuantity);

    //     return Promise.all([
    //       user?.save(),
    //       foundProduct.save()
    //     ]);
    //   })
    return user?.save();
  };

  get cart() {
    return this._cart;
  };
}
