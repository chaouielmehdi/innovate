import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [ fade ]
})
export class ContactComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
