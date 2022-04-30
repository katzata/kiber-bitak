import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from "src/app/services/error-handling/error-handling.service";
import * as Parse from "parse";

@Injectable({
  providedIn: 'root'
})
export class BuyProductService {

  constructor(
    private errorService: ErrorHandlingService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
  };

  getproduct(id: string) {
    const product = new Parse.Query("Products");
    return product.get(id);
  };

  processRequest(data: any) {

  };

  private sendRequest() {
    
  };
};