import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable } from 'rxjs';

interface SearchQuery {
  search: string;
  department?: string;
  condition?: string;
  price?: number;
  location?: string;
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
    const { search, department } = query;

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