import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../shared/services/message/message.service';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrls: ['./mail-box.component.css']
})
export class MailBoxComponent implements OnInit {
  inbox!: any;
  sent!: any;

  constructor(
      private messageService: MessageService,
      private authService: AuthService
    ) {
    this.messageService.getMail()
      .subscribe((data: any) => {
        const [inbox, sent] = data;
        console.log(sent);
        
        this.inbox = inbox;
        this.sent = sent;            
      });
    };

  ngOnInit(): void {
  };

  toggleMessage(index: number, section: string) {
    let inbox = document.querySelectorAll(".inbox-message") as NodeListOf<HTMLDivElement>;
    let sent = document.querySelectorAll(".sent-message") as NodeListOf<HTMLDivElement>;

    const messages = section === "sent" ? sent : inbox;

    for (let i = 0; i < messages.length; i++) {
      if (i === index) {
        if (messages[i].dataset["status"] === "closed") {
          messages[i].dataset["status"] = "open";
          // messages[i].style.height = "100%";
          messages[i].style.overflow = "visible";
          messages[i].style.zIndex = "99999999";
        } else {
          messages[i].dataset["status"] = "closed";
          // messages[i].style.height = "46px";
          messages[i].style.overflow = "hidden";
          messages[i].style.zIndex = "0";
        };
      } else {
        messages[i].dataset["status"] = "closed";
        // messages[i].style.height = "46px";
        messages[i].style.overflow = "hidden";
        messages[i].style.zIndex = "0";
      };
    };
  };
};