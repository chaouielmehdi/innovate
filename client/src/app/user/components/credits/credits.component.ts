import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-credits',
	templateUrl: './credits.component.html',
	styleUrls: ['./credits.component.css'],
	animations: [ fade ]
})
export class CreditsComponent implements OnInit {

	constructor(
		private router: Router
	) { }

	ngOnInit() {
	}



	/*
	-------------------------------------------------
	Backward
	-------------------------------------------------
	*/

	toDashboard(): void{
		this.router.navigateByUrl('/dashboard');
	}
}
