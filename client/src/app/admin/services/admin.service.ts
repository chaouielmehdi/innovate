import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { createAdminUrl, loginAdminUrl, logoutAdminUrl, refreshAdminUrl, getAdminUrl, updateAdminUrl } from 'src/app/shared/app-config/URLs';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Admin } from 'src/app/shared/models/Admin';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
 	})
};

@Injectable({
	providedIn: 'root'
})
export class AdminService {
	createAdminUrl:	 string = createAdminUrl;
	loginAdminUrl:	 string = loginAdminUrl;
	logoutAdminUrl:	 string = logoutAdminUrl;
	updateAdminUrl:	 string = updateAdminUrl;
	refreshAdminUrl: string = refreshAdminUrl;
	getAdminUrl:	 string = getAdminUrl;
	
	// Holds the validation errors coming from the server
	errorResp: HttpErrorResponse = null;

	// Holds if the admin is logged in or not
	private loggedIn = new BehaviorSubject<boolean>(this._tokenService.isTokenValid());
	authStatus = this.loggedIn.asObservable();
	
	/**
	 * Creates an instance of admin service.
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
	 * Logins the server side
	 * @param form 
	 * @returns admin$
	 */
	loginServer(form: FormGroup): Observable<Admin> {
		console.log(`adminService => trying to loginServer : `, form.value);

		return this.http.post(this.loginAdminUrl, form.value, httpOptions).pipe(
			tap((admin: Admin) => console.log(`adminService => logged admin = `, admin)),
			catchError(this.handleError(`adminService => admin not logged in`, null))
		);
	}
	
	/**
	 * Logins client side
	 * @param admin 
	 */
	loginClient(admin: Admin): void{

		this.router.navigateByUrl('/admin/dashboard');

		this.messageService.info('Bienvenue chez vous!');
		
		this._tokenService.handle(admin.access_token);

		this.changeAuthStatus(true);
	}

	/**
	 * Changes auth status
	 * @param value 
	 */
	changeAuthStatus(value) {
		this.loggedIn.next(value);
	}
	
	









	/**
	 * Logouts server side
	 * @returns admin$
	 */
	logoutServer(): Observable<Admin> {
		console.log(`adminService => trying to logoutServer`);

		return this.http.get(this.logoutAdminUrl).pipe(
			tap((admin: Admin) => console.log(`adminService => logout admin = `, admin)),
			catchError(this.handleError(`adminService => admin not logout`, null))
		);
	}


	/**
	 * Logouts client side
	 */
	logoutClient() {
		this._tokenService.remove();

		this.changeAuthStatus(false);

		this.router.navigateByUrl('/admin/login');
	}












	/**
	 * Registers server side
	 * @param form 
	 * @returns admin$
	 */
	registerServer(form: FormGroup): Observable<Admin> {
		console.log(`adminService => trying to registerServer : `, form.value);
		
		return this.http.post(this.createAdminUrl, form.value, httpOptions).pipe(
			tap((admin: Admin) => console.log(`adminService => registered admin = `, admin)),
			catchError(this.handleError(`adminService => admin not registered`, null))
		);
	}










	/**
	 * Gets admin
	 * @returns admin$
	 */
	getAdminServer(): Observable<Admin>{
		console.log(`adminService => trying to getAdmin`);
		
		return this.http.get<Admin>(this.getAdminUrl).pipe(
				tap((admin: Admin) => console.log(`adminService => got admin = `, admin)),
				catchError(this.handleError(`adminService => admin not got`, null))
			);
	}










	/**
	 * Updates admin server side
	 * @param form 
	 * @returns  
	 */
	updateAdminServer(form: FormGroup): Observable<Admin> {
		console.log("adminService => trying to updateAdminServer : ", form.value);
		
		return this.http.put(this.updateAdminUrl, form.value, httpOptions).pipe(
			tap((admin: Admin) => console.log(`adminService => updated admin = `, admin)),
			catchError(this.handleError(`adminService => admin not updated`, null))
		);
	}
	










	/**
	 * holding values between
	 * Register-drawer & Register-form component
	 */
	email: string = '';
	password: string = '';

	/**
	 * Sets email password
	 * @param email 
	 * @param password 
	 */
	setEmailPassword(email: string, password: string): void{
		this.email = email;
		this.password = password;
	}
	
	/**
	 * Gets email password
	 * @returns email password 
	 */
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
