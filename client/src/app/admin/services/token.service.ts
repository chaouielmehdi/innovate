import { Injectable } from '@angular/core';
import { createUserUrl, loginUserUrl } from 'src/app/shared/app-config/consts';

@Injectable({
  	providedIn: 'root'
})

export class TokenService {

	createUserUrl: string = createUserUrl;
	loginUserUrl: string = loginUserUrl;

	iss: string[] = [this.createUserUrl, this.loginUserUrl];

	/**
	 * Creates an instance of token service.
	 */
	constructor() { }


	/**
	 * Handles token service
	 * @param token 
	 */
	handle(token: string): void{
		this.set(token);

		console.log(this.isTokenValid());
	}


	/**
	 * Sets token in the local storage
	 * @param token 
	 */
	set(token: string) {
		localStorage.setItem('aToken', token);
	}

	/**
	 * Gets token service
	 * @returns token 
	 */
	get(): string{
		return localStorage.getItem('aToken');
	}

	/**
	 * Removes token from local storage
	 */
	remove(): void{
		localStorage.removeItem('aToken');
	}

	/**
	 * Determines whether token is valid or not
	 * @returns
	 */
	isTokenValid(): boolean{
		const token = this.get();
		
		if(token) {
			const payload = this.payload(token);
			
			if(payload) {
				return this.iss.indexOf(payload.iss) > -1;
			}
		}
	}

	/**
	 * Payloads token service
	 * @param token
	 * @returns payload decoded
	 */
	payload(token): any {
		const payload = token.split('.')[1];

		return this.decode(payload);
	}


	/**
	 * Decodes token service
	 * @param payload 
	 * @returns  
	 */
	decode(payload) {
		return JSON.parse(atob(payload));
	}
	
}