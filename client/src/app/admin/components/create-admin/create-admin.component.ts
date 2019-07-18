import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { fade } from 'src/app/shared/animations/fade';
import { Observable, Observer } from 'rxjs';
import { BackEndResponse } from 'src/app/shared/models/BackEndResponse';
import { AdminService } from '../../services/admin.service';
import { adminCreateImageURL } from 'src/app/shared/app-config/URLs';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css'],
  animations: [ fade ]
})
export class CreateAdminComponent implements OnInit {

	/**
	 * Creates an instance of dashboard component.
	 */
	constructor(
		private fb: FormBuilder,
		private message: NzMessageService,
		private _adminService: AdminService
	) { }

	ngOnInit() { }


	/*
	-------------------------------------------------
	Form
	-------------------------------------------------
	*/
	
	adminForm: FormGroup = this.fb.group({
		email: new FormControl(
			'mehdi.mc60@gmail.com',
			[Validators.required, Validators.email, Validators.maxLength(190)]
		),
		password: new FormControl(
			'mehdii',
			[Validators.required, Validators.maxLength(190), Validators.minLength(6)]
		),
		password_confirmation: new FormControl(
			'mehdii',
			[Validators.required]
		),
		first_name: new FormControl(
			'mehdi',
			[Validators.required, Validators.maxLength(190)]
		),
		last_name: new FormControl(
			'chaoui',
			[Validators.required, Validators.maxLength(190)]
		),
		phone: new FormControl(
			'067373737',
			[Validators.required, Validators.maxLength(190)]
		),
		is_super_admin: new FormControl(
			'false',
			[Validators.required]
		)
	},
	{
		validator: passwordConfirmationValidator
	});

	passwordVisible: boolean = false;
	adminLoader: boolean = false;

	submitAdminForm(){
		// show the errors
		for (const key in this.adminForm.controls) {
			this.adminForm.controls[ key ].markAsDirty();
			this.adminForm.controls[ key ].updateValueAndValidity();
		}

		// validation
		var isAdminFormValid: boolean =
			!(
				// front-end validation
				this.adminForm.get('email').invalid ||
				this.adminForm.get('password').invalid ||
				this.adminForm.get('password_confirmation').invalid ||
				this.adminForm.get('first_name').invalid ||
				this.adminForm.get('last_name').invalid ||
				this.adminForm.get('phone').invalid ||
				this.adminForm.get('is_super_admin').invalid ||
				this.adminForm.errors.misMatch ||
				
				// back-end validation
				!this.backEndResponse.status
			);

		// if adminForm valid
		if(isAdminFormValid){
			// turn the button's loader on
			this.adminLoader = true;

			// convert is_super_admin from 'false'/'true' (string) to boolean false/true
			let is_super_admin = this.adminForm.get('is_super_admin');
			if(is_super_admin.value === 'true'){
				is_super_admin.setValue(true);
			}
			else {
				is_super_admin.setValue(false);
			}
			
			// subscribe to create admin method
			this._adminService.createAdmin(this.adminForm).subscribe(
				(admin) => {
					if(admin != null) {
						// log the admin in
						this._adminService.loginServer(
							this.fb.group({
								email: new FormControl(
									this.adminForm.get('email').value
								),
								password: new FormControl(
									this.adminForm.get('password').value
								)
							})).subscribe(
								(admin) => {
									if(admin != null) {
										this._adminService.loginClient(admin);
									}
									else {
										this.message.create('error', `Aïe! une erreur c'est produite`);
									}
								},
								(error) => {
									this.message.create('error', `Aïe! une erreur c'est produite`);
									console.error(error);
								});
					}
					else {
						this.message.create('error', `Informations érronées! réessayez s'il vous plaît!`);
						this.cleanAdminPwd();
						this.scrollTo('email');
					}
				},
				(error) => {
					this.message.create('error', `Aïe! une erreur c'est produite!`);
					this.scrollTo('email');
					console.error(error);
				},
				() => {
					// turn the button's loader off
					this.adminLoader = false;

					// reset is_super_admin to the default value
					is_super_admin.setValue('false');
				}
			);
		}
		else {
			this.scrollTo('email');
		}
	}

	cleanAdminPwd(){
		this.adminForm.patchValue({
			password: '',
			password_confirmation: ''
		});
	}
	
	scrollTo(id) {
		console.log(`scrolling to ${id}`);
		let el = document.getElementById(id);
		el.scrollIntoView( {behavior: "smooth"} );
	}








	/*
	-------------------------------------------------
	lightlyValidate 
	(backend only validation)
	(used to validate the form asynchronously)
	-------------------------------------------------
	*/
	backEndResponse: BackEndResponse = new BackEndResponse(true);
	emailValidateStatus: string = '';
	isFreezedLightValidation: boolean = false;

	lightlyValidate(){
		this.emailValidateStatus = 'validating';
		this._adminService.lightlyValidate(this.adminForm).subscribe(
			(formValidation) => {
				if(formValidation != null) {
					this.backEndResponse = formValidation;
					
					// set the emailValidateStatus
					if(this.adminForm.get('email').invalid){
						this.emailValidateStatus = 'error';
					}
					else if(this.backEndResponse.hasOwnProperty("errors")){
						if(this.backEndResponse.errors.hasOwnProperty("email")){
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
					this.backEndResponse = new BackEndResponse(true);
					this.emailValidateStatus = 'warning';
				}
			},
			(error) => {
				// default value
				this.backEndResponse = new BackEndResponse(true);
				this.emailValidateStatus = 'warning';
				console.error(error);
			});
	}
}
