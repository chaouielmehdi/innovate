import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin/services/admin.service';
import { DrawerService } from 'src/app/admin/services/drawer.service';
import { Admin } from 'src/app/shared/models/Admin';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	constructor(
		private router: Router,
		private message: NzMessageService,
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
						admin.email,
						admin.password,
						admin.first_name,
						admin.last_name,
						admin.phone,
						admin.is_super_admin,
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
		
		this._adminService.logoutServer().subscribe(
			(response) => {
				if(response != null){
					this._adminService.logoutClient();
				}
				else {
					this.message.create('error', `Aïe! une erreur c'est produite!`);
				}
			},
			(error) => {
				this.message.create('error', `Aïe! une erreur c'est produite!`);
				console.error(error);
			});
	}

	menuItemClicked(){
		this.closeMenu();
	}

}
