import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
  	styleUrls: ['./clients.component.css'],
	  animations: [ fade ]
})
export class ClientsComponent implements OnInit {

	/**
	 * Creates an instance of clients component.
	 */
	constructor() { }

	/**
	 * on init
	 */
	ngOnInit() {
	}

}
