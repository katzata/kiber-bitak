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
  sortOrder?: string;
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
    const { search, products, users, searchCriteria, sortCriteria, sortOrder } = query;
    const resultsLimit = 10;

    return new Observable(observer => {
      if (search.length < 3) {
        return observer.next([]);
      };

      if (query.products && query.users) {
        Promise.all([
          this.queryProducts(query, resultsLimit),
          this.queryUsers(query, resultsLimit)
        ]).then((values) => {
          
          const formated = values.map(this.formatResponse);
          const merged = this.mergeQueries(formated, sortOrder!);
          
          observer.next(merged);
        });
        // this.queryProducts(query, 1).then(data => {
        //   observer.next(this.formatResponse(data));
        // });

        // this.queryUsers(query, 1).then(data => {
        //   observer.next(this.formatResponse(data));
        // });
        return;
      };

      if (query.products) {
        this.queryProducts(query, resultsLimit).then(data => {
          observer.next(this.formatResponse(data));
        });
      };

      // if (query.users) {
      //   this.queryUsers(query).then(data => {
      //     observer.next(data);
      //   });
      // };
    });
  };

  queryProducts(productQuery: any, limit: number) {
    const { search, products, users, searchCriteria, sortCriteria } = productQuery;
    const query = new Parse.Query("Products");
    const pattern = new RegExp(search, "i")
   
    query.matches("name", pattern);
    query.limit(limit);

    if (sortCriteria === "ascending") query.ascending(search);
    if (sortCriteria === "descending") query.descending(search);

    return query.find();
  };

  queryUsers(usersQuery: any, limit: number) {
    const { search, products, users, searchCriteria, sortCriteria } = usersQuery;
    const query = new Parse.Query(Parse.User);
    const pattern = new RegExp(search, "i")
    
    query.matches("username", pattern);
    query.limit(limit);

    if (sortCriteria === "ascending") {
      query.ascending(searchCriteria === "name" ? search : "price")
    };

    if (sortCriteria === "descending") {
      query.descending(searchCriteria === "name" ? search : "price")
    };


    try {
      return query.find();
    } catch (err: any) {
      throw new Error("Failed to retrieve the object: " + err);
    };
  };

  mergeQueries(queries: Array<object>, sortOrder: string) {
    let merged = queries.flat();


    if (sortOrder !== "unsorted") {
      merged.sort((a: any, b: any) => {
        const t1 = (a.name || a.username).toUpperCase();
        const t2 = (b.name || b.username).toUpperCase();

        return sortOrder === "ascending" ? t1.localeCompare(t2) : t2.localeCompare(t1);
      });
    };
    
    return merged;
  };

  private formatResponse(res: any): any {
    for (let i = 0; i < res.length; i++) {
      res[i] = {
        id: res[i].id,
        resType: res[i].attributes.hasOwnProperty("username") ? "user" : "product",
        ...res[i].attributes
      };
    };

    return res;
  };
};