import { Directive } from '@angular/core';
import * as internal from 'stream';

@Directive({
  selector: '[appSectionResults]'
})
export class HoverDirective {
  interval: any;
  difference: number = 0;
  offset: number = 0;
  title: any;
  slideDir: string = "forward";
  constructor() { }

  public focusResult(target: any, index: number) {
    target!.style.zIndex = "5";
    target!.style.boxShadow = "0 0 6px 3px black";

    // const container: any = document.querySelectorAll(".main-info")[index];
    // const title: any = document.querySelectorAll(".main-info h3")[index];
    // const containerWidth: number = container.offsetWidth;
    // const titleWidth: number = title.offsetWidth;

    // if (containerWidth - titleWidth < -5) {
    //   this.difference = Math.abs(containerWidth - titleWidth);
    //   this.interval = setInterval(this.textSlide, 1300);
    // }
  }

  public unFocusResult(target: any, index: number) {
    target!.style.zIndex = index;
    target!.style.boxShadow = "initial";
  }
}
