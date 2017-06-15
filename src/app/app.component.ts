import { Component, OnInit, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';

import { LoggerService, PaginationService, DemoService } from './services';
import { DecimalByteUnitUtil } from './utils';
import { DatatransferFacade } from './facades';
import { DatatransferFacadeFactory } from './factories';
import { DatatransferStore } from './stores';
import { IAppConfig, AppConfig, IDatatransferItem, IProgressInformation } from './models';
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
export class AppComponent implements OnInit {

  config: IAppConfig;
  datatransferFacade: DatatransferFacade;
  uploadProgress: IProgressInformation;
  downloadProgress: IProgressInformation;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, private logger: LoggerService,
    private datatransferFacadeFactory: DatatransferFacadeFactory, private datatransferStore: DatatransferStore,
    private paginationService: PaginationService, private demoService: DemoService) {
      this.config = new AppConfig();
  }

  ngOnInit() {
    window.dispatchEvent(new Event('amd.init'));

    // _.each(this.demoService.testItems, function (item: IDatatransferItem) {
    //   this.datatransferFacade.addItem(item);
    // }.bind(this));
  }

  public downloadAll(): void {
    _.each(this.demoService.testDownloadItems, function (item) {
      this.datatransferFacade.download(item.filename, '/files/' + item.filename, item.size);
    }.bind(this));
  }

  public isUndefined(value) {
    return (typeof value === 'undefined' || value === null);
  }

  @HostListener('window:amd.set-config', ['$event'])
  public setConfig(event): void {
    if (!!event && !!event.detail) {
      let config: IAppConfig = event.detail;
      if (!this.isUndefined(config.showUploadDropzone)) {
        this.config.showUploadDropzone = config.showUploadDropzone;
      }
      if (!!config.paginationRppOptions) {
        this.config.paginationRppOptions = config.paginationRppOptions;
      }
    }

    this.datatransferFacade = this.datatransferFacadeFactory.createDatatransferFacade(this.config);
    this.uploadProgress = this.datatransferStore.uploadProgress;
    this.downloadProgress = this.datatransferStore.downloadProgress;
    this.paginationService.setRppOptions(this.config.paginationRppOptions);

    if (this.config.showUploadDropzone) {
      let dropzoneElement = document.getElementById('amd-dropzone-component');
      if (!!dropzoneElement) {
        this.datatransferFacade.assignUploadBrowse(dropzoneElement);
        this.datatransferFacade.assignUploadDrop(dropzoneElement);
      }
    }
  }

  @HostListener('window:amd.download-item', ['$event'])
  public downloadItem(event): void {
    console.log(event);
    console.log(event.detail);
  }

  @HostListener('window:amd.assign-elements', ['$event'])
  public assignElements(event): void {
    if (!!event && !!event.detail) {
      if (!!event.detail.uploadBrowseElementId) {
        this.datatransferFacade.assignUploadBrowse(document.getElementById(event.detail.uploadBrowseElementId));
      }
    }
  }
}
