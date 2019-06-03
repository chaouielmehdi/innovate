import { Component, OnInit } from '@angular/core';
import { fade } from 'src/app/shared/animations/fade';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
  animations: [ fade ]
})
export class SupportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
