import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { Observable } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { Product } from "../../../models/Product.model";
import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class EditService {
  observable: any;
  baseData: any;

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";

    this.titleService.setTitle("Edit profile");
  }

  getData(id: string): Observable<any> {
    return new Observable(observer => {
      const query = new Parse.Query("Products");
      query.equalTo("objectId", id);
      
      query.find()
        .then((data: any) => {
          this.baseData = this.formatResponse(data[0]);
          observer.next(this.formatResponse(data[0]))
        })
        .catch(err => {
          this.errorService.httpError("edit", err.message);
          observer.next(false);
        });
    });
  };

  updateProduct(id: string, data: Product): Observable<any> {
    return new Observable(observer => {
      const Products = Parse.Object.extend("Products");
      const product = new Parse.Query(Products);

      product.get(id).then(item => {
        const differences = Object.entries(data)
          .filter((el: any) => {
            if (item.attributes[el.field] && item.attributes[el.field] !== el.value && el.field !== "images") {
              return el;
            };
          });
        
        if (differences.length > 0) {
          differences.forEach((el: [string, any]) => {
            item.set(...el);
          });

          item.save()
            .then(() => observer.next(true))
            .catch(err => {
              this.errorService.httpError("edit", err.message);
              observer.next(false);
            });
        } else {
          this.errorService.formErrors("edit", ["No fields have been changed."]);
          observer.next(false);
        };
      });
    });
  };

  deleteProduct(id: string, data: Product): Observable<any> {
    return new Observable(observer => {
      const Products = Parse.Object.extend("Products");
      const product = new Parse.Query(Products);

      product.get(id).then(item => {
        const confirmation = confirm("Are you sure about this?");
        
        if (confirmation) {
          item.destroy()
            .then((data) => observer.next(data))
            .catch(err => {
              this.errorService.httpError("delete", err.message);
              observer.next(false);
            });
        } else {
          observer.next(false);
        };
      });
    });
  };

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

  private formatResponse(res: any): any {
    for (let i = 0; i < res.length; i++) {
      res[i] = {
        id: res[i].id,
        resType: res[i].attributes.hasOwnProperty("username") ? "user" : "product",
        ...res[i].attributes
      };
    };

    return res;
  };
}
