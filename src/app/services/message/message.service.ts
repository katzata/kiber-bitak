import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import * as Parse from 'parse';
import { AuthService } from '../../components/services/auth/auth.service';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  isVisible: boolean = false;
  modalStatus: Subject<boolean> = new Subject<boolean>();
  recipient: any;

  constructor(
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ) {
    Parse.initialize(environment.APP_ID, environment.JS_KEY);
    (Parse as any).serverURL = "https://parseapi.back4app.com";

    this.modalStatus.subscribe((value) => {
      this.isVisible = value;
    });

    this.handleStatus(true);
  };

  sendMessage(messageText: any): Observable<any> {
    return new Observable(observer => {
      if (messageText.length < 1) {
        return this.errorService.formErrors("message", ["The message field can not be empty."]);
      };
      
      this.authService.getUser(this.recipient.id).then((data: any) => {
        const Messages = Parse.Object.extend("Messages");
        const message = new Messages();

        message.set({
          senderId: this.authService.userData().id,
          senderUsername: this.authService.userData().username,
          recipientId: this.recipient.id,
          recipientUsername: data[0].get("username"),
          message: messageText.message
        });

        message.save()
          .then(() => {
            console.log("z");
            
            observer.next(true)})
          .catch((err: any) => {
            this.errorService.httpError("message", err);
            observer.next(false);
          });
      })
    });
  };

  getMail(): Observable < any > {
    return new Observable(observer => {
      const { id, username } = this.authService.userData()!;

      const inbox = new Parse.Query("Messages");
      inbox.equalTo("recipientId", id);

      const sent = new Parse.Query("Messages");
      sent.equalTo("senderId", id);

      Promise.all([
          inbox.find(),
          sent.find()
        ]).then((values) => {
          let [inbox, sent] = values;
          inbox = this.formatResponse(inbox);
          sent = this.formatResponse(sent);

          // values[0].map((el: any) => this.formatResponse(el));
          // values[1].map((el: any) => this.formatResponse(el));
          console.log(inbox, sent);
          
          // Promise.all([
          //   Parse.Object.fetchAll([...inbox], {}),
          //   Parse.Object.fetchAll([...sent], {})
          // ])
          // .then((el: any) => {
          //   console.log(el);
            
          // })
          // .catch((err: any) => console.log(err));
          // console.log(inbox.filter((a: any, b: any) => inbox.include(a.id) === b.id));
          
          // const formated = values.map((el: any) => this.formatResponse(el))
          observer.next(values);
      });
    });
  };

  handleUsernames(values: Array<any>) {
    const [inbox, sent] = values;
    const different = [[], []] as Array<any>;

    inbox.forEach((el: any) => {
      if (!different[0].includes(el.get("sender"))) {
        different[0].push(el.get("sender"));
      };
    });

    sent.forEach((el: any) => {
      if (!different[1].includes(el.get("recipient"))) {
        different[1].push(el.get("recipient"));
      };
    });
    
    return different;
  };

  handleStatus(status: boolean, recipient?: string) {
    this.recipient = recipient;
    this.modalStatus.next(status);
  };

  private formatResponse(res: any): any {
    for (let i = 0; i < res.length; i++) {
      res[i] = {
        id: res[i].id,
        ...res[i].attributes
      };
    };

    return res;
  };
};
