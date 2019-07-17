import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { userCreateUrl, userLoginUrl, userLogoutUrl, userRefreshURL, userGetURL, userUpdateURL, userAsyncValidateUrl, userRecoverUrl, userExistsUrl } from 'src/app/shared/app-config/URLs';
import { User } from 'src/app/shared/models/User';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { BackEndResponse } from 'src/app/shared/models/BackEndResponse';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
 	})
};

@Injectable({
	providedIn: 'root'
})
export class UserService {

	userAsyncValidateUrl: string = userAsyncValidateUrl
	userCreateUrl: string = userCreateUrl;
	userExistsUrl: string = userExistsUrl;
	userRecoverUrl: string = userRecoverUrl;

	userUpdateURL: string = userUpdateURL;

	userLoginUrl: string = userLoginUrl;
	userLogoutUrl: string = userLogoutUrl;
	userRefreshURL: string = userRefreshURL;

	userGetURL: string = userGetURL;

	// Holds the validation errors coming from the server
	errorResp: HttpErrorResponse = null;

	// Holds if the user is logged in or not
	private loggedIn = new BehaviorSubject<boolean>(this._tokenService.isTokenValid());
	authStatus$ = this.loggedIn.asObservable();
	
	/**
	 * Creates an instance of user service.
	 * @param http 
	 * @param router 
	 * @param messageService 
	 * @param _tokenService 
	 */
	constructor(
		private http: HttpClient,
		private router: Router,
		private messageService: NzMessageService,
		private _tokenService: TokenService
	) { }









	/**
	 * lightly validate a user form
	 * (backend only validation)
	 * (used to validate th form asynchronously)
	 * @param form 
	 * @returns response$
	 */
	lightlyValidate(form: FormGroup): Observable<BackEndResponse> {
		console.log(`userService => trying to lightlyValidate : `, form.value);
		
		return this.http.post(this.userAsyncValidateUrl, form.value, httpOptions).pipe(
			tap((formValidation) => console.log(`userService => lightlyValidate = `, formValidation)),
			catchError(this.handleError(`userService => form hasn't been lightlyValidated`, null))
		);
	}

	/**
	 * Registers server side
	 * @param form 
	 * @returns user$
	 */
	registerServer(form: FormGroup): Observable<User> {
		console.log(`userService => trying to registerServer : `, form.value);
		
		return this.http.post(this.userCreateUrl, form.value, httpOptions).pipe(
			tap((user: User) => console.log(`userService => registered user = `, user)),
			catchError(this.handleError(`userService => user not registered`, null))
		);
	}











	/**
	 * Logins server side
	 * @param form 
	 * @returns server$
	 */
	loginServer(form: FormGroup): Observable<User> {
		console.log(`userService => trying to loginServer : `, form.value);

		return this.http.post(this.userLoginUrl, form.value, httpOptions).pipe(
			tap((user: User) => console.log(`userService => logged user = `, user)),
			catchError(this.handleError(`userService => user not logged in`))
		);
	}
	
	/**
	 * Logins client side
	 * @param user 
	 */
	loginClient(user: User): void{
		this.router.navigateByUrl('/dashboard');

		this.messageService.info('Bienvenue chez vous!');

		this._tokenService.handle(user.access_token);

		this.changeAuthStatus(true);

		// set the user and statistics for menu in drawer-service
		
	}
	
	/**
	 * Changes auth status
	 * @param value 
	 */
	changeAuthStatus(value: boolean) {
		this.loggedIn.next(value);
	}









	/**
	 * Logouts server side
	 * @returns server$
	 */
	logoutServer(): Observable<BackEndResponse> {
		console.log(`userService => trying to logoutServer`);
		
		return this.http.get<BackEndResponse>(this.userLogoutUrl).pipe(
			tap((backEndResponse) => console.log(`userService => logoutServer = `, backEndResponse)),
			catchError(this.handleError(`userService => logoutServer`, null))
		);
	}

	/**
	 * Logouts client side
	 */
	logoutClient(): void {
		this.router.navigateByUrl('/home');

		this._tokenService.remove();

		this.changeAuthStatus(false);
	}










	/**
	 * userEmailExists server side
	 * @param form 
	 * @returns server$
	 */
	userEmailExists(form: FormGroup): Observable<BackEndResponse> {
		console.log(`userService => trying to userEmailExists : `, form.value);
		
		return this.http.post(this.userExistsUrl, form.value, httpOptions).pipe(
			tap((backEndResponse) => console.log(`userService => userEmailExists = `, backEndResponse)),
			catchError(this.handleError(`userService => userEmailExists`, null))
		);
	}

	/**
	 * recover server side
	 * @param form 
	 * @returns server$
	 */
	recover(form: FormGroup): Observable<BackEndResponse> {
		console.log(`userService => trying to recover : `, form.value);
		
		return this.http.post(this.userRecoverUrl, form.value, httpOptions).pipe(
			tap((backEndResponse) => console.log(`userService => recover = `, backEndResponse)),
			catchError(this.handleError(`userService => recover`, null))
		);
	}
	









	
	





	/**
	 * Gets user from server side
	 * @returns user$
	 */
	getUserServer(): Observable<User>{
		console.log(`userService => trying to getUser`);
		
		return this.http.get<User>(this.userGetURL).pipe(
				tap((user: User) => console.log(`userService => got user = `, user)),
				catchError(this.handleError(`userService => user not got`, null))
			);
	}













	/**
	 * Updates user service
	 * @param form 
	 * @returns user server 
	 */
	updateUserServer(form: FormGroup): Observable<User> {
		console.log("userService => trying to updateUserServer : ", form.value);
		
		return this.http.post(this.userUpdateURL, form.value, httpOptions).pipe(
			tap((user: User) => console.log(`userService => updated user = `, user)),
			//catchError()
			catchError(
				(err) => {
					console.log(err);
					
					return of(null);
				} 
			)
		);
	}








	/**
	 * Register-drawer <=> Register-form
	 * holding values
	 */
	email: string = '';
	password: string = '';

	// Holds if the Register page is available or not
	private isRegisterAvailableBehaviorSubject = new BehaviorSubject<boolean>(this.email !== '' && this.password !== '');
	isRegisterAvailable$ = this.isRegisterAvailableBehaviorSubject.asObservable();

	/**
	 * change isRegisterAvailable
	 * @param value 
	 */
	changeIsRegisterAvailable(value: boolean) {
		this.isRegisterAvailableBehaviorSubject.next(value);
	}

	setEmailPassword(email: string, password: string): void{
		this.email = email;
		this.password = password;
	}

	getEmailPassword(): {email: string, password: string}{
		return {email: this.email, password: this.password};
	}
	
	





	
	/**
	 * Gets error response
	 * @returns error response 
	 */
	public getErrorResponse(): HttpErrorResponse{
		return this.errorResp;
	}
	
	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
		return (error: HttpErrorResponse): Observable<T> => {

			console.error(`\n ${operation} failed : ${error.message}`);

			this.errorResp = error;

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

}
