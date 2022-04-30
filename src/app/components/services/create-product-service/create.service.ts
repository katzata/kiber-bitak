import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { Observable } from 'rxjs';
import { Product } from "../../../models/Product.model";

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  observable: any;

  constructor(
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
  }

  addItem(data: Product): Observable<any> {
    return new Observable(observer => {
      if (data.imageData && data.imageData.length > 0) {
        this.uploadImages(data.imageData).then((urls: Array<any>) => {
          data.imageData = urls;

          this.saveProduct(data)?.then((res: any) => observer.next(true))
            .catch((err: any) => {
              this.errorService.httpError("create", err);
              observer.next(true);
            });
        });
      } else {
        this.saveProduct(data)?.then((res: any) => {
            observer.next(true);
          })
          .catch((err: any) => {
            this.errorService.httpError("create", err);
            observer.next(false);
          });
      };
    });
  };

  private saveProduct(data: Product) {
    // const errors = this.checkInput(data);

    // if (errors.length > 0) {
    //   // this.errorService.formErrors("create", errors);
    //   throw new Error("asd");
      
    //   // return Promise.reject();
    // };

    const Products = Parse.Object.extend("Products");
    const product = new Products();
    
    product.set({
      department: data.department,
      name: data.name,
      condition: data.condition,
      delivery: data.delivery,
      price: data.price,
      quantity: data.quantity,
      location: data.location,
      images: data.imageData ? data.imageData : [],
      description: data.description,
      seller: Parse.User.current()
    });

    return product.save().then((productRes: Product) => {
        return this.authService.updateProducts(productRes);
      })
      .catch((err: any) => {
        return this.errorService.httpError("create", err);
      });
  };

  private saveUser() {
    const user = Parse.User.current();
    const products = user?.attributes["products"];
    
    user?.set("products", products);
    console.log(products);
    
    return user?.save();
  };

  // private checkInput(input: any) {
  //   const errors = [];

  //   for (const [field, value] of Object.entries(input)) {
  //     if (field === "images" || field === "imageData") continue;
  //     if (Number(value) < 1 || value === "" || value === Number) {
  //       errors.push(field);
  //     };
  //   };

  //   return errors;
  // };

  private async uploadImages(images: Array<any>) {
    const promises: Array<Parse.Object> = [];

    async function upload() {
      for (const item of images) {
        const name: string = formatImageNames();
        const file = new Parse.File(name, item);
        
        const Image = Parse.Object.extend("Images");
        const image = new Image();

        image.set("image", file);
        image.set("name", name);
        
        promises.push(image);
      };
      
      return Promise.all(
        promises.map((el: Parse.Object) => el.save())
      ).then((values) => {
        return values.map(el => el.attributes["image"]._url);
      });
    };

    return await upload();

    function formatImageNames() {
      const random = (multiplyer: number) => Math.floor(Math.random() * multiplyer);
      const ranges = [[48, 57], [65, 90], [97, 122]];
      const currentRange = ranges[random(3)]

      return [...Array(8).fill("*")]
        .map((el: string) => {
          const calc = currentRange[0] + random(currentRange[1] - currentRange[0]);
          return String.fromCharCode(calc);
        }).join("");
    };
  };
}
