import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    handleError(err: any) {
        // your custom error handling logic    
    }
}