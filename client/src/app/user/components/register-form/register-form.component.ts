import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { fade } from 'src/app/shared/animations/fade';
import { createUserLogoUrl } from 'src/app/shared/app-config/URLs';
import { UserService } from '../../services/user.service';
import { Observable, Observer } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { BackEndResponse } from 'src/app/shared/models/BackEndResponse';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register-form',
	templateUrl: './register-form.component.html',
	styleUrls: ['./register-form.component.css'],
	animations: [ fade ]
})
export class RegisterFormComponent implements OnInit {

	/*
	-------------------------------------------------
	General
	-------------------------------------------------
	*/
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private message: NzMessageService,
		private _drawerService: DrawerService,
		private _userService: UserService
	) { }

	ngOnInit() {
		this._drawerService.closeRegister();

		// Sets email and password (from the user-service)
		this.getEmailPassword();
	}
	
	ngOnDestroy() {
		this._userService.changeIsRegisterAvailable(false);
	}


	/*
	-------------------------------------------------
	Form
	-------------------------------------------------
	*/
	
	registerForm: FormGroup = this.fb.group({
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
		username: new FormControl(
			'',
			[Validators.required, Validators.maxLength(190)]
		),
		canal: new FormControl(
			'Hotel',
			[Validators.required, Validators.maxLength(190)]
		),
		address: new FormControl(
			'test-address',
			[Validators.required, Validators.maxLength(190)]
		),
		phone: new FormControl(
			'067373737',
			[Validators.required, Validators.maxLength(190)]
		),
		website: new FormControl(
			'website.com',
			[Validators.maxLength(190), Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$')]
		)
	},
	{
		validator: passwordConfirmationValidator
	});

	passwordVisible: boolean = false;
	registerLoader: boolean = false;
	
	/**
	 * Sets email and password (from the user-service)
	 */
	getEmailPassword(): void {
		var emailFromUserService: string = this._userService.getEmailPassword().email;
		var passwordFromUserService: string = this._userService.getEmailPassword().password;
		
		if(emailFromUserService !== '' && passwordFromUserService !== ''){
			this.registerForm.patchValue({
				email: emailFromUserService,
				password: passwordFromUserService,
				password_confirmation: passwordFromUserService
			});
		}
		else{
			this.router.navigateByUrl('/home');
		}
	}

	submitRegisterForm(){
		// show the errors
		for (const key in this.registerForm.controls) {
			this.registerForm.controls[ key ].markAsDirty();
			this.registerForm.controls[ key ].updateValueAndValidity();
		}

		// validation
		var isRegisterFormValid: boolean =
			!(
				// front-end validation
				this.registerForm.get('email').invalid ||
				this.registerForm.get('password').invalid ||
				this.registerForm.get('password_confirmation').invalid ||
				this.registerForm.get('username').invalid ||
				this.registerForm.get('canal').invalid ||
				this.registerForm.get('address').invalid ||
				this.registerForm.get('phone').invalid ||
				this.registerForm.get('website').invalid ||
				this.registerForm.errors.misMatch ||
				
				// back-end validation
				!this.backEndResponse.status
			);

		// if registerForm valid
		if(isRegisterFormValid){
			// turn the button's loader on
			this.registerLoader = true;
			
			// if there is a logo then 
			if(this.logoName !== ''){
				this.registerForm.addControl('logo', new FormControl((this.logoName)));
			}
			
			this._userService.registerServer(this.registerForm)
				.subscribe(
					(user) => {
						if(user != null) {
							//log the user in
							this._userService.loginServer(
								this.fb.group({
									email: new FormControl(
										this.registerForm.get('email').value
									),
									password: new FormControl(
										this.registerForm.get('password').value
									)
								})).subscribe(
									(user) => {
										if(user != null) {
											this._userService.loginClient(user);
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
							this.cleanRegisterPwd();
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
						this.registerLoader = false;
					}
				);
		}
		else {
			this.scrollTo('email');
		}
	}

	cleanRegisterPwd(){
		this.registerForm.patchValue({
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
	(used to validate th form asynchronously)
	-------------------------------------------------
	*/
	backEndResponse: BackEndResponse = new BackEndResponse(true);
	usernameValidateStatus: string = '';
	isFreezedLightValidation: boolean = false;

	lightlyValidate(){
		this.usernameValidateStatus = 'validating';
		this._userService.lightlyValidate(this.registerForm)
		.subscribe(
			(formValidation) => {
				if(formValidation != null) {
					this.backEndResponse = formValidation;
					
					// set the usernameValidateStatus
					if(this.registerForm.get('username').invalid){
						this.usernameValidateStatus = 'error';
					}
					else if(this.backEndResponse.hasOwnProperty("errors")){
						if(this.backEndResponse.errors.hasOwnProperty("username")){
							this.usernameValidateStatus = 'error';
						}
						else {
							this.usernameValidateStatus = 'success';
						}
					}
					else {
						this.usernameValidateStatus = 'success';
					}
				}
				else {
					// default value
					this.backEndResponse = new BackEndResponse(true);
					this.usernameValidateStatus = 'warning';
				}
			},
			(error) => {
				// default value
				this.backEndResponse = new BackEndResponse(true);
				this.usernameValidateStatus = 'warning';
				console.error(error);
			});
	}









	/*
	-------------------------------------------------
	logo input
	-------------------------------------------------
	*/
	showUploadList = {
		showPreviewIcon: true,
		showRemoveIcon: true,
		hidePreviewIconInNonImage: true
	};
	fileList = [];
	previewImage: string | undefined = '';
	previewVisible = false;

	isLoadingLogo: boolean = false;
	logoUrl: string = createUserLogoUrl;
	errorLogo: string = '';

	// logoName after storing the logo in the backend
	// I use it to store it later in the database
	logoName: string = '';
	
	beforeUpload = (file: File) => {
		return new Observable((observer: Observer<boolean>) => {
			// format verification
			const isValidFormat = (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/bmp');
			if (!isValidFormat) {
				this.errorLogo = 'Les formats disponibles : png, jpg, jpeg, bmp!';
				observer.complete();
				return;
			}
			// < 5Mo verification
			const isLt5M = file.size / 1024 / 1024 < 5;
			if (!isLt5M) {
				this.errorLogo = 'Le logo ne doit pas dépasser 5Mo !';
				observer.complete();
				return;
			}
			observer.next(isValidFormat && isLt5M);
			observer.complete();
		});
	};

	private getBase64(img: File, callback: (img: string) => void): void {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result!.toString()));
		reader.readAsDataURL(img);
	}

	handleChange(info: { file: UploadFile }): void {
		switch (info.file.status) {
			case 'uploading':
				this.errorLogo = '';
				this.isLoadingLogo = true;
				break;
			case 'done':
				// Get this url from response in real world.
				this.getBase64(info.file!.originFileObj!, (img: string) => {
					this.isLoadingLogo = false;
					this.logoUrl = img;
					this.logoName = info.file.response.logoName;
					console.log('this.logoName', this.logoName);
				});
				break;
			case 'error':
				this.message.error("Aïe! une erreur c'est produite");
				this.isLoadingLogo = false;
				break;
			}
	}

	handlePreview = (file: UploadFile) => {
		this.previewImage = file.url || file.thumbUrl;
		this.previewVisible = true;
	};

}
