import { Injectable, Output, EventEmitter } from '@angular/core';
import { AdminService } from './admin.service';

@Injectable({
 	providedIn: 'root'
})
export class DrawerService {
	
	loggedIn: boolean = false;

	/**
	 * Creates an instance of drawer service.
	 * @param _adminService 
	 */
	constructor(
		private _adminService: AdminService
	)
	{
		this._adminService.authStatus.subscribe(
			(status) => this.loggedIn = status
		);
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
