import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
	/**
	 * Creates an instance of interceptor service.
	 * @param _tokenService 
	 */
	constructor(public _tokenService: TokenService) {}
	








	/**
	 * Intercepts interceptor service
	 * @param request 
	 * @param next 
	 * @returns intercept 
	 */
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		
		// add token to the request
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${this._tokenService.get()}`
			}
		});
		
		//console.log("TokenInterceptorService => request = ", request);

		return next.handle(request);
	}
}
