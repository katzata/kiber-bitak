import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/shared/services/auth.service';
import { Product } from "../../../shared/models/Product.model";
import { Url } from 'url';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  observable: any;

  constructor(
    private authService: AuthService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";
  }

  addItem(data: Product): Observable<any> {
    return new Observable(observer => {
      if (data.imageData && data.imageData.length > 0) {
        this.uploadImages(data.imageData).then((urls: Array<any>) => {
          data.imageData = urls;
          console.log(data.imageData);
          
          this.saveProduct(data).then(res => observer.next());
        });
      } else {
        this.saveProduct(data).then(res => observer.next());
      };
    });
  };

  private async saveProduct(data: Product) {
    const Products = Parse.Object.extend("Products");
    const product = new Products();
    product.set({
      department: data.department,
      name: data.name,
      condition: data.condition,
      delivery: data.delivery,
      price: data.price,
      quantity: data.quantity,
      location: data.location,
      images: data.imageData ? data.imageData : [],
      description: data.description,
      seller: this.authService.userData()!.id
    });
    
    product.save().then((data: any) => {
      console.log(data);
      
    });
  }

  private async uploadImages(images: Array<any>) {
    const promises: Array<Parse.Object> = [];

    async function upload() {
      for (const item of images) {
        const name: string = formatImageNames();
        const file = new Parse.File(name, item);
        
        const Image = Parse.Object.extend("Images");
        const image = new Image();

        image.set("image", file);
        image.set("name", name);
        
        promises.push(image);
      };
      
      return Promise.all(
        promises.map((el: Parse.Object) => el.save())
      ).then((values) => {
        return values.map(el => el.attributes["image"]._url);
      });
    };

    return await upload();

    function formatImageNames() {
      const random = (multiplyer: number) => Math.floor(Math.random() * multiplyer);
      const ranges = [[48, 57], [65, 90], [97, 122]];
      const currentRange = ranges[random(3)]

      return [...Array(8).fill("*")]
        .map((el: string) => {
          const calc = currentRange[0] + random(currentRange[1] - currentRange[0]);
          return String.fromCharCode(calc);
        }).join("");
    };
  };
}
