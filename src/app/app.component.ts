import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  title = 'kiber-bitak';
  width: number = 17;

  @ViewChild("main") main!: ElementRef;

  ngAfterViewInit(): void {
    this.getScrollbarWidth();
  };

  private getScrollbarWidth() {
    const main = this.main.nativeElement;
    const calc: number = main.offsetWidth - main.clientWidth;

    main.style.width = `calc(100% + ${calc})`;

    const isChrome = (navigator.userAgent.indexOf("Chrome") != -1 && navigator.vendor.indexOf("Google Inc") != -1);
    const isFirefox = navigator.userAgent.indexOf("Firefox");
    
    if (!isChrome && !isFirefox) {
      main.style.paddingRight = `${calc}px`;
    };
  };
};