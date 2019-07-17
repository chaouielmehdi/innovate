import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import { MenuComponent } from '../components/drawers/menu/menu.component';
import { User } from 'src/app/shared/models/User';
import { userLogoBaseURL } from 'src/app/shared/app-config/URLs';
import { StatisticService } from './statistics.service';
import { Statistics } from 'src/app/shared/models/Statistics';

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
		private _userService: UserService,
		private _statisticService: StatisticService
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
			this.closeRecover();
			this.closeRegister();
			this.closeMenu();

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
			this.closeRecover();
			this.closeMenu();
			this.closeLogin();

			this.visibleRegister = true;
			this.registerEventEmitter.emit(this.visibleRegister);
		}
	}

	closeRegister() {
		this.visibleRegister = false;
		this.registerEventEmitter.emit(this.visibleRegister);
	}








	

	/**
	 * recover drawer service
	 */
	
	visibleRecover: boolean = false;

	@Output() recoverEventEmitter: EventEmitter<boolean> = new EventEmitter();
	
	openRecover() {
		if(!this.loggedIn) {
			this.closeLogin();
			this.closeRegister();
			this.closeMenu();
			
			this.visibleRecover = true;
			this.recoverEventEmitter.emit(this.visibleRecover);
		}
	}

	closeRecover() {
		this.visibleRecover = false;
		this.recoverEventEmitter.emit(this.visibleRecover);
	}


	




	/**
	 * Menu drawer service
	 */
	visibleMenu: boolean = false;
	menuComponent: MenuComponent;

	@Output() menuEventEmitter: EventEmitter<boolean> = new EventEmitter();
	@Output() menuUserEventEmitter: EventEmitter<User> = new EventEmitter();
	@Output() menuStatisticsEventEmitter: EventEmitter<Statistics> = new EventEmitter();
	
	openMenu() {
		if(this.loggedIn) {
			this.closeRecover();
			this.closeRegister();
			this.closeLogin();

			this.visibleMenu = true;
			this.menuEventEmitter.emit(this.visibleMenu);

			// Get and emit user
			this.getAndEmitUser();

			// Get and emit statistics
			this.getAndEmitStatistics();
		}
	}

	closeMenu() {
		this.visibleMenu = false;
		this.menuEventEmitter.emit(this.visibleMenu);
	}





	
	/*
	-------------------------------------------------
	User to emit it to menu-drawer
	-------------------------------------------------
	*/
	// User attr
	user: User = new User();
	userLogoBaseURL: string = userLogoBaseURL;

	/**
	 * Gets and emit user
	 */
	getAndEmitUser() {
		this._userService.getUserServer().subscribe(
			(user) => {
				if(user != null){
					this.user = new User(
						user.id,
						user.email,
						user.password,
						user.code,
						user.username,
						userLogoBaseURL+user.logo,
						user.canal,
						user.address,
						user.phone,
						user.website,
						user.status,
						user.email_verified_at,
						user.access_token,
						user.created_at,
						user.updated_at,
					);
					console.log(this.user);

					// emit the user
					this.menuUserEventEmitter.emit(this.user);
				}
				else {
					this.user = new User();
				}
			},
			(error) => {
				this.user = new User();
				console.log("error : ", error);
			});
	}




	/*
	-------------------------------------------------
	Statistics to emit them to menu-drawer
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
	
	/**
	 * Gets and emit statistics
	 */
	getAndEmitStatistics() {
		this._statisticService.getStatistics().subscribe(
			(statistics) => {
				if(statistics != null){
					this.statistics = new Statistics(
						// commands
						{
							count: statistics.commands.count,
							delivered: statistics.commands.delivered,
							confirmed: statistics.commands.confirmed,
							commanded: statistics.commands.commanded,
							canceled: statistics.commands.canceled,
							notViewedNumber: statistics.commands.notViewedNumber
						},
						// cart
						{
							count: statistics.cart.count,
							canceled: statistics.cart.canceled
						},
						// credits
						{
							count: statistics.credits.count,
							paid: statistics.credits.paid
						},
						// products
						{
							notViewedNumber: statistics.products.notViewedNumber
						},
						// support
						{
							notViewedNumber: statistics.support.notViewedNumber
						}
					);

					// emit the statistics
					this.menuStatisticsEventEmitter.emit(this.statistics);
				}
				else {
					this.statistics = new Statistics();
				}
			},
			(error) => {
				this.statistics = new Statistics();
				console.log("error : ", error);
			});
	}
}
