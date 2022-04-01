import { Component, OnInit, Input } from '@angular/core';
import { SectionResultsService } from './services/section-results.service';
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
  styles: [':host { width: 100%; heigh: 214px; }'],
  viewProviders: [HoverDirective]
})

export class SectionResultsComponent implements OnInit {
  results: Promise<Products[]> | null = null;
  arrived: boolean = false;
  resolve: Function | null = null;

  @Input() department: string = "";

  constructor(private sectionResultsService: SectionResultsService, public hoverDirective: HoverDirective) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    (Parse as any).serverURL = 'https://parseapi.back4app.com/';
    this.reset();
  };

  ngOnInit(): void {
    const test = {
      // department: "electronics"
    };

    this.getProducts(test);
  };

  reset(): any {
    this.arrived = false;
    this.results = new Promise<Products[]>((resolve, reject) => {
      this.resolve = resolve;
    });
  }

  getProducts(query?: any): any {
    const filteredQuery = {
      department: query && query.department,
      name: query && query.name,
      location: query && query.location,
      condition: query && query.condition,
      priceTo: query && query.priceTo,
      priceFrom: query && query.priceFrom,
      limit: query && query.limit,
      page: query && query.page
    };
    
    this.sectionResultsService.getItems(filteredQuery)
      .subscribe((data: Products[]) => {
        if (this.arrived) {
          this.reset();
        } else {
          this.resolve!(data);
          this.arrived = true;
        }
      });
  };
};