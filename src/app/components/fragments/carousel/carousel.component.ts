import { Component, AfterViewInit, Input } from '@angular/core';

interface IntStyle {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit {
  offset: number = 0;
  canToggle: boolean = false;
  carouselPosition: string = "relative";
  internalStyle: IntStyle = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };
  
  @Input() images: Array<string> = [];

  ngAfterViewInit(): void {
    this.initImages();
    this.handleCurrentDot();
  };

  initImages() {
    if (this.images.length === 0) {
      this.images = ["assets/svg/no-image.svg"];
    } else {
      this.canToggle = true;
    };
  };

  toggleSize() {
    const open = document.querySelector("#toggle-button") as HTMLElement;
    const close = document.querySelector("#close-carousel") as HTMLElement;
    const details = document.querySelector("#product-details") as HTMLElement;
    const page = document.querySelector("#content") as HTMLElement;
    const test = document.querySelector("#carousel-bg") as HTMLElement;

    if (this.carouselPosition === "relative") {
      this.carouselPosition = "static";
      close.style.display = "block";
      open.style.display = "none";
      page.style.overflowY = "hidden";
      details.style.overflow = "hidden";
      test.style.top = `${details.scrollTop}px`;
    } else {
      this.carouselPosition = "relative";
      close.style.display = "none";
      open.style.display = "block";
      page.style.overflowY = "auto";
      details.style.overflow = "auto";
      test.style.top = "0";
    };
    
    this.carouselInternalStyle(this.carouselPosition)
  };

  changeImage(dir: string) {
    if (dir === "next") {
      if (this.offset > (this.images.length - 1) * -1) {
        this.offset--;
        this.handleOffset();
        this.handleCurrentDot();
      };
    } else {
      if (this.offset < 0) {
        this.offset++;
        this.handleOffset();
        this.handleCurrentDot();
      };
    };
  };

  handleOffset() {
    Array.from(document.querySelectorAll("img"))
      .forEach((el: HTMLImageElement, idx) => {
        const calc = (this.offset * 120) + (idx * 120);
        el.style.transitionDuration = ".11s";
        el.style.transform = `translateX(${calc}vw)`;
      });
  };

  handleCurrentDot() {
    Array.from(document.querySelectorAll(".current-image-dot"))
      .forEach((el: any, idx) => {
        if (idx === Math.abs(this.offset)) {
          el.style.backgroundColor = "rgba(0, 0, 0, .86)";
          el.style.boxShadow = "0 0 1px 1px rgba(0, 0, 0, .8);";
        } else {
          el.style.backgroundColor = "rgba(255, 255, 255, .8)";
          el.style.boxShadow = "0 0 1px 1px rgba(255, 255, 255, .8);";
        }
      });
  };

  onTransitionEnd(index: number) {
    Array.from(document.querySelectorAll("img"))[index].style.transitionDuration = "0s";
  };

  carouselInternalStyle(currentState: string) {
    const states: any = {
      relative: {
        width: "100%",
        height: "100%"
      },
      static: {
        width: "88%",
        height: "88%"
      }
    };

    this.internalStyle = states[currentState];
   };
};