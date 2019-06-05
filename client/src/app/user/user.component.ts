import { Component, OnInit } from '@angular/core';
import { fade } from '../shared/animations/fade';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [ fade ]
})
export class UserComponent implements OnInit {
	
	title = 'client';

	constructor() { }

	ngOnInit(){
	}
}
