import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';

import { ApiService, LoggerService, PaginationService } from './services';
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

  uploadProgress: IProgressInformation;

  r = undefined;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, private api: ApiService,
    private datatransferFacadeFactory: DatatransferFacadeFactory, private logger: LoggerService,
    private datatransferStore: DatatransferStore, private paginationService: PaginationService) {

  }

  ngOnInit() {
    let dropzoneElement = document.getElementById('dropzoneElement');
    this.datatransferFacade = this.datatransferFacadeFactory.createDatatransferFacade();
    this.datatransferFacade.assignUploadBrowse(dropzoneElement);
    this.datatransferFacade.assignUploadDrop(dropzoneElement);
    this.uploadProgress = this.datatransferStore.uploadProgress;
    this.paginationService.setRppOptions(this.options.pagination.rppOptions);

    // _.each(this.api.testItems, function (item: IDatatransferItem) {
    //   this.datatransferFacade.addItem(item);
    // }.bind(this));
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

  testFn(): void {
    this.datatransferFacade.removeAll();
  }
}
