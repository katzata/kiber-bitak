import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Parse from 'parse';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/shared/services/auth.service';

interface data {
  department: string,
  name: string,
  condition: string,
  price: number,
  quantity: number,
  location: string,
  photos: Array<String>,
  description: string,
  owner: string
}

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

  addItem(data: any): Observable<Object> {
    // if (data.imageData && data.imageData.length > 0) {
    //   data.imageData = this.formatImageData(data.imageData);
    // };

    return new Observable(observer => {
      // if (data.imageData.length > 0) {
        // this.uploadImages(data.imageData);
      // }
      const product = new Parse.Object("Products");
      product.set({
        department: data.department,
        name: data.name,
        condition: data.condition,
        price: data.price,
        quantity: data.quantity,
        location: data.location,
        photos: ['https://m.media-amazon.com/images/M/MV5BM2ZiZTk1OD…kEyXkFqcGdeQXVyMTE2MzA3MDM@._V1_FMjpg_UX1000_.jpg', 'https://image.posterlounge.com/images/l/1886118.jpg'],
        description: data.description,
        seller: this.authService.userData()!.id
      });
      
      try {
        product.save().then(data => observer.next(data));
      } catch (error: any) {
        alert(`Failed to retrieve the object, with error code: ${error.message}`);
      };
    });
  };

  private async uploadImages(images: Array<any>) {
    const urls: any = [];

    for (const image of images) {
      console.log(image.name);
      
      const file = new Parse.File(image.name, image);

      try {
        file.save().then((res) => {
          urls.push(res);

          if (urls.length === images.length) {
            return urls;
          };
        });
      } catch (err) {
        console.log(err);
        return;
      };
    };
  };
  
  formatImageData(data: Array<string>) {
    return data.map((el: any) => {
      const { name, data } = el;
      const [mime, b64] = data.split(";");

      return {
        name,
        type: mime.split(":")[1],
        base64: b64.split(",")[1]
      };
    });
  };
}
