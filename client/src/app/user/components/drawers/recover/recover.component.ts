import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/user/services/user.service';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { BackEndResponse } from 'src/app/shared/models/BackEndResponse';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {

	constructor(
		private fb: FormBuilder,
		private _userService: UserService,
		private _drawerService: DrawerService
	) { }

	ngOnInit() {
		// Subscription to the DrawerService
		// recover Drawer
		this._drawerService.recoverEventEmitter.subscribe(visibleRecover => {
			this.visibleRecover = visibleRecover;
		});
		
		// Form initialization
		this.initRecoverForm();
	}




	// -------------------------------------------------
	// Recover
	// -------------------------------------------------
	
	// Recover Drawer
	visibleRecover: boolean = false;
	isRecoverLoading: boolean = false;

	openRecover(): void {
		this._drawerService.openRecover();
	}

	closeRecover(): void {
		this._drawerService.closeRecover();
	}

	openLogin(): void {
		this._drawerService.openLogin();
	}
	
	openRegister(): void {
		this._drawerService.openRegister();
	}
	
	// Recover Form
	recoverForm: FormGroup;
	emailValidateStatus: string = '';

	initRecoverForm() {
		this.recoverForm = this.fb.group({
			email: [
				'mehdi.mc60@gmail.com',
				[Validators.required, Validators.maxLength(190), Validators.email]
			]
		});
	}
	
	submitRecoverForm(): void {
		// turn the button's loader on
		this.isRecoverLoading = true;

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
			this._userService.recover(this.recoverForm).subscribe(
				(backEndRecoverResponse) => {
					if(backEndRecoverResponse != null) {
						this.backEndRecoverResponse = backEndRecoverResponse;
						
						// set the emailValidateStatus
						if(this.recoverForm.get('email').invalid){
							this.emailValidateStatus = 'error';
						}
						else if(this.backEndRecoverResponse.hasOwnProperty("errors")){
							if(this.backEndRecoverResponse.errors.hasOwnProperty("email")){
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
						this.backEndRecoverResponse = new BackEndResponse(true);
						this.emailValidateStatus = 'warning';
					}
				},
				(error) => {
					// default value
					this.backEndRecoverResponse = new BackEndResponse(true);
					this.emailValidateStatus = 'warning';
					console.error(error);
				},
				() => {
					// turn the button's loader off
					this.isRecoverLoading = false;
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
	(used to validate the form asynchronously)
	the opposite of registerForm (good case : email exist)
	-------------------------------------------------
	*/
	backEndRecoverResponse: BackEndResponse = new BackEndResponse(true);
	recoverEmailValidateStatus: string = '';

	lightlyValidateRecoverForm(){
		// the input status
		this.recoverEmailValidateStatus = 'validating';
		
		this._userService.userEmailExists(this.recoverForm).subscribe(
			(backEndRecoverResponse) => {
				if(backEndRecoverResponse != null) {
					this.backEndRecoverResponse = backEndRecoverResponse;
					
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


}
