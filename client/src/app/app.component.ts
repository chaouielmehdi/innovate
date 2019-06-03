import { Component } from '@angular/core';
import { fade } from './shared/animations/fade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ fade ]
})
export class AppComponent {
	title = 'client';

	constructor() { }
}
