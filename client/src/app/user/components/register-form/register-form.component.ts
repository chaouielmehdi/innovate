import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { UserService } from 'src/app/user/services/user.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { fade } from 'src/app/shared/animations/fade';

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

		// from the auth-service
		this.setEmailPassword();
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
			{value: '', disabled: true},
			[Validators.required, Validators.email, Validators.maxLength(190)]
		),
		password: new FormControl(
			'',
			[Validators.required, Validators.maxLength(190)]
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

	// from the auth-service
	setEmailPassword(): void {
		var emailFromUserService: string = this._userService.getEmailPassword().email;
		var passwordFromUserService: string = this._userService.getEmailPassword().password;

		// verify if the email and password have been set
		if(emailFromUserService === '' && passwordFromUserService === '') {
			this.router.navigateByUrl('/home');
		}
		else {
			this.registerForm.patchValue({
				email: emailFromUserService,
				password: passwordFromUserService,
				password_confirmation: passwordFromUserService
			});
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
			this._userService.registerServer(this.registerForm)
				.subscribe(
					(user) => {
						if(user != null) {
							this.message.create('success', `Votre demande de modification de profile a été faite.`);

							// log the user in
							this._userService.loginClient(user);
						}
						else {
							this.message.create('error', `Email déjà pris! Essayez avec un autre email.`);
							this.cleanRegisterPwd();
						}
					},
					(error) => {
						this.message.create('error', `Aïe! une erreur c'est produite!`);
						console.error(error);
					}
				);
		}
	}

	cleanRegisterPwd(){
		this.registerForm.patchValue({
			password: '',
			password_confirmation: ''
		});
	}

}
