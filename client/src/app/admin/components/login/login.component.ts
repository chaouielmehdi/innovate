import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { DrawerService } from '../../services/drawer.service';
import { AdminService } from '../../services/admin.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	animations: [ fade ]
})
export class LoginComponent implements OnInit {

	/**
	 * Creates an instance of dashboard component.
	 */
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private _adminService: AdminService,
		private _tokenService: TokenService,
		private _drawerService: DrawerService
	) { }

	/**
	 * on init
	 */
	ngOnInit() {
		// login form initialization
		this.initLoginForm();
	}
	






	

	// -------------------------------------------------
	// login form
	// -------------------------------------------------

	loginForm: FormGroup;
	loginErrorMsg: string = '';

	initLoginForm(){
		this.loginForm = this.fb.group({
			email: ['mehdi.mc60@gmail.com', [Validators.required, Validators.maxLength(190), Validators.email]],
			password: ['mehdii', [Validators.required, Validators.maxLength(190)]],
			remember: [true]
		});
	}

	submitLoginForm(): void {
		for (const i in this.loginForm.controls) {
			this.loginForm.controls[i].markAsDirty();
			this.loginForm.controls[i].updateValueAndValidity();
		}

		if(!this.loginForm.invalid) {
			this._adminService.loginServer(this.loginForm)
				.subscribe(
					(admin) => {
						if(admin != null) {
							this.loginErrorMsg = '';
							this._adminService.loginClient(admin);
						}
						else {
							this.loginErrorMsg = 'Email ou mot de passe invalide';
							this.cleanLoginPwd();
						}
					},
					(error) => {
						this.loginErrorMsg = "Aïe! une erreur c'est produite";
						console.error(error);
					}
				);
		}
	}

	cleanLoginPwd(){
		this.loginForm.patchValue({
			password: ''
		});
	}
	

}
