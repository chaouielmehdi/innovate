import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { TokenService } from 'src/app/user/services/token.service';
import { UserService } from 'src/app/user/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { User } from 'src/app/shared/models/User';
import { Statistics } from 'src/app/shared/models/Statistics';
import { StatisticService } from '../../services/statistics.service';
import { BackEndResponse } from 'src/app/shared/models/BackEndResponse';
import { NzMessageService } from 'ng-zorro-antd';
import { userLogoBaseUrl } from 'src/app/shared/app-config/URLs';

@Component({
	selector: 'app-drawers',
	templateUrl: './drawers.component.html',
	styleUrls: ['./drawers.component.css']
})
export class DrawersComponent implements OnInit {

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private message: NzMessageService,
		private _userService: UserService,
		private _tokenService: TokenService,
		private _drawerService: DrawerService,
		private _statisticService: StatisticService
	) { }

	ngOnInit() {
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
		this._drawerService.recoverEventEmitter.subscribe(visibleRecover => {
			this.visibleRecover = visibleRecover;
		});

		// menu Drawer
		this._drawerService.menuEventEmitter.subscribe(visibleMenu => {
			this.visibleMenu = visibleMenu;
		});


		// Forms initialization
		this.initLoginForm();
		this.initRegisterForm();
		this.initRecoverForm();
		
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
	userLogoBaseUrl: string = userLogoBaseUrl;

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
						user.phone,
						user.email_verified_at,
						user.is_verified_account,
						user.is_verified_update,
						user.website,
						userLogoBaseUrl+user.logo,
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
				});
	}




	






	
	// -------------------------------------------------
	// Login
	// -------------------------------------------------
	
	// Login Drawer
	visibleLogin: boolean = false;
	connectLoader: boolean = false;
	

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
			// turn the button's loader on
			this.connectLoader = true;

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
					},
					() => {
						// turn the button's loader off
						this.connectLoader = false;
					});
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
	isRegisterLoading: boolean = false;

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
			password: ['mehdii', [Validators.required, Validators.maxLength(190), Validators.minLength(6)]],
			password_confirmation: ['mehdii', [Validators.required]]
		},
		{
			validator: passwordConfirmationValidator
		});
	}

	submitRegisterForm(): void {
		// turn the button's loader on
		this.isRegisterLoading = true;

		for (const i in this.registerForm.controls) {
			this.registerForm.controls[i].markAsDirty();
			this.registerForm.controls[i].updateValueAndValidity();
		}

		// validation
		var isRegisterFormValid: boolean =
			!(
				// front-end validation
				this.registerForm.get('email').invalid ||
				this.registerForm.get('password').invalid ||
				this.registerForm.get('password_confirmation').invalid ||
				this.registerForm.errors.misMatch ||

				// back-end validation
				!this.backEndRegisterResponse.status
			);

		// if registerForm is valid
		if(isRegisterFormValid) {
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

		// turn the button's loader off
		this.isRegisterLoading = false;
	}

	cleanRegisterPwd(){
		this.registerForm.patchValue({
			password: '',
			password_confirmation: ''
		});
	}

	/*
	-------------------------------------------------
	lightlyValidateRegisterForm
	(backend only validation)
	(used to validate th form asynchronously)
	-------------------------------------------------
	*/
	backEndRegisterResponse: BackEndResponse = new BackEndResponse(true);
	emailValidateStatus: string = '';

	lightlyValidateRegisterForm(){
		this.emailValidateStatus = 'validating';
		this._userService.lightlyValidate(this.registerForm).subscribe(
			(backEndRegisterResponse) => {
				if(backEndRegisterResponse != null) {
					this.backEndRegisterResponse = backEndRegisterResponse;
					
					// set the emailValidateStatus
					if(this.registerForm.get('email').invalid){
						this.emailValidateStatus = 'error';
					}
					else if(this.backEndRegisterResponse.hasOwnProperty("errors")){
						if(this.backEndRegisterResponse.errors.hasOwnProperty("email")){
							this.emailValidateStatus = 'error';
						}
						else {
							this.emailValidateStatus = 'success';
						}
					}
					else {
						this.emailValidateStatus = 'success';
					}
				}
				else {
					// default value
					this.backEndRegisterResponse = new BackEndResponse(true);
					this.emailValidateStatus = 'warning';
				}
			},
			(error) => {
				// default value
				this.backEndRegisterResponse = new BackEndResponse(true);
				this.emailValidateStatus = 'warning';
				console.error(error);
			});
	}









	






	

	// -------------------------------------------------
	// Recover
	// -------------------------------------------------
	
	// Recover Drawer
	visibleRecover: boolean = false;
	isRecoverLoading: boolean = false;

	openRecover(): void {
		this.visibleLogin = false;
		this.visibleRecover = false;
		this.visibleRecover = true;
	}

	closeRecover(): void {
		this.visibleLogin = false;
		this.visibleRecover = false;
		this.visibleRecover = false;
	}
	
	// Recover Form
	recoverForm: FormGroup;
	recoverErrorMsg: string = '';

	initRecoverForm() {
		this.recoverForm = this.fb.group({
			email: ['mehdi.mc60@gmail.com', [Validators.required, Validators.maxLength(190), Validators.email]]
		});
	}
	
	submitRecoverForm(): void {
		// turn the button's loader on
		this.isRegisterLoading = true;

		for (const i in this.recoverForm.controls) {
			this.recoverForm.controls[i].markAsDirty();
			this.recoverForm.controls[i].updateValueAndValidity();
		}

		// validation
		var isRecoverFormValid: boolean =
			!(
				// front-end validation
				this.recoverForm.get('email').invalid ||

				// back-end validation
				!this.backEndRecoverResponse.status
			);

		// if recoverForm is valid
		if(isRecoverFormValid) {
			// send the email
			this._userService.recover(this.registerForm).subscribe(
				(backEndRegisterResponse) => {
					if(backEndRegisterResponse != null) {
						this.backEndRegisterResponse = backEndRegisterResponse;
						
						// set the emailValidateStatus
						if(this.registerForm.get('email').invalid){
							this.emailValidateStatus = 'error';
						}
						else if(this.backEndRegisterResponse.hasOwnProperty("errors")){
							if(this.backEndRegisterResponse.errors.hasOwnProperty("email")){
								this.emailValidateStatus = 'error';
							}
							else {
								this.emailValidateStatus = 'success';
							}
						}
						else {
							this.emailValidateStatus = 'success';
						}
					}
					else {
						// default value
						this.backEndRegisterResponse = new BackEndResponse(true);
						this.emailValidateStatus = 'warning';
					}
				},
				(error) => {
					// default value
					this.backEndRegisterResponse = new BackEndResponse(true);
					this.emailValidateStatus = 'warning';
					console.error(error);
				},
				() => {
					// turn the button's loader off
					this.isRegisterLoading = false;
				});
		}
	}

	cleanRecoverPwd(){
		this.recoverForm.patchValue({
			password: '',
			password_confirmation: ''
		});
	}

	/*
	-------------------------------------------------
	lightlyValidateRecoverForm
	(backend only validation)
	(used to validate th form asynchronously)
	the opposite of registerForm (good case : email exist)
	-------------------------------------------------
	*/
	backEndRecoverResponse: BackEndResponse = new BackEndResponse(true);
	recoverEmailValidateStatus: string = '';

	lightlyValidateRecoverForm(){
		this.recoverEmailValidateStatus = 'validating';
		this._userService.userEmailExists(this.recoverForm).subscribe(
			(backEndRecoverResponse) => {
				if(backEndRecoverResponse != null) {
					this.backEndRecoverResponse = backEndRecoverResponse;
					
					console.log(this.backEndRecoverResponse);
					if(this.backEndRecoverResponse.status){
						this.recoverEmailValidateStatus = 'success';
					}
					else {
						this.recoverEmailValidateStatus = 'error';
					}
				}
				else {
					// default value
					this.backEndRecoverResponse = new BackEndResponse(true);
					this.recoverEmailValidateStatus = 'warning';
				}
			},
			(error) => {
				// default value
				this.backEndRecoverResponse = new BackEndResponse(true);
				this.recoverEmailValidateStatus = 'warning';
				console.error(error);
			});
	}














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
