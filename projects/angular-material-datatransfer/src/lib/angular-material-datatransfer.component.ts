import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { DatatransferFacade } from './facades/datatransfer.facade';
import { IProgressContainer } from './models/progress-container.model';
import { ConfigService } from './services/config.service';
import { DatatransferFacadeFactory } from './factories/datatransfer-facade.factory';
import { DatatransferStore } from './stores/datatransfer.store';
import { PaginationService } from './services/pagination.service';
import { CustomEventType, CustomEventTypeExtensions } from './enums/custom-event-type.enum';
import { IAppConfig } from './models/app-config.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'angular-material-datatransfer',
  templateUrl: './angular-material-datatransfer.component.html'
})
export class AngularMaterialDatatransferComponent implements OnInit, AfterViewInit {

  config: IAppConfig;
  datatransferFacade: DatatransferFacade;
  uploadProgress: IProgressContainer;
  downloadProgress: IProgressContainer;

  constructor(@Inject('ConfigCustomEvent') private configCustomEvent: any, private datatransferFacadeFactory: DatatransferFacadeFactory,
              private configService: ConfigService, public datatransferStore: DatatransferStore,
              public paginationService: PaginationService) {
    this.setConfig(this.configCustomEvent);
    this.datatransferFacade = this.datatransferFacadeFactory.createDatatransferFacade();
    this.uploadProgress = this.datatransferStore.uploadProgress;
    this.downloadProgress = this.datatransferStore.downloadProgress;
  }

  ngOnInit() {
    document.dispatchEvent(new Event(CustomEventTypeExtensions.toString(CustomEventType.INIT)));
    // _.each(this.demoService.testItems, function (item: IDatatransferItem) {
    //   this.datatransferFacade.addItem(item);
    // }.bind(this));
  }

  ngAfterViewInit() {
    if (this.config.core.showUploadDropzone) {
      const dropzoneElement = document.getElementById('amd-dropzone-component');
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

  public setConfig(event: any): void {
    this.configService.load(event);
    this.config = ConfigService.settings;
    this.paginationService.setRppOptions(ConfigService.settings.core.paginationRppOptions);
  }
}
