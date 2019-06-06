import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { TokenService } from 'src/app/user/services/token.service';
import { UserService } from 'src/app/user/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { User } from 'src/app/shared/models/User';
import { Statistics } from 'src/app/shared/models/Statistics';
import { StatisticsService } from '../../services/statistics.service';

@Component({
	selector: 'app-drawers',
	templateUrl: './drawers.component.html',
	styleUrls: ['./drawers.component.css']
})
export class DrawersComponent implements OnInit {

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private _userService: UserService,
		private _tokenService: TokenService,
		private _drawerService: DrawerService,
		private _statisticService: StatisticsService
	) { }

	ngOnInit() {
		// Forms initialization
		this.initLoginForm();
		this.initRegisterForm();
		this.initRecoverForm();

		// Subscription to the DrawerService
		// login Drawer
		this._drawerService.loginEventEmitter.subscribe(visibleLogin => {
			this.visibleLogin = visibleLogin;
		});

		// register Drawer
		this._drawerService.registerEventEmitter.subscribe(visibleRegister => {
			this.visibleRegister = visibleRegister;
		});

		// recover Drawer
		// TODO

		// menu Drawer
		this._drawerService.menuEventEmitter.subscribe(visibleMenu => {
			this.visibleMenu = visibleMenu;
		});

		// Get User
		this.getUser();

		// Get statistics
		this.getStatistics();

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
	
	toProfileForm(){
		this.closeMenu();
		this.router.navigateByUrl('/profile-form');
	}

	logout() {
		this.closeMenu();
		this._userService.logoutClient();
	}

	menuItemClicked(){
		this.closeMenu();
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
				});
	}




	// -------------------------------------------------
	// Login
	// -------------------------------------------------
	
	// Login Drawer
	visibleLogin: boolean = false;

	openLogin(): void {
		this.visibleRegister = false;
		this.visibleRecover = false;
		this.visibleLogin = true;
	}

	closeLogin(): void {
		this.visibleRegister = false;
		this.visibleRecover = false;
		this.visibleLogin = false;
	}
	
	// Login Form
	loginForm: FormGroup;
	loginErrorMsg: string = '';

	initLoginForm(){
		this.loginForm = this.fb.group({
			email: ['mehdi.mc60@gmail.com', [Validators.required, Validators.maxLength(190), Validators.email]],
			password: ['mehdii', [Validators.required, Validators.maxLength(190)]]
		});
	}

	submitLoginForm(): void {
		for (const i in this.loginForm.controls) {
			this.loginForm.controls[i].markAsDirty();
			this.loginForm.controls[i].updateValueAndValidity();
		}

		if(!this.loginForm.invalid) {
			this._userService.loginServer(this.loginForm)
				.subscribe(
					(user) => {
						if(user != null) {
							this.loginErrorMsg = '';
							this._userService.loginClient(user);
						}
						else {
							this.loginErrorMsg = 'Email ou mot de passe invalide';
							this.cleanLoginPwd();
						}
					},
					(error) => {
						this.loginErrorMsg = "Aïe! une erreur c'est produite";
						console.error(error);
					}
				);
		}
	}

	cleanLoginPwd(){
		this.loginForm.patchValue({
			password: ''
		});
	}
	

	// -------------------------------------------------
	// Register
	// -------------------------------------------------
	
	// Register Drawer
	visibleRegister: boolean = false;

	openRegister(): void {
		this.visibleLogin = false;
		this.visibleRecover = false;
		this.visibleRegister = true;
	}

	closeRegister(): void {
		this.visibleLogin = false;
		this.visibleRecover = false;
		this.visibleRegister = false;
	}
	
	// Register Form
	registerForm: FormGroup;
	registerErrorMsg: string = '';

	initRegisterForm() {
		this.registerForm = this.fb.group({
			email: ['mehdi.mc60@gmail.com', [Validators.required, Validators.maxLength(190), Validators.email]],
			password: ['mehdii', [Validators.required, Validators.maxLength(190)]],
			password_confirmation: ['mehdii', [Validators.required]]
		},
		{
			validator: passwordConfirmationValidator
		});
	}

	submitRegisterForm(): void {
		for (const i in this.registerForm.controls) {
			this.registerForm.controls[i].markAsDirty();
			this.registerForm.controls[i].updateValueAndValidity();
		}

		// if registerForm is valid
		if(!(this.registerForm.invalid && this.registerForm.errors.misMatch)) {
			// in user-service, set email and password (to get them in register-form-component)
			this._userService.setEmailPassword(
				this.registerForm.get('email').value,
				this.registerForm.get('password').value
			);

			// make the register-form-component available
			this._userService.changeIsRegisterAvailable(true);

			// navigate to register-form
			this.router.navigateByUrl('/register-form');
		}
		else {
			// show the errors
			for (const key in this.registerForm.controls) {
				this.registerForm.controls[ key ].markAsTouched();
				this.registerForm.controls[ key ].updateValueAndValidity();
			}
		}
	}

	cleanRegisterPwd(){
		this.registerForm.patchValue({
			password: '',
			password_confirmation: ''
		});
	}


	// -------------------------------------------------
	// Recover
	// -------------------------------------------------
	
	// Recover Drawer
	visibleRecover: boolean = false;

	openRecover(): void {
		this.visibleRegister = false;
		this.visibleLogin = false;
		this.visibleRecover = true;
	}

	closeRecover(): void {
		this.visibleRegister = false;
		this.visibleLogin = false;
		this.visibleRecover = false;
	}
	
	// Recover Form
	recoverForm: FormGroup;
	recoverErrorMsg: string = '';

	initRecoverForm(){
		this.recoverForm = this.fb.group({
			recoverEmail: ['mehdii.mc60@gmail.com', [Validators.required, Validators.maxLength(190), Validators.email]],
			recoverPassword: ['mehdii', [Validators.required, Validators.maxLength(190)]]
		});
	}

	submitRecoverForm(): void {
		for (const i in this.recoverForm.controls) {
			this.recoverForm.controls[i].markAsDirty();
			this.recoverForm.controls[i].updateValueAndValidity();
		}
		/*
		if(!this.recoverForm.invalid) {
			this._userService.recover(this.recoverForm)
				.subscribe(
					(user) => {
						if(user != null) {
							this.recoverErrorMsg = '';
							this.recover(user);
							this.router.navigateByUrl('dashboard');
						}
						else {
							this.recoverErrorMsg = 'Email ou mot de passe invalide';
							this.cleanRecoverPwd();
						}
					},
					(error) => {
						this.recoverErrorMsg = "Aïe! une erreur c'est produite";
						console.error(error);
					}
				);
		}
		else {
			// show the errors
			for (const key in this.recoverForm.controls) {
				this.recoverForm.controls[ key ].markAsTouched();
				this.recoverForm.controls[ key ].updateValueAndValidity();
			}
		}
		*/
	}

	cleanRecoverPwd(){
		this.recoverForm.patchValue({
			recoverPassword: ''
		});
	}

	recover(user){
		this._tokenService.handle(user.access_token);

		this._userService.changeAuthStatus(true);

		this.router.navigateByUrl('/dashboard');
	}



}
