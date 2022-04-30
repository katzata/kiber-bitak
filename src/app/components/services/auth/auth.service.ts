import { ErrorHandlingService } from "src/app/services/error-handling/error-handling.service";
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable, Subject, throwError } from 'rxjs';
import { User } from "../../../models/User.model";
import { Product } from "../../../models/Product.model";

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
    private router: Router,
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

  async register(data: any) {
      const user = new Parse.User();
      user.set({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password.trim()
      });

      return user.save()
        .then(() => {
          this.handleStatus({ status: true })
        })
        .catch(err => {
          this.errorService.httpError("register", err.message);
        });
  };

  async login(data: any) {
    const user = await Parse.User
      .logIn(data.email.trim(), data.password.trim())
      .catch((err: any) => this.errorService.httpError("login", err.message));

    return user && user.attributes ? this.become(user.attributes["sessionToken"]) : Promise.reject();
  };

  private async become(token: string) {
    const user = await Parse.User.become(token)
      .then(() => this.handleStatus({ status: true }))
      .catch((err: Error) => {
        this.errorService.httpError("register", err.message)
      });
  };

  logOut() {
    Parse.User.logOut()
      .then(() => {
        this.router.navigate(["/"]);
        this.handleStatus({ status: false });
      })
      .catch((err: Error) => {
        this.errorService.httpError("logout", err.message)
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

  async getProducts() {
    const user = Parse.User.current();
    const formated = this.formatResponse([user])[0];
    const products = formated.products;
    
    return Parse.Object.fetchAll(products, {});

  };

  async getSold() {
    const user = Parse.User.current();
    const sold = new Parse.Query("Sold");

    return sold
      .equalTo("seller", user)
      .find({});

    // return sold.find({});
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