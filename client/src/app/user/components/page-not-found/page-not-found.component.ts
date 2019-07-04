import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Location } from '@angular/common';
import { PageNotFoundService } from 'src/app/user/services/page-not-found.service';
import { Router, NavigationEnd } from '@angular/router';
import { fade } from 'src/app/shared/animations/fade';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
  animations: [ fade ]
})
export class PageNotFoundComponent implements OnInit {

	loggedIn: boolean = false;
	pageName: string = 'Page';
	title: string = 'Oups! '+this.pageName+' introuvable.';
	backward: { btnName: string, btnUrl: string, btnIcon: string } = {btnName: '', btnUrl: '', btnIcon: ''};

	constructor(
		private location: Location,
		private router: Router,
		private _userService: UserService,
		private _pageNotFoundService: PageNotFoundService
	) { }

	ngOnInit() {
		// change the url from '/page-not-found'
		// to the url of the page that redirect to here
		
		this.location.replaceState(
			this._pageNotFoundService.getPreviousUrl()
		);
		

		// get user status
		this._userService.authStatus$.subscribe(
			(status) => this.loggedIn = status
		);
		
		// get page name from _pageNotFoundService
		this.pageName = this._pageNotFoundService.getPage();
		this.title = 'Oups! '+this.pageName+' introuvable.';
		this.setBackwardSet();
	}

	setBackwardSet(){
		switch (this.pageName) {
			case 'Commande':
				this.backward.btnName = 'Commandes';
				this.backward.btnUrl = '/commands';
				this.backward.btnIcon = 'fas fa-clipboard-list';
				break;
			
			case 'Produit':
				this.backward.btnName = 'Produits';
				this.backward.btnUrl = '/products';
				this.backward.btnIcon = 'fas fa-box-open';
				break;
			
			default:
				this.backward.btnName = '';
				this.backward.btnUrl = '';
				this.backward.btnIcon = '';
				break;
		}
	}

}
