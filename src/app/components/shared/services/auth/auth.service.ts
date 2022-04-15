import { ErrorHandlingService } from "src/app/services/error-handling/error-handling.service";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable, Subject, throwError } from 'rxjs';
import { User } from "../../models/User.model";
import { Product } from "../../models/Product.model";

interface Res {
  status: boolean;
  message?: String | null;
}

interface UpdateData {
  email: string;
  username: string;
  messagesTo: string;
  messagesFrom: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged: boolean = false;
  userStatus: Subject<boolean> = new Subject<boolean>();

  constructor(
    private errorService: ErrorHandlingService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";

    this.userStatus.subscribe((value) => {
      this.isLogged = value;
    });

    this.init();
  };

  private init() {
    const status = Parse.User.current() !== null;
    this.handleStatus({ status: status });
  };

  register(data: any): Observable<Object> {
    return new Observable(observer => {
      const user = new Parse.User();

      user.set({
        username: data.username,
        email: data.email,
        password: data.password
      });

      user.save().then(data => observer.next(true))
        .catch(err => {
          this.errorService.httpError("register", err.message);
          observer.next(false);
        });
    });
  };

  login(data: any): Observable<Object> {
    return new Observable(observer => {
      (async () => {
        try {
          const user = await Parse.User.logIn(data.email, data.password);

          Parse.User.become(user.attributes["sessionToken"]).then(() => {
            // console.log(localStorage);
          }, (err: any) => {
            this.errorService.httpError("login", err);
            console.log("The token could not be validated." + err);
          });

          observer.next(user ? user : false);
        } catch (err: any) {
          this.errorService.httpError("login", err);
          observer.next(false);
        };
      })()
    });
  };

  logOut(): Observable<Object> {
    return new Observable(observer => {
      (async () => {
        try {
          Parse.User.logOut().then((data: any) => {
            observer.next(data);
          });
        } catch (err: any) {
          this.errorService.httpError("logout", err.message)
          observer.next();
        };
      })()
    });
  };

  checkOwnership(seller: User) {
    const user = Parse.User.current();
    return seller.id === user?.id;
  };

  update(id: string, data: UpdateData): Observable<any> {
    return new Observable(observer => {
      const user = new Parse.Query(Parse.User);
      console.log(data);
      
      user.get(id).then(fields => {
        const validInput = Object.entries(data).filter((el: [string, string]) => el[1] !== "");
        const changedInput = validInput.filter((el: [string, string]) => fields.attributes[el[0]] !== el[1]);
        
        if (changedInput.length > 0 && changedInput.length !== validInput.length) {
            changedInput.forEach((el: [string, any]) => {
              fields.set(...el);
            });

            fields.save()
              .then(() => observer.next(true))
              .catch(err => {
                this.errorService.httpError("edit", err.message);
                observer.next(false);
              });
        } else {
          this.errorService.formErrors("edit", ["No fields have been changed."]);
          observer.next(false);
        };
      }).catch(err => console.log(err));
    });
  };

  updateProducts(product: Product) {
    const user = Parse.User.current();
    const products = user?.get("products");

    const match = products.filter((el: any) => el.id === product.id)[0];

    if (match) {
      console.log("yay", match);
      products.splice(product, 1);
    } else {
      products.push(product);
    };

    user?.set("products", products);
  
    return user?.save();
  }

  handleStatus(res: Res) {
    const { status, message } = res;
    this.userStatus.next(status);
  };

  userData() {
    const user = Parse.User.current();

    if (user) {
      const formated = this.formatResponse([user])[0];
      formated.products = formated.products.map((el: any) => this.formatResponse([el])[0])
      
      return formated;
    };
    
    return null;
  };

  getUser(id: any) {
    const query = new Parse.Query(Parse.User);
    query.equalTo("objectId", id);
    return query.find();
  };

  userDataRaw(){
    return Parse.User.current();
  };

  getProducts() {
    const user = Parse.User.current();

    if (user) {
      const formated = this.formatResponse([user])[0];
      const products = formated.products
      
      return Parse.Object.fetchAll(products, {});
    } else {
      return Promise.reject("profile");
    };
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