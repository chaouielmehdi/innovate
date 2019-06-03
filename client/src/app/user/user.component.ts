import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { fade } from '../shared/animations/fade';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [ fade ]
})
export class UserComponent implements OnInit {
	
	title = 'client';

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
