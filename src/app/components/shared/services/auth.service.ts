import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable, Subject } from 'rxjs';

interface Res {
  status: boolean;
  message?: String | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged: boolean = false;
  userStatus: Subject<boolean> = new Subject<boolean>();

  constructor() {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";

    this.userStatus.subscribe((value) => {
      this.isLogged = value;
    });

    this.init();
  };

  private init() {
    const status = Parse.User.current() !== null;
    // console.log(status);
    
    this.handleStatus({ status: status });
  };

  register(data: any): Observable<Object> {
    // if (data.imageData && data.imageData.length > 0) {
    //   data.imageData = this.formatImageData(data.imageData);
    // };

    return new Observable(observer => {
      const user = new Parse.User();
      user.set({
        username: data.username,
        email: data.email,
        password: data.password
      });

      try {
        user.save().then(data => observer.next(data));
      } catch (error: any) {
        console.log(`Failed to register user, with error code: ${error.message}`);
        observer.next(error.message)
      };
    });
  };

  login(data: any): Observable<Object> {
    return new Observable(observer => {
      (async () => {
        try {
          const user = await Parse.User.logIn(data.email, data.password);

          Parse.User.become(user.attributes["sessionToken"]).then(function (user) {
            console.log(localStorage);
            // The current user is now set to user.

          }, function (error) {
            console.log("The token could not be validated." + error);

            // The token could not be validated.
          });

          observer.next(user ? user : false);
        } catch (err: any) {
          console.log(err.message);
          observer.next(false);
        };
      })()
    });
  };

  logOut(): Observable<Object> {
    return new Observable(observer => {
      (async () => {
        try {
          Parse.User.logOut().then((data: any) => observer.next(data));
        } catch (err: any) {
          console.log(err.message);
          observer.next(err.message);
        };
      })()
    });
  };

  handleStatus(res: Res) {
    const { status, message } = res;
    // console.log(status, message);

    this.userStatus.next(status);
  };

  userData() {
    const user = Parse.User.current();

    if (user) {
      const data = user.attributes;
      
      // const { cart, email, messagesFrom, messagesTo, products, purchases, ratingAsBuyer, ratingAsSeller, sessionToken, username } = data.attributes;
      return {
        id: user.id,
        cart: data["cart"],
        email: data["email"],
        image: data["image"],
        messagesFrom: data["messagesFrom"],
        messagesTo: data["messagesTo"],
        products: data["products"],
        purchases: data["purchases"],
        ratingAsBuyer: data["ratingAsBuyer"],
        ratingAsSeller: data["ratingAsSeller"],
        sessionToken: data["sessionToken"],
        username: data["username"],
      };
    };
    
    return null;
  };
};