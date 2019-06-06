import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { createUserUrl, loginUserUrl, logoutUserUrl, refreshUserUrl, getUserUrl, updateUserUrl, createUserLogoUrl } from 'src/app/shared/app-config/URLs';
import { User } from 'src/app/shared/models/User';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
 	})
};

@Injectable({
	providedIn: 'root'
})
export class UserService {
	
	createUserUrl: string = createUserUrl;

	updateUserUrl: string = updateUserUrl;

	loginUserUrl: string = loginUserUrl;
	logoutUserUrl: string = logoutUserUrl;
	refreshUserUrl: string = refreshUserUrl;

	getUserUrl: string = getUserUrl;

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
	 * Logins server side
	 * @param form 
	 * @returns server$
	 */
	loginServer(form: FormGroup): Observable<User> {
		console.log(`userService => trying to loginServer : `, form.value);

		return this.http.post(this.loginUserUrl, form.value, httpOptions).pipe(
			tap((user: User) => console.log(`userService => logged user = `, user)),
			catchError(this.handleError(`userService => user not logged in`, null))
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
	logoutServer(): Observable<User> {
		console.log(`userService => trying to logoutServer`);

		return this.http.get(this.logoutUserUrl).pipe(
			tap((user: User) => console.log(`userService => logout user = `, user)),
			catchError(this.handleError(`userService => user not logout`, null))
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
	 * Registers server side
	 * @param form 
	 * @returns server$
	 */
	registerServer(form: FormGroup): Observable<User> {
		console.log(`userService => trying to registerServer : `, form.value);
		
		return this.http.post(this.createUserUrl, form.value, httpOptions).pipe(
			tap((user: User) => console.log(`userService => registered user = `, user)),
			catchError(this.handleError(`userService => user not registered`, null))
		);
	}


	
	





	/**
	 * Gets user from server side
	 * @returns user$
	 */
	getUserServer(): Observable<User>{
		console.log(`userService => trying to getUser`);
		
		return this.http.get<User>(this.getUserUrl).pipe(
				tap((user: User) => console.log(`userService => got user = `, user)),
				catchError(this.handleError(`userService => user not got`, null))
			);
	}

	







	



	/**
	 * Updates user server
	 * @param form 
	 * @returns  
	 */
	updateUserServer(form: FormGroup) {
		console.log("userService => trying to updateUserServer : ", form.value);
		
		return this.http.put(this.updateUserUrl, form.value, httpOptions).pipe(
			tap((user: User) => console.log(`userService => updated user = `, user)),
			catchError(this.handleError(`userService => user not updated`, null))
		);
	}






	

	/**
	 * Register-drawer <=> Register-form
	 * holding values
	 */
	email: string = 'mehdi.mc60@gmail.comm';
	password: string = 'mehdii';

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
