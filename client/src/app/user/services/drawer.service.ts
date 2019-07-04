import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
 	providedIn: 'root'
})
export class DrawerService {
	
	loggedIn: boolean = false;
	
	/**
	 * Creates an instance of drawer service.
	 * @param _userService 
	 */
	constructor(
		private _userService: UserService
	)
	{
		this._userService.authStatus$.subscribe(
			(status) => this.loggedIn = status
		);
	}









	/**
	 * Login drawer service
	 */
	visibleLogin: boolean = false;

	@Output() loginEventEmitter: EventEmitter<boolean> = new EventEmitter();
	
	openLogin() {
		if(!this.loggedIn) {
			this.visibleLogin = true;
			this.loginEventEmitter.emit(this.visibleLogin);
		}
	}

	closeLogin() {
		this.visibleLogin = false;
		this.loginEventEmitter.emit(this.visibleLogin);
	}








	

	/**
	 * Register drawer service
	 */
	
	visibleRegister: boolean = false;

	@Output() registerEventEmitter: EventEmitter<boolean> = new EventEmitter();
	
	openRegister() {
		if(!this.loggedIn) {
			this.visibleRegister = true;
			this.registerEventEmitter.emit(this.visibleRegister);
		}
	}

	closeRegister() {
		this.visibleRegister = false;
		this.registerEventEmitter.emit(this.visibleRegister);
	}


	




	/**
	 * Menu drawer service
	 */
	
	visibleMenu: boolean = false;

	@Output() menuEventEmitter: EventEmitter<boolean> = new EventEmitter();
	
	openMenu() {
		if(this.loggedIn) {
			this.visibleMenu = true;
			this.menuEventEmitter.emit(this.visibleMenu);
		}
	}

	closeMenu() {
		this.visibleMenu = false;
		this.menuEventEmitter.emit(this.visibleMenu);
	}

}
