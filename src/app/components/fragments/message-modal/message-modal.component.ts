import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MessageService } from "../../shared/services/message/message.service";
import { AuthService } from "../../shared/services/auth/auth.service";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

@Component({
  selector: "app-message-modal",
  templateUrl: "./message-modal.component.html",
  styleUrls: ["./message-modal.component.css"],
  animations: [
    trigger("displayModal", [
      state("visible", style({
        zIndex: "1",
        opacity: "1"
      })),
      state("hidden", style({
        zIndex: "-1",
        opacity: "0"
      })),
      transition("hidden => visible", [
        animate(".1s ease-out", keyframes([
          style({ zIndex: "1", offset: 0 }),
          style({ opacity: "1", offset: 1 })
        ])),
      ]),
      transition("visible => hidden", [
        animate(".1s ease-in", keyframes([
          style({ opacity: "0", offset: .6 }),
          style({ zIndex: "-1", offset: 1 }),
        ])),
      ])
    ])
  ]
})
export class MessageModalComponent {
  modalState: string = "hidden";
  submitBlocked: boolean = false;
  
  @Input() recipient!: string;
  recipient2: string | undefined;

  messageForm = this.formBuilder.group({
    to: new FormControl("", [Validators.required]),
    message: new FormControl("", [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.messageService.modalStatus.subscribe((value) => {
      this.modalState = value ? "visible" : "hidden";
    });
  };

  onSubmit() {
    this.submitBlocked = true;

    this.messageService.sendMessage(this.messageForm.value)
      .subscribe(() => {
        this.toggleVisibility();
        this.submitBlocked = false;
      });
  };

  toggleVisibility(recipient?: string) {
    this.messageService.handleStatus(false, recipient);
  };
};