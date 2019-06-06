import { Component, OnInit } from '@angular/core';
import { appName } from 'src/app/shared/app-config/global-config';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	year = new Date().getFullYear();

	appName: string = appName;

	loggedIn: boolean = false;

	constructor(
		private _userService: UserService
	) { }

	ngOnInit() {
		this._userService.authStatus$.subscribe(
			(status) => this.loggedIn = status
		);
	}

}
