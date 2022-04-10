import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { Observable } from 'rxjs';
import { AuthService } from "../../../shared/services/auth/auth.service";
import { Product } from "../../../shared/models/Product.model";

@Injectable({
  providedIn: 'root'
})
export class EditService {

  constructor(
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
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
            .then(() => observer.next(true))
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
}
