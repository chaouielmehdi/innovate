import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from 'src/app/user/services/user.service';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { StatisticService } from 'src/app/user/services/statistics.service';
import { User } from 'src/app/shared/models/User';
import { userLogoBaseURL } from 'src/app/shared/app-config/URLs';
import { Statistics } from 'src/app/shared/models/Statistics';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	/*
	-------------------------------------------------
	this.user and this.statistics of this component
	are filled after login (in - component)
	because the menu is there from the app first
	opening, and before login, this.user and
	this.statistics are null
	-------------------------------------------------
	*/

	constructor(
		private router: Router,
		private message: NzMessageService,
		private _userService: UserService,
		private _drawerService: DrawerService,
		private _statisticService: StatisticService
	) { }

	ngOnInit() {
		// Subscription to the DrawerService
		// menu Drawer
		this._drawerService.menuEventEmitter.subscribe((visibleMenu) => {
			this.visibleMenu = visibleMenu;
		});

		// menu Drawer subscribe to User
		this._drawerService.menuUserEventEmitter.subscribe((user) => {
			this.user = user;
		});

		// menu Drawer subscribe to Statistics
		this._drawerService.menuStatisticsEventEmitter.subscribe((statistics) => {
			this.statistics = statistics;
		});

		console.log('Menu ngOnInit ------------------');
	}









	/*
	-------------------------------------------------
	User
	-------------------------------------------------
	*/
	user: User = new User();

	
	/*
	-------------------------------------------------
	Statistics
	-------------------------------------------------
	*/

	// statistics attribute with default values
	statistics: Statistics = new Statistics(
		// commands
		{
			count: 0,
			delivered: 0,
			confirmed: 0,
			commanded: 0,
			canceled: 0,
			notViewedNumber: 0
		},
		// cart
		{
			count: 0,
			canceled: 0,
		},
		// credits
		{
			count: 0,
			paid: 0
		},
		// products
		{
			notViewedNumber: 0
		},
		// support
		{
			notViewedNumber: 0
		}
	);
	




	
	




	/*
	-------------------------------------------------
	Menu Drawer
	-------------------------------------------------
	*/
	visibleMenu = false;

	openMenu(): void {
		this.visibleMenu = true;
	}
	
	closeMenu(): void {
		this.visibleMenu = false;
	}
	
	toProfileForm(){
		this.closeMenu();
		this.router.navigateByUrl('/profile-form');
	}

	logout() {
		this.closeMenu();
		
		this._userService.logoutServer().subscribe(
			(response) => {
				if(response != null){
					this._userService.logoutClient();
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
