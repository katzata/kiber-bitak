import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable } from 'rxjs';

interface SearchQuery {
  search: string;
  products: boolean,
  users: boolean,
  searchCriteria: string;
  sortCriteria: string;
  department?: string;
  condition?: string;
};


@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  observable: any;

  constructor() {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
  };

  getByDepartment(department: string) {
    return new Observable(observer => {
      const query = new Parse.Query("Products");
      
      try {
        query.find().then(data => {
          const result = this.formatResponse(data);
          observer.next(result);
        });
      } catch (error: any) {
        alert(`Failed to retrieve the object, with error code: ${error.message}`);
      };
    });
  };

  getItems(): any {
    return new Observable(observer => {
      const query = new Parse.Query("Products");

      try {
        query.find().then(data => {
          const result = this.formatResponse(data);
          observer.next(result);
        });
      } catch (error: any) {
        alert(`Failed to retrieve the object, with error code: ${error.message}`);
      };
    });
  };

  search(query: SearchQuery) {
    const { search, products, users, searchCriteria, sortCriteria } = query;

    console.log(query);

    return new Observable(observer => {
      if (search.length < 3) {
        return observer.next([]);
      };

      if (query.products && query.users) {
        this.queryProducts(query).then(data => {
          observer.next(data);
        });
      };

      if (query.products) {
        this.queryProducts(query).then(data => {
          console.log(data);
          observer.next(data);
        });
      };

      // if (query.users) {
      //   this.queryUsers(query).then(data => {
      //     observer.next(data);
      //   });
      // };


      /* const query = new Parse.Query("Products");
      
      if (products) {
        query.contains("name", search);
      }

      if (sortCriteria === "ascending") query.ascending(search);
      if (sortCriteria === "descending") query.descending(search);
      
      try {
        query.find().then(data => {
          const result = this.formatResponse(data);
          observer.next(result);
        });
      } catch (error: any) {
        alert(`Failed to retrieve the object, with error code: ${error.message}`);
      }; */
    });
  };

  queryProducts(productQuery: any) {
    const { search, products, users, searchCriteria, sortCriteria } = productQuery;
    const query = new Parse.Query("Products");
   
    query.contains("name", search);
    query.limit(2);

    if (sortCriteria === "ascending") query.ascending(search);
    if (sortCriteria === "descending") query.descending(search);


    try {
      return query.find();
    } catch (err: any) {
      throw new Error("Failed to retrieve the object: " + err);
    };
  };

  queryUsers(usersQuery: object) {
    // const query = new Parse.Query("User");

    // if (products) {
    //   query.contains(searchCriteria, search);
    // };

    // if (sortCriteria === "ascending") query.ascending(search);
    // if (sortCriteria === "descending") query.descending(search);

    // try {
    //   query.find().then(data => {
    //     return this.formatResponse(data);
    //   });
    // } catch (error: any) {
    //   alert(`Failed to retrieve the object, with error code: ${error.message}`);
    // };
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