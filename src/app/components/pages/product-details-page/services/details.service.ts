import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable} from 'rxjs';
import { AuthService } from 'src/app/components/shared/services/auth.service';
import { Product } from 'src/app/components/shared/models/Product.model';
import { User } from 'src/app/components/shared/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  id: string = "";

  constructor(
    private authService: AuthService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
  };

  getDetails(productId: string): Observable<any> {
    return new Observable(observer => {
      const query = new Parse.Query("Products");
      const user = new Parse.Query(Parse.User);
      
      query.equalTo("objectId", productId);
      
      try {
        query.find().then(queryData => {
          const res = this.formatResponse(queryData)[0];
          
          user.equalTo("objectId", res.seller);
          user.find().then(userData => {
            const { id, username, ratingAsSeller } = this.formatResponse(userData)[0];
            const rating = ratingAsSeller.length > 0 ? ratingAsSeller.reduce((a: number, b: number) => a + b) : 0;
            
            res.seller = {
              id,
              username,
              rating
            };

            observer.next(res);
          });
        });
        observer.next()
      } catch (error: any) {
        alert(`Failed to retrieve the object, with error code: ${error.message}`);
      };
    });
  };

  private formatResponse(res: any): any {
    for (let i = 0; i < res.length; i++) {
      res[i] = {
        id: <string>res[i].id,
        ...res[i].attributes
      };
    };
    
    return res;
  };
};
