import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
	animations: [ fade ]
})
export class ProductsComponent implements OnInit {

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
