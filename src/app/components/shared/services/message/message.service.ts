import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import * as Parse from 'parse';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  isVisible: boolean = false;
  modalStatus: Subject<boolean> = new Subject<boolean>();

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

  sendMessage(
      sender: string,
      recipient: string,
      messageText: any
    ): Observable<any> {
    return new Observable(observer => {
      console.log(sender, recipient, messageText);
      
      if (messageText.length < 1) {
        return this.errorService.formErrors("message", ["The message field can not be empty."]);
      };

      const Messages = Parse.Object.extend("Messages");
      const message = new Messages();

      message.set({
        sender: this.authService.userData()!.id,
        recipient: recipient,
        message: messageText.message
      });
      
      message.save()
        .then((data: any) => observer.next(true))
        .catch((err: any) => {
          this.errorService.httpError("message", err);
          observer.next(false);
        });
    });
  };

  getMail(id: string): Observable < any > {
      return new Observable(observer => {
        const inbox = new Parse.Query("Messages");
        inbox.equalTo("recipient", id);

        const sent = new Parse.Query("Messages");
        sent.equalTo("sender", id);

        Promise.all([
            inbox.find(), sent.find()
          ]).then((values) => {
            const formated = values.map((el: any) => this.formatResponse(el))
            observer.next(values);
        });
      });
  };

  handleStatus(res: any) {
    this.modalStatus.next(res);
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
