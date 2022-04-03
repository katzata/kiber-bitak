import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class ParseService {
  test = Parse;
  constructor() {
    // Parse.initialize(environment.APP_ID, environment.JS_KEY);
    // (Parse as any).serverURL = "https://parseapi.back4app.com";

    // const test2 = Parse;
    // console.log(this.test, test2);
    
  };


}
