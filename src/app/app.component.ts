import { Component } from '@angular/core';

import { ApiService } from './services';

import '../style/app.scss';
import '../style/angular-material-theme.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 75;

  testItems = this.api.testItems;

  constructor(private api: ApiService) {

  }
}
