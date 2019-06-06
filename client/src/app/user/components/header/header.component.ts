import { Component, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { appName } from 'src/app/shared/app-config/global-config';
import { UserService } from 'src/app/user/services/user.service';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { ProductService } from '../../services/product.service';

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
	isRegisterAvailable: boolean = false;
  
	constructor(
		private _userService: UserService,
		private _drawerService: DrawerService,
		private _productService: ProductService
	) { }

	ngOnInit() {
		// set loggedIn attr
		this._userService.authStatus$.subscribe(
			(status) => this.loggedIn = status
		);

		// set isRegisterAvailable attr to show the login drawer button or not
		// this.isRegisterAvailable = this._userService.isRegisterAvailable();
		this._userService.isRegisterAvailable$.subscribe(
			(status) => this.isRegisterAvailable = status
		);
	}

	openMenu(){
		this._drawerService.openMenu();
	}





	ToConnectClicked(){
		this._drawerService.openLogin();

		// to not redirect user to product details if he already clicked on add to cart
		this._productService.setId(-1);
	}

}
