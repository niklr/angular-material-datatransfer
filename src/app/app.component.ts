import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

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
export class AppComponent implements OnInit, AfterViewInit {

  config: IAppConfig;
  datatransferFacade: DatatransferFacade;
  uploadProgress: IProgressInformation;
  downloadProgress: IProgressInformation;

  constructor(private logger: LoggerService,
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

  ngAfterViewInit() {
    if (this.config.core.showUploadDropzone) {
      let dropzoneElement = document.getElementById('amd-dropzone-component');
      if (!!dropzoneElement) {
        this.datatransferFacade.assignUploadBrowse(dropzoneElement);
        this.datatransferFacade.assignUploadDrop(dropzoneElement);
      }
    } else {
      if (typeof this.config.core.uploadBrowseElementId !== 'undefined') {
        this.datatransferFacade.assignUploadBrowse(document.getElementById(this.config.core.uploadBrowseElementId));
      }
      if (typeof this.config.core.uploadDropElementId !== 'undefined') {
        this.datatransferFacade.assignUploadDrop(document.getElementById(this.config.core.uploadDropElementId));
      }
    }
  }

  @HostListener('window:amd.set-config', ['$event'])
  public setConfig(event): void {
    if (!!event && !!event.detail) {
      let config: IAppConfig = event.detail;

      if (!!config.core) {
        Object.keys(config.core).forEach(propertyName => {
          if (typeof config.core[propertyName] !== 'undefined') {
            this.config.core[propertyName] = config.core[propertyName];
          }
        });
      }
      if (!!config.resumablejs) {
        Object.keys(config.resumablejs).forEach(propertyName => {
          if (typeof config.resumablejs[propertyName] !== 'undefined') {
            this.config.resumablejs[propertyName] = config.resumablejs[propertyName];
          }
        });
      }
    }

    this.datatransferFacade = this.datatransferFacadeFactory.createDatatransferFacade(this.config);
    this.uploadProgress = this.datatransferStore.uploadProgress;
    this.downloadProgress = this.datatransferStore.downloadProgress;
    this.paginationService.setRppOptions(this.config.core.paginationRppOptions);
  }

  @HostListener('window:amd.download-item', ['$event'])
  public downloadItem(event): void {
    if (!!event && !!event.detail) {
      let item = event.detail;
      this.datatransferFacade.download(item.filename, item.url, item.size);
    }
  }
}
