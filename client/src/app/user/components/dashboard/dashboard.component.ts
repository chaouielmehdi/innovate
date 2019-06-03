import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { StatisticsService } from 'src/app/user/services/statistics.service';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/user/services/user.service';
import { ProductService } from 'src/app/user/services/product.service';
import { Router } from '@angular/router';
import { fade } from 'src/app/shared/animations/fade';
import { Statistics } from 'src/app/shared/models/Statistics';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	animations: [ fade ]
})

export class DashboardComponent implements OnInit {

	/*
	-------------------------------------------------
	General
	-------------------------------------------------
	*/
	constructor(
		private router: Router,
		private _drawerService: DrawerService,
		private _statisticService: StatisticsService,
		private _userService: UserService,
		private _productService: ProductService
	) { }

	ngOnInit() {
		this._drawerService.closeLogin();

		// send to the product details if the user has clicked to it before connection
		var idProduct: number = this._productService.getId();

		if(idProduct > 0){
			this.router.navigateByUrl('/products/product-details/'+idProduct);
		}
		else {
			// Get statistics
			this.getStatistics();

			// Get User
			this.getUser();
		}
	}

	/*
	-------------------------------------------------
	User
	-------------------------------------------------
	*/

	// User attr
	user: User = new User();

	// Get User
	getUser() {
		this._userService.getUserServer().subscribe(
			(user) => {
				if(user != null){
					this.user = new User(
						user.id,
						user.name,
						user.canal,
						user.address,
						user.email,
						user.password,
						user.phone_number,
						user.email_verified_at,
						user.is_verified_account,
						user.is_verified_update,
						user.website,
						user.logoUrl,
						user.access_token,
						user.created_at,
						user.updated_at
					);
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

	// Get Commands list
	getStatistics() {
		this._statisticService.getStatistics()
			.subscribe(
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
					}
					else {
						this.statistics = new Statistics();
					}
				},
				(error) => {
					this.statistics = new Statistics();
					console.log("error : ", error);
				},
				() => {
					this.setCommandsPercent();
					this.setCartPercent();
					this.setCreditPercent();

					this.animatePercents();
				});
	}

	// AnimatePercents
	animatePercents(){
		// commandsPercent
		let commandsPercent = this.commandsPercent;
		this.commandsPercent = 0;

		if(commandsPercent > 0){
			let interval = setInterval(() => {
				this.commandsPercent++;
	
				if(this.commandsPercent == commandsPercent){
					clearInterval(interval);
				}
			}
			,20);
		}


		// cartPercent
		let cartPercent = this.cartPercent;
		this.cartPercent = 0;

		if(cartPercent > 0){
			let interval = setInterval(() => {
				this.cartPercent++;

				if(this.cartPercent == cartPercent){
					clearInterval(interval);
				}
			}
			,20);
		}


		// creditPercent
		let creditPercent = this.creditPercent;
		this.creditPercent = 0;

		if(creditPercent > 0){
			let interval = setInterval(() => {
				this.creditPercent++;

				if(this.creditPercent == creditPercent){
					clearInterval(interval);
				}
			}
			,20);
		}
	}






	


	/*
	-------------------------------------------------
	Commands card
	-------------------------------------------------
	*/
	commandsPercent: number = 0;

	setCommandsPercent(){
		this.commandsPercent
			= Math.floor((this.statistics.commands.delivered
			/ this.statistics.commands.count) * 100);
		
	}


	/* 
	-------------------------------------------------
	Cart card
	-------------------------------------------------
	*/

	cartPercent: number = 0;

	setCartPercent(){
		this.cartPercent
			= Math.floor((this.statistics.cart.count - this.statistics.cart.canceled)
			/ this.statistics.cart.count * 100);
		
	}

	/* 
	-------------------------------------------------
	Credit card
	-------------------------------------------------
	*/

	creditPercent: number = 0;

	setCreditPercent(){
		this.creditPercent
			= Math.floor((this.statistics.credits.paid
			/ this.statistics.credits.count) * 100);
		
	}

}
