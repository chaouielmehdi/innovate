import { Component, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordConfirmationValidator } from 'src/app/shared/functions/password-confirmation-validator';
import { UserService } from 'src/app/user/services/user.service';
import { User } from 'src/app/shared/models/User';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { fade } from 'src/app/shared/animations/fade';
import { Observable, Observer } from 'rxjs';
import { createUserLogoUrl, userLogoBaseUrl } from 'src/app/shared/app-config/URLs';
import { Router } from '@angular/router';

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
		private router: Router,
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
				this.setUserLogo();
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
			'',
			[Validators.required, Validators.email, Validators.maxLength(190)]
		),
		oldPassword: new FormControl(
			'',
			[Validators.required, Validators.maxLength(190)]
		),
		password: new FormControl(
			'',
			[Validators.required, Validators.maxLength(190), Validators.minLength(6)]
		),
		password_confirmation: new FormControl(
			'',
			[Validators.required]
		),
		phone: new FormControl(
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

	oldPasswordVisible: boolean = false;
	passwordVisible: boolean = false;
	editLoader: boolean = false;

	/**
	 * setFormData from the auth-service
	 */
	setFormData(): void {
		this.userForm.patchValue({
			email: this.user.email,
			oldPassword: 'mehdii',
			password: 'mehdii',
			password_confirmation: 'mehdii',
			username: this.user.name,
			canal: this.user.canal,
			address: this.user.address,
			phone: this.user.phone,
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
				// front-end validation
				this.userForm.get('email').invalid ||
				this.userForm.get('oldPassword').invalid ||
				this.userForm.get('password').invalid ||
				this.userForm.get('password_confirmation').invalid ||
				this.userForm.get('username').invalid ||
				this.userForm.get('canal').invalid ||
				this.userForm.get('address').invalid ||
				this.userForm.get('phone').invalid ||
				this.userForm.get('website').invalid ||
				this.userForm.errors.misMatch
			);

		// if userForm valid
		if(isUserFormValid){
			// turn the button's loader on
			this.editLoader = true;
			
			// if there is a logo then 
			if(this.logoName !== ''){
				this.userForm.addControl('logo', new FormControl((this.logoName)));
			}

			this._userService.updateUserServer(this.userForm).subscribe(
				(user) => {
					if(user != null) {
						this.message.create('success', `Votre demande de modification de profile a été faite.`);
						
						// redirect to dashboard
						this.router.navigateByUrl('/dashboard');
					}
					else {
						this.message.create('error', `Informations érronées! réessayez s'il vous plaît!`);
						this.cleanFormPwd();
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
					this.editLoader = false;
				});
		}
		else {
			this.scrollTo('email');
		}
	}

	cleanFormPwd(){
		this.userForm.patchValue({
			oldPassword: '',
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
	logo input
	-------------------------------------------------
	*/
	showUploadList = {
		showPreviewIcon: true,
		showRemoveIcon: true,
		hidePreviewIconInNonImage: false
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

	/**
	 * Sets user logo after setting the user
	 */
	setUserLogo(){
		this.fileList = [
			{
				uid: -1,
				name: 'user-logo',
				status: 'done',
				url: this.user.logo
			}
		];
	}
	
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
				this.errorLogo = 'Le logo ne doit pas dépasser 5Mo!';
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
