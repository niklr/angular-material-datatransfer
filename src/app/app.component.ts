import { Component, OnInit } from '@angular/core';

import { ApiService } from './services';
import { TestItem } from './services';
import { DecimalByteUnit, DecimalByteUnitConvertResult, DecimalByteUnitUtil } from './utils';

import * as Resumable from 'resumablejs';

import '../style/app.scss';
import '../style/angular-material-theme.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 75;

  testItems = this.api.testItems;
  testItem0 = this.testItems[0];

  r = undefined;

  constructor(private api: ApiService, private decimalByteUnitUtil: DecimalByteUnitUtil) {
    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.testItem0.progress = (this.testItem0.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 200);

    this.initResumable();
  }

  ngOnInit() {
    let dropzoneElement = document.getElementById('dropzoneElement');
    console.log(dropzoneElement);
    this.r.assignBrowse(dropzoneElement);
    this.r.assignDrop(dropzoneElement);
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

  initResumable(): void {
    this.r = new Resumable({
      target: '/echo/json/',
      query: {},
      maxChunkRetries: 2,
      maxFiles: 10,
      prioritizeFirstAndLastChunk: true,
      simultaneousUploads: 2,
      chunkSize: 1 * 1024 * 1024
    });

    this.r.on('fileAdded', function (file, event) {
      console.log(file);
      let convertResult: DecimalByteUnitConvertResult = this.decimalByteUnitUtil.toHumanReadable(file.size, DecimalByteUnit.BYTE);
      let newItem: TestItem = {
        'name': file.fileName,
        'path': file.relativePath.substr(0, file.relativePath.length - file.fileName.length),
        'size': convertResult.number,
        'sizeUnit': DecimalByteUnit[convertResult.unit],
        'transferType': 'Upload',
        'status': 'Queued',
        'progress': 0
      };

      this.testItems.push(newItem);
    }.bind(this));
    this.r.on('fileSuccess', function (file, message) {

    });
    this.r.on('fileError', function (file, message) {

    });
  }

  testFn(): void {
    this.testItems.length = 0;
    this.r.files.length = 0;
    console.log(this.r);
  }
}
