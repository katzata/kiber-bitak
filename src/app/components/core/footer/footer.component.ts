import { Component, OnInit, ViewChild } from "@angular/core";
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
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
  animations: [
    trigger("footerToggle", [
      state("open", style({
        height: "105px"
      })),
      state("closed", style({
        height: "26px"
      })),
      transition("closed => open", animate("160ms ease-out")),
      transition("open => closed", animate("160ms ease-out"))
    ]),
    trigger("arrowToggle", [
      state("open", style({
        transform: "rotateZ(0deg)"
      })),
      state("closed", style({
        transform: "rotateZ(180deg)",
      }))
    ]),
  ]
})

export class FooterComponent implements OnInit {
  isOpen: boolean = false;
  offset: number = 0;
  @ViewChild("footerBottom") footerBottom: any;

  ngOnInit(): void {
    this.footerBottom = document.createElement("div");
  };

  ngAfterViewInit() {
    this.offset = this.footerBottom.nativeElement.offsetHeight;
  };

  get stateName() {
    return this.isOpen ? "open" : "closed";
  };

  toggle() {
    this.isOpen = !this.isOpen;
  };
};
