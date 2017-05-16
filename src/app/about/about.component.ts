import { Component, OnInit } from '@angular/core';

import { ApiService } from '../shared';

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 75;

  testItems = this.api.testItems;

  constructor(private api: ApiService) {

  }

  ngOnInit() {
    console.log('Hello About');
  }

}
