import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/services/user.service';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { User } from 'src/app/shared/models/User';
import { userLogoBaseURL } from 'src/app/shared/app-config/URLs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor(
		private fb: FormBuilder,
		private _userService: UserService,
		private _drawerService: DrawerService
	) { }

	ngOnInit() {
		// Subscription to the DrawerService
		// login Drawer
		this._drawerService.loginEventEmitter.subscribe(visibleLogin => {
			this.visibleLogin = visibleLogin;
		});

		// Form initialization
		this.initLoginForm();
		
		// Get User
		this.getUser();

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
	Login
	-------------------------------------------------
	*/
	
	// Login Drawer
	visibleLogin: boolean = false;
	connectLoader: boolean = false;
	
	openLogin(): void {
		this._drawerService.openLogin();
	}

	closeLogin(): void {
		this._drawerService.closeLogin();
	}

	openRegister(): void {
		this._drawerService.openRegister();
	}

	openRecover(): void {
		this._drawerService.openRecover();
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
}
