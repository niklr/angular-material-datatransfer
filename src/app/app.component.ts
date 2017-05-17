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
  testItem0 = this.testItems[0];

  constructor(private api: ApiService) {
    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.testItem0.progress = (this.testItem0.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 200);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Uploading':
        return 'fa fa-arrow-circle-o-up';
      case 'Downloading':
        return 'fa fa-arrow-circle-o-down';
      case 'Failed':
        return 'fa fa-exclamation-circle';
      case 'Queued':
        return 'fa fa-circle-o';
      default:
        return '';
    }
  }

  calculateProgressSize(item): number {
    return Number((item.progress / 100 * item.size).toFixed(2));
  }

  toggleAll(checked: boolean): void {
    this.testItems.forEach(element => {
      element.isSelected = checked;
    });
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
