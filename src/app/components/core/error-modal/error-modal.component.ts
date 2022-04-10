import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ErrorHandlingService } from '../../../services/error-handling/error-handling.service';
import {
  trigger,
  query,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css'],
  animations: [
    trigger("displayErrors", [
      state("visible", style({
        transform: "translateY(calc(100% + 30px))"
      })),
      state("hidden", style({
        transform: "translateY(0px)"
      })),
      transition("hidden => visible", animate("120ms ease-out")),
      transition("visible => hidden", animate("120ms ease-in"))
    ])
  ]
})
export class ErrorModalComponent {
  isVisible: boolean = false;
  currentPath: string = "";
  
  @Input() errors: Array<string> = [];
  @ViewChild("modal") modal!: ElementRef;

  constructor(
    private errorService: ErrorHandlingService,
    private router: Router
  ) { 
    this.errorService.errors.subscribe((data: any) => {
      this.errors = data;
      this.toggleVisibility(true);
    });

    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => this.toggleVisibility(false));
  };

  toggleVisibility(state: boolean) {
    this.isVisible = state;
  };

  get stateName() {
    return this.isVisible ? "visible" : "hidden";
  };
};