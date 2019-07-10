import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Admin } from 'src/app/shared/models/Admin';
import { DrawerService } from '../../services/drawer.service';

@Component({
	selector: 'app-drawers',
	templateUrl: './drawers.component.html',
	styleUrls: ['./drawers.component.css']
})
export class DrawersComponent implements OnInit {

	constructor(
		private router: Router,
		private _adminService: AdminService,
		private _drawerService: DrawerService
	) { }

	ngOnInit() {
		// menu Drawer
		this._drawerService.menuEventEmitter.subscribe(visibleMenu => {
			this.visibleMenu = visibleMenu;
		});

		// Get Admin
		this.getAdmin();
	}









	/*
	-------------------------------------------------
	Admin
	-------------------------------------------------
	*/

	// Admin attr
	admin: Admin = new Admin();

	// Get Admin
	getAdmin() {
		this._adminService.getAdminServer().subscribe(
			(admin) => {
				if(admin != null){
					this.admin = new Admin(
						admin.id,
						admin.name,
						admin.email,
						admin.password,
						admin.phone,
						admin.email_verified_at,
						admin.logoUrl,
						admin.access_token,
						admin.created_at,
						admin.updated_at
					);
				}
				else {
					this.admin = new Admin();
				}
				
			},
			(error) => {
				this.admin = new Admin();
				console.log("error : ", error);
			});
	}









	// -------------------------------------------------
	// Menu Drawer
	// -------------------------------------------------

	visibleMenu = false;

	openMenu(): void {
		this.visibleMenu = true;
	}
	
	closeMenu(): void {
		this.visibleMenu = false;
	}
	
	toSettings(){
		this.closeMenu();
		this.router.navigateByUrl('/admin/settings');
	}

	logout() {
		this.closeMenu();
		this._adminService.logoutClient();
	}

	menuItemClicked(){
		this.closeMenu();
	}




}
