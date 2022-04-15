import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable} from 'rxjs';
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { Product } from 'src/app/components/shared/models/Product.model';
import { User } from 'src/app/components/shared/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  id: string = "";

  constructor(
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
  };

  getDetails(productId: string): Observable<any> {
    return new Observable(observer => {
      const query = new Parse.Query("Products");
      const user = new Parse.Query(Parse.User);
      
      query.get(productId).then(queryData => {
        const views = queryData.attributes["views"];
        
        queryData.set("views", views + 1);

        Promise.all([
          user.get(queryData.attributes["seller"].id),
          queryData.save()
        ]).then(values => {
          const [ user, product ] = values;

          const formated = this.formatResponse([product])[0];
          formated.seller = user;

          observer.next(formated);
        }).catch((err: any) => {
          this.errorService.httpError("details", err);
          observer.next(false);
        });
      });
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
