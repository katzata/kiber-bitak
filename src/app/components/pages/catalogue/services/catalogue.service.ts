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
  itemsPerPage?: string;
};

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
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
    const { search, products, users, searchCriteria, sortCriteria, sortOrder, itemsPerPage } = query;

    return new Observable(observer => {
      if (query.users && query.products) {
        Promise.all([
          this.queryProducts(query),
          this.queryUsers(query)
        ]).then((values) => {
          const formated = values.map((el: any) => this.formatResponse(el)).flat();
          observer.next(formated);
        });
      } else if (query.products) {
        this.queryProducts(query)
          .then((data: any) => {
            observer.next(this.formatResponse(data));
          });
      } else if (query.users) {
        this.queryUsers(query)
          .then((data: any) => {
            observer.next(this.formatResponse(data));
          });
      };
    });
  };

  queryProducts(productQuery: any) {
    const query = new Parse.Query("Products");
    const pattern = new RegExp(productQuery.search, "i")
   
    query.matches("name", pattern);

    return query.find();
  };

  queryUsers(usersQuery: any) {
    const query = new Parse.Query(Parse.User);
    const pattern = new RegExp(usersQuery.search, "i");
    
    query.matches("username", pattern);

    return query.find();
  };

  private formatResponse(res: any): any {
    for (let i = 0; i < res.length; i++) {
      res[i] = {
        id: res[i].id,
        resType: res[i].className.toLocaleLowerCase(),
        ...res[i].attributes
      };
    };

    return res;
  };
};