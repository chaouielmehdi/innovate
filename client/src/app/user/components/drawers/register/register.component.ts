import { Component, OnInit } from '@angular/core';
import { BackEndResponse } from 'src/app/shared/models/BackEndResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private _userService: UserService,
		private _drawerService: DrawerService,
	) { }

	ngOnInit() {
		// Subscription to the DrawerService
		// register Drawer
		this._drawerService.registerEventEmitter.subscribe(visibleRegister => {
			this.visibleRegister = visibleRegister;
		});

		// Form initialization
		this.initRegisterForm();

	}

	// -------------------------------------------------
	// Register
	// -------------------------------------------------
	
	// Register Drawer
	visibleRegister: boolean = false;
	isRegisterLoading: boolean = false;

	openRegister(): void {
		this._drawerService.openRegister();
	}

	closeRegister(): void {
		this.visibleRegister = false;
	}
	
	
	openLogin(): void {
		this._drawerService.openLogin();
	}
	
	openRecover(): void {
		this._drawerService.openRecover();
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
	(used to validate the form asynchronously)
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

}
