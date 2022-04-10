import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // refresh token
                } else {
                    // return throwError(error);
                }
                return throwError(error);
            })
        );
    }
};

/* Argument of type '(error: any) => Observable<never> | undefined' is not assignable to parameter of type '
(err: any, caught: Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>>) => ObservableInput<...>'.
    Type 'Observable<never> | undefined' is not assignable to type 'ObservableInput<any>'.
        Type 'undefined' is not assignable to type 'ObservableInput<any>'. */

