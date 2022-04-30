import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css'],
  animations: [
    trigger("textFade", [
      state("true", style({
        maxHeight: "100vh",
        transform: "scaleY(1)"
      })),
      state("false", style({
        maxHeight: "0vh",
        transform: "scaleY(0)"
      })),
      transition("false => true", [
        animate(".13s ease-out", keyframes([
          style({ maxHeight: "0", offset: 0 }),
          style({ transform: "scaleY(0)", offset: 0.4 }),
          style({ maxHeight: "101px", offset: 0.499 }),
          style({ maxHeight: "100vh", offset: 0.5 }),
          style({ transform: "scaleY(1)", offset: 1 })
        ])),
      ]),
      transition("true => false", [
        animate(".13s ease-out",
          keyframes([
            style({ transform: "scaleY(1)", offset: 0 }),
            style({ maxHeight: "100vh", offset: 0.5 }),
            style({ transform: "scaleY(0)", offset: 0.6 }),
            style({ maxHeight: "0vh", offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class NotFoundPageComponent implements OnInit {
  fadeState = "false";
  constructor() { }

  ngOnInit(): void {
  }
}
