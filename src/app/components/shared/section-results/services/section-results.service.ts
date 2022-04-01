import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable } from 'rxjs';
import { parse } from 'path';

@Injectable()
export class SectionResultsService {
  testUrl = "https://parseapi.back4app.com/";
  observable: any;

  constructor() {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
  }

  ngOnInit(): void {
    // this.observable = new Observable(observer => {
    //     Parse.Cloud.run("hello");
    // });

    // const query = new Parse.Query(GameScore);
    // query.equalTo("playerName", "Dan Stemkoski");
    // const results = await query.find();
  }

  getItems(query: any): any {
    return new Observable(observer => {
      try {
        // query.find().then(data => {
        //   const result = this.formatResponse(data);
        //   observer.next(result);
        // });
        this.handleQuery(query).then((data: any) => {
          const result = this.formatResponse(data);
          observer.next(result);
        });
      } catch (error: any) {
        alert(`Failed to retrieve the object, with error code: ${error.message}`);
      };
    });
  };

  private handleQuery(query: any) {
    // const test = [query.name, query.location, query.condition, query.priceTo, query.priceFrom, query.limit, query.page];
    const departments = ["electronics", "sports", "clothes", "vehicles"];
    const parseQuery = new Parse.Query("Products");
    parseQuery.notEqualTo("isSold", true);

    if (query.department && departments.indexOf(query.department) > -1) {
      parseQuery.equalTo("department", query.department);
    };

    // if (query.condition) {
    //   parseQuery.equalTo("condition", query.condition);
    // }
    parseQuery.descending("createdAt");
    parseQuery.limit(5);
    return parseQuery.find();
  };

  // addItem(): any {
  //   return new Observable(observer => {
  //     const product = new Parse.Object("Products");
  //     product.set({
  //       condition: "new",
  //       department: "test department",
  //       description: "some description",
  //       isSold: false,
  //       location: "sofia",
  //       moreInfo: "some more info",
  //       name: "test entry 1",
  //       owner: "test user",
  //       photos: ['https://m.media-amazon.com/images/M/MV5BM2ZiZTk1OD…kEyXkFqcGdeQXVyMTE2MzA3MDM@._V1_FMjpg_UX1000_.jpg', 'https://image.posterlounge.com/images/l/1886118.jpg'],
  //       price: 123,
  //       quantity: 321,
  //       views: 1
  //     });

  //     try {
  //       product.save().then(data => observer.next(data));
  //       // const name = person.get("name");
  //       // const age = person.get("age");

  //     } catch (error: any) {
  //       alert(`Failed to retrieve the object, with error code: ${error.message}`);
  //     };
  //   });
  // };

  private formatResponse(res: any): any {
    for (let i = 0; i < res.length; i++) {
      res[i] = {
        id: <string>res[i].id,
        ...res[i].attributes
      };
    };

    return res.reverse();
  };
};