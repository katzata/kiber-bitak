import { Component, OnInit } from '@angular/core';
import { CatalogueService } from './services/catalogue.service';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';

interface Products {
  [key: string]: any
};

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  providers: [CatalogueService],
  styleUrls: ['./catalogue.component.css'],
})

export class CatalogueComponent implements OnInit {
  results: Promise<Products[]> | null = null;
  latest: Promise<any> | null = null;
  ready: boolean = false;
  resolve: Function|null = null;
  
  constructor(private catalogueService: CatalogueService) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    (Parse as any).serverURL = 'https://parseapi.back4app.com/';
    // this.reset();
  };

  ngOnInit(): void {
    // this.getProducts();
  };

  reset(): any {
    this.ready = false;
    this.results = new Promise<Products[]>((resolve, reject) => {
      this.resolve = resolve;
    });
  }

  getProducts(): any {
    this.catalogueService.getItems()
      .subscribe((data: Products[]) => {
        console.log(data);
        
        if (this.ready) {
          this.reset();
        } else {
          this.resolve!(data);
          this.ready = true;
        }
      });
  };

  handleSubmit = () => {
    // const user = new Parse.User();
    // user.set("username", "test username");
    // user.set("email", "test asd@asd.asd");
    // user.set("password", "test password");
    // user.set("rememberMe", "test rememberMe");

    // user.signUp(null).then(
    //   function (user: any) {
    //     alert('User created successfully with email: ' + user.get("email"));
    //   },

    //   function (error: any) {
    //     alert("Error " + error.code + ": " + error.message);
    //   }
    // );
  };
}
