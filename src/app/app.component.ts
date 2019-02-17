import { Component, Inject, OnInit, AfterViewInit, HostListener } from '@angular/core';

import { LoggerService, PaginationService, DemoService } from './services';
import { DatatransferFacade } from './facades';
import { DatatransferFacadeFactory } from './factories';
import { DatatransferStore } from './stores';
import { IAppConfig, AppConfig, IProgressContainer } from './models';
import { CustomEventType } from './enums';

import * as _ from 'underscore';

import '../style/app.scss';
import '../style/angular-material-theme.scss';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'angular-material-datatransfer',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  config: IAppConfig;
  datatransferFacade: DatatransferFacade;
  uploadProgress: IProgressContainer;
  downloadProgress: IProgressContainer;

  constructor( @Inject('ConfigCustomEvent') private configCustomEvent: any, private logger: LoggerService,
    private datatransferFacadeFactory: DatatransferFacadeFactory, private datatransferStore: DatatransferStore,
    private paginationService: PaginationService, private demoService: DemoService) {
    this.config = new AppConfig();
    this.setConfig(configCustomEvent);
  }

  ngOnInit() {
    document.dispatchEvent(new Event(CustomEventType.toString(CustomEventType.INIT)));
    // _.each(this.demoService.testItems, function (item: IDatatransferItem) {
    //   this.datatransferFacade.addItem(item);
    // }.bind(this));
  }

  ngAfterViewInit() {
    if (this.config.core.showUploadDropzone) {
      let dropzoneElement = document.getElementById('amd-dropzone-component');
      if (!!dropzoneElement) {
        dropzoneElement.addEventListener('click', this.datatransferFacade.openBrowseDialog.bind(this.datatransferFacade), false);
        this.datatransferFacade.assignUploadDrop(dropzoneElement);
      }
    } else {
      if (typeof this.config.core.uploadBrowseElementId !== 'undefined') {
        document.getElementById(this.config.core.uploadBrowseElementId)
          .addEventListener('click', this.datatransferFacade.openBrowseDialog.bind(this.datatransferFacade), false);
      }
      if (typeof this.config.core.uploadDropElementId !== 'undefined') {
        this.datatransferFacade.assignUploadDrop(document.getElementById(this.config.core.uploadDropElementId));
      }
    }
  }

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

  @HostListener('document:' + CustomEventType.toString(CustomEventType.DOWNLOAD_ITEM), ['$event'])
  public downloadItem(event): void {
    if (!!event && !!event.detail) {
      let item = event.detail;
      this.datatransferFacade.download(item.filename, item.url, item.size);
    }
  }
}
