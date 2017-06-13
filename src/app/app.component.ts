import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';

import { LoggerService, PaginationService, DemoService } from './services';
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
  // tslint:disable-next-line:component-selector
  selector: 'angular-material-datatransfer',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

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
  downloadProgress: IProgressInformation;

  r = undefined;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, private logger: LoggerService,
    private datatransferFacadeFactory: DatatransferFacadeFactory, private datatransferStore: DatatransferStore,
    private paginationService: PaginationService, private demoService: DemoService) {

  }

  ngOnInit() {
    let dropzoneElement = document.getElementById('dropzoneElement');
    this.datatransferFacade = this.datatransferFacadeFactory.createDatatransferFacade();
    this.datatransferFacade.assignUploadBrowse(dropzoneElement);
    this.datatransferFacade.assignUploadDrop(dropzoneElement);
    this.uploadProgress = this.datatransferStore.uploadProgress;
    this.downloadProgress = this.datatransferStore.downloadProgress;
    this.paginationService.setRppOptions(this.options.pagination.rppOptions);

    // _.each(this.demoService.testItems, function (item: IDatatransferItem) {
    //   this.datatransferFacade.addItem(item);
    // }.bind(this));

    // tslint:disable-next-line
    // https://stackoverflow.com/questions/36997625/angular-2-communication-of-typescript-functions-with-external-js-libraries/36997723#36997723

    // https://stackoverflow.com/questions/35296704/angular2-how-to-call-component-function-from-outside-the-app
    window['angularMaterialDatatransfer'] = { component: this, zone: this.zone };
  }

  ngOnDestroy() {
    window['angularMaterialDatatransfer'] = null;
  }

  public testFn(): void {
    console.log('testFn');
  }

  @HostListener('window:amd.download-item', ['$event'])
  public test(event): void {
    console.log(event);
    console.log(event.detail);
  }
}
