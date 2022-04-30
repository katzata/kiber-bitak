import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatResponse'
})
export class FormatResponsePipe implements PipeTransform {

  transform(res: Array<any>) {
    console.log("xzxzxz", res);
    for (let i = 0; i < res.length; i++) {
      res[i] = {
        id: res[i].id,
        resType: res[i].className.toLocaleLowerCase(),
        ...res[i].attributes
      };
    };

    return res;
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