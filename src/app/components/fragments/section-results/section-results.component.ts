import { Component, OnInit, Input } from '@angular/core';
import { SectionResultsService } from '../../services/section-results-service/section-results.service';
import { HoverDirective } from './directives/hover.directive';
import { environment } from 'src/environments/environment';

import * as Parse from 'parse';
import {
  trigger,
  query,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

interface Products {
  [key: string]: any
};

@Component({
  selector: 'app-section-results',
  templateUrl: "section-results.component.html",
  styleUrls: ['./section-results.component.css'],
  viewProviders: [HoverDirective]
})

export class SectionResultsComponent implements OnInit {
  results: Array<any> = [];
  arrived: boolean = false;
  resolve: Function | null = null;

  constructor(
      private sectionResultsService: SectionResultsService,
      public hoverDirective: HoverDirective
    ) {
      Parse.initialize(environment.APP_ID, environment.JS_KEY);
      (Parse as any).serverURL = 'https://parseapi.back4app.com/';

      this.sectionResultsService.results.subscribe((response: any) => {
        this.results = response;
      });
    // this.reset();
  };

  ngOnInit(): void {
    const test = {
      // department: "electronics"
    };

    this.getProducts(test);
  };

  reset(): any {
    // this.arrived = false;
    // this.results = new Promise<Products[]>((resolve, reject) => {
    //   this.resolve = resolve;
    // });
  }

  getProducts(query?: any): any {
    this.sectionResultsService.getItems("filteredQuery")
    // this.sectionResultsService.getItems("filteredQuery")
      // .subscribe((data: Products[]) => {
      //   if (this.arrived) {
      //     this.reset();
      //   } else {
      //     this.resolve!(data);
      //     this.arrived = true;
      //   }
      // });
  };
};