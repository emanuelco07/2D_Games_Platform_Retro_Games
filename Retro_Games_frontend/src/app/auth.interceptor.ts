import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor { 

  constructor(private authService: AuthService) {} //injectam AuthService

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      //obtinem token ul din AuthService
      const authToken = this.authService.getToken();

      //daca exista un token, il clonam pe request si adaugam antetul Authorization
      if (authToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}` //adaugam prefixul Bearer si token ul
          }
        });
      }

      //continuam cu cererea modificata (sau originala daca nu a existat vreun token)
      return next.handle(request);
  }
}