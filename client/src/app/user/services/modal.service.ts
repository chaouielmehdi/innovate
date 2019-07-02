import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  	providedIn: 'root'
})
export class ModalService {
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
	 * connectFirstModal
	 */
	connectFirstModal: boolean = false;

	@Output() loginEventEmitter: EventEmitter<boolean> = new EventEmitter();
	
	openLogin() {
		if(!this.loggedIn) {
			this.connectFirstModal = true;
			this.loginEventEmitter.emit(this.connectFirstModal);
		}
	}

	closeLogin() {
		this.connectFirstModal = false;
		this.loginEventEmitter.emit(this.connectFirstModal);
	}

}
