import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-commercials',
	templateUrl: './commercials.component.html',
  	styleUrls: ['./commercials.component.css'],
	  animations: [ fade ]
})
export class CommercialsComponent implements OnInit {

	/**
	 * Creates an instance of commercials component.
	 */
	constructor() { }

	/**
	 * on init
	 */
	ngOnInit() {
	}

}
