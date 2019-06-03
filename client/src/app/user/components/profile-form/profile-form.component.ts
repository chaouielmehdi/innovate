import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { UserService } from 'src/app/user/services/user.service';
import { User } from 'src/app/shared/models/User';
import { NzMessageService } from 'ng-zorro-antd';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-profile-form',
	templateUrl: './profile-form.component.html',
	styleUrls: ['./profile-form.component.css'],
	animations: [ fade ]
})
export class ProfileFormComponent implements OnInit {

	/*
	-------------------------------------------------
	General
	-------------------------------------------------
	*/
	constructor(
		private fb: FormBuilder,
		private message: NzMessageService,
		private _drawerService: DrawerService,
		private _userService: UserService,
	) { }

	ngOnInit() {
		this._drawerService.closeRegister();

		// the User connected
		this.getUser();
	}


	/*
	-------------------------------------------------
	Connected User
	-------------------------------------------------
	*/
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
					)
				}
				else {
					this.user = new User();
				}
			},
			(error) => {
				this.user = new User();
				console.log("error : ", error);
			},
			() => {
				this.setFormData();
			});
	}

	/*
	-------------------------------------------------
	Form
	-------------------------------------------------
	*/

	userForm: FormGroup = this.fb.group({
		username: new FormControl(
			'',
			[Validators.required, Validators.maxLength(190)]
		),
		canal: new FormControl(
			'Hotel',
			[Validators.required, Validators.maxLength(190)]
		),
		address: new FormControl(
			'',
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
			'',
			[Validators.required, Validators.maxLength(190)]
		),
		website: new FormControl(
			'',
			[Validators.maxLength(190), Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$')]
		)
	},
	{
		validator: passwordConfirmationValidator
	});

	passwordVisible: boolean = false;

	// from the auth-service
	setFormData(): void {
		this.userForm.patchValue({
			username: this.user.name,
			canal: this.user.canal,
			address: this.user.address,
			email: this.user.email,
			password: '',
			password_confirmation: '',
			phone_number: this.user.phone_number,
			website: this.user.website
		});

	}

	submitUserForm(){
		// show the errors
		for (const key in this.userForm.controls) {
			this.userForm.controls[ key ].markAsDirty();
			this.userForm.controls[ key ].updateValueAndValidity();
		}

		// validation
		var isUserFormValid: boolean =
			!(
				this.userForm.get('username').invalid ||
				this.userForm.get('email').invalid ||
				this.userForm.get('password').invalid ||
				this.userForm.get('password_confirmation').invalid ||
				this.userForm.get('phone_number').invalid ||
				this.userForm.get('website').invalid ||
				this.userForm.errors.misMatch
			);

		// if userForm valid
		if(isUserFormValid){
			this._userService.updateUserServer(this.userForm)
				.subscribe(
					(user) => {
						if(user != null) {
							this.message.create('success', `Votre demande de modification de profile a été faite.`);
						}
						else {
							this.message.create('error', `Informations érronées! réessayez s'il vous plaît!`);
							this.cleanFormPwd();
						}
					},
					(error) => {
						this.message.create('error', `Aïe! une erreur c'est produite!`);
						console.error(error);
					}
				);
		}
	}

	cleanFormPwd(){
		this.userForm.patchValue({
			password: '',
			password_confirmation: ''
		});
	}

}
