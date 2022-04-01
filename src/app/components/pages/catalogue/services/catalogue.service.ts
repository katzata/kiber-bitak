import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable } from 'rxjs';

@Injectable()
export class CatalogueService {
    observable: any;

    constructor() {
        Parse.initialize(environment.APP_ID, environment.JS_KEY);
        (Parse as any).serverURL = "https://parseapi.back4app.com";
    }

    ngOnInit(): void {
        // this.observable = new Observable(observer => {
        //     Parse.Cloud.run("hello");
        // });
    }

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