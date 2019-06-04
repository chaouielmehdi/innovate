import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { DrawerService } from '../../services/drawer.service';
import { appName } from 'src/app/shared/app-config/global-config';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	// -------------------------------------------------
	// General
	// -------------------------------------------------
	
	appName: string = appName;

	loggedIn: boolean = false;
  
	constructor(
		private _adminService: AdminService,
		private _drawerService: DrawerService
	) { }

	ngOnInit() {
		this._adminService.authStatus.subscribe(
			(status) => this.loggedIn = status
		);
	}

	openMenu(){
		this._drawerService.openMenu();
	}

}
