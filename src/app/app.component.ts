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

  showPath(index: number): boolean {
    if (index > 0 && this.testItems.length > index) {
      let currentPath = this.testItems[index].path;
      // switch (currentPath) {
      //   case undefined:
      //   case '':
      //   case '\\':
      //   case '/':
      //     return false;
      // }
      // don't show if previous path is same as current
      return this.testItems[index - 1].path !== currentPath;
    }
    return true;
  }
}
