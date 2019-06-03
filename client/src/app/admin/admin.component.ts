import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

	title = 'admin';

	// Scroll to the top when onInit
	subscription: Subscription;

	constructor(
		private router: Router
	) { }

	ngOnInit(){
		// Scroll to the top when onInit
		this.subscription = this.router.events
		.pipe(
			filter((event) => event instanceof NavigationEnd)
		)
		.subscribe(() => window.scrollTo(0,0));
	}
}
