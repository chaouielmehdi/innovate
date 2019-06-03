import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css'],
	animations: [ fade ]
})
export class SettingsComponent implements OnInit {

	/**
	 * Creates an instance of products component.
	 */
	constructor() { }

	/**
	 * on init
	 */
	ngOnInit() {
	}
}
