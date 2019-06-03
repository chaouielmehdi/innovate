import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	animations: [ fade ]
})
export class DashboardComponent implements OnInit {

	/**
	 * Creates an instance of dashboard component.
	 */
	constructor() { }

	/**
	 * on init
	 */
	ngOnInit() {
	}

}
