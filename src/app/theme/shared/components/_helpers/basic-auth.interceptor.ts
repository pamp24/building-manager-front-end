import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../service/authentication.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  private authenticationService = inject(AuthenticationService);

  //   intercept(request: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<string>> {
  //     // add auth header with jwt if user is logged in and request is to the api url
  //     const currentUser = this.authenticationService.currentUserValue;
  //     const isLoggedIn = currentUser && currentUser.serviceToken;
  //     const isApiUrl = request.url.startsWith(environment.apiUrl);
  //     if (isLoggedIn && isApiUrl) {
  //       request = request.clone({
  //         setHeaders: {
  //           Authorization: `Bearer ${currentUser.serviceToken}`
  //         }
  //       });
  //     }

  //     return next.handle(request);
  //   }
  // }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token'); // ✅ σωστή πηγή token
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        } 
      });
    }

    return next.handle(request);
  }
}
