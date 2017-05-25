import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';

import { ApiService, LoggerService } from './services';
import { DecimalByteUnitUtil } from './utils';
import { DatatransferFacade } from './facades';
import { DatatransferFacadeFactory } from './factories';
import { DatatransferStore } from './stores';
import { IDatatransferItem, IProgressInformation } from './models';
import { TransferStatus } from './enums';

import * as _ from 'underscore';

import '../style/app.scss';
import '../style/angular-material-theme.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  datatransferFacade: DatatransferFacade;
  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 75;

  options = {
    pagination: {
      rppOptions: [5, 10, 15]
    }
  };

  paginatedItems: IDatatransferItem[] = [];
  uploadProgress: IProgressInformation;
  testItem0: IDatatransferItem = undefined;

  r = undefined;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, private api: ApiService,
    private datatransferFacadeFactory: DatatransferFacadeFactory, private logger: LoggerService,
    private datatransferStore: DatatransferStore) {
    // Update the value for the progress-bar on an interval.
    /*    setInterval(() => {
          this.testItem0.progress = (this.testItem0.progress + Math.floor(Math.random() * 4) + 1) % 100;
        }, 200);*/
    this.datatransferFacade = datatransferFacadeFactory.createDatatransferFacade();
    _.each(this.api.testItems, function (item: IDatatransferItem) {
      // this.datatransferStore.addItem(item);
    }.bind(this));
    this.testItem0 = this.api.testItems[0];
  }

  ngOnInit() {
    let dropzoneElement = document.getElementById('dropzoneElement');
    this.datatransferFacade.assignUploadBrowse(dropzoneElement);
    this.datatransferFacade.assignUploadDrop(dropzoneElement);
    this.uploadProgress = this.datatransferStore.uploadProgress;
  }

  getStatusClass(status: TransferStatus): string {
    switch (status) {
      case TransferStatus.Uploading:
        return 'fa fa-arrow-circle-o-up';
      case TransferStatus.Downloading:
        return 'fa fa-arrow-circle-o-down';
      case TransferStatus.Failed:
        return 'fa fa-exclamation-circle';
      case TransferStatus.Queued:
        return 'fa fa-circle-o';
      default:
        return '';
    }
  }

  toggleAll(checked: boolean): void {
    this.paginatedItems.forEach(element => {
      element.isSelected = checked;
    });
  }

  testFn(): void {
    this.datatransferFacade.removeAll();
  }

  paginateItems(event: any): void {
    // this.logger.log('startIndex: ' + event.startIndex + ' endIndex: ' + event.endIndex);
    setTimeout(() => {
      this.paginatedItems = this.datatransferStore.getItems().slice(event.startIndex, event.endIndex);
    }, 1);

    // batch actions md-menu not working anymore when calling detectChanges of ChangeDetectorRef
    // this.cdr.detectChanges();
  }
}
