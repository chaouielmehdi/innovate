import { Component } from '@angular/core';
import { fade } from './shared/animations/fade';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ fade ]
})
export class AppComponent {
	title = 'client';

	// Scroll to the top onInit
	subscription: Subscription;

	constructor(
		private router: Router
	) { }

	ngOnInit(){
		// Scroll to the top onInit
		this.subscription = this.router.events
		.pipe(
			filter((event) => event instanceof NavigationEnd)
		)
		.subscribe(() => window.scrollTo(0,0));
	}
}
