import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { UserService } from 'src/app/user/services/user.service';
import { Router } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { fade } from 'src/app/shared/animations/fade';
import { createUserLogoUrl } from 'src/app/shared/app-config/URLs';

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
		private fb: FormBuilder,
		private router: Router,
		private message: NzMessageService,
		private _drawerService: DrawerService,
		private _userService: UserService,
	) { }

	ngOnInit() {
		this._drawerService.closeRegister();

		// Sets email and password (from the user-service)
		this.setEmailPassword();
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
		username: new FormControl(
			'test-username',
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
		email: new FormControl(
			{value: ''},
			[Validators.required, Validators.email, Validators.maxLength(190)]
		),
		password: new FormControl(
			'',
			[Validators.required, Validators.maxLength(190), Validators.minLength(6)]
		),
		password_confirmation: new FormControl(
			'',
			[Validators.required]
		),
		phone_number: new FormControl(
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
	setEmailPassword(): void {
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
				this.registerForm.get('username').invalid ||
				this.registerForm.get('email').invalid ||
				this.registerForm.get('password').invalid ||
				this.registerForm.get('password_confirmation').invalid ||
				this.registerForm.get('phone_number').invalid ||
				this.registerForm.get('website').invalid ||
				this.registerForm.errors.misMatch
			);

		// if registerForm valid
		if(isRegisterFormValid){
			// turn the button's loader on
			this.registerLoader = true;

			this._userService.registerServer(this.registerForm)
				.subscribe(
					(user) => {
						if(user != null) {
							this.message.create('success', `Votre demande de modification de profile a été faite.`);

							// log the user in
							this._userService.loginClient(user);
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




	// logo input
	
	createUserLogoUrl: string = createUserLogoUrl;

	showUploadList = {
		showPreviewIcon: true,
		showRemoveIcon: true,
		hidePreviewIconInNonImage: true
	};

	fileList = [];
	previewImage: string | undefined = '';
	previewVisible = false;

	handlePreview = (file: UploadFile) => {
		this.previewImage = file.url || file.thumbUrl;
		this.previewVisible = true;
	};


}
