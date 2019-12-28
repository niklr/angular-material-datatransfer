import { Component, OnInit, ApplicationRef } from '@angular/core';
import { DatatransferFacade } from './facades/datatransfer.facade';
import { IProgressContainer } from './models/progress-container.model';
import { LoggerService } from './services/logger.service';
import { ConfigService } from './services/config.service';
import { DatatransferFacadeFactory } from './factories/datatransfer-facade.factory';
import { DatatransferStore } from './stores/datatransfer.store';
import { PaginationService } from './services/pagination.service';
import { CustomEventType, CustomEventTypeExtensions } from './enums/custom-event-type.enum';
import { IAppConfig } from './models/app-config.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'angular-material-datatransfer-lib',
  templateUrl: './angular-material-datatransfer.component.html'
})
export class AngularMaterialDatatransferComponent implements OnInit {

  componentId: number;

  isCreated = false;
  config: IAppConfig;
  datatransferFacade: DatatransferFacade;
  uploadProgress: IProgressContainer;
  downloadProgress: IProgressContainer;

  constructor(private logger: LoggerService, private ref: ApplicationRef, private datatransferFacadeFactory: DatatransferFacadeFactory,
              private configService: ConfigService, public datatransferStore: DatatransferStore,
              public paginationService: PaginationService) {
    this.componentId = Math.random();
  }

  ngOnInit() {
    document.dispatchEvent(new Event(CustomEventTypeExtensions.toString(CustomEventType.INIT)));
    // _.each(this.demoService.testItems, function (item: IDatatransferItem) {
    //   this.datatransferFacade.addItem(item);
    // }.bind(this));
  }

  private init(): void {
    if (this.config.core.showUploadDropzone) {
      const dropzoneElement = document.getElementById('amd-dropzone-component');
      if (dropzoneElement) {
        // this.removeAllEventListeners(dropzoneElement);
        dropzoneElement.addEventListener('click', this.datatransferFacade.openBrowseDialog.bind(this.datatransferFacade), false);
        this.datatransferFacade.assignUploadDrop(dropzoneElement);
      }
    } else {
      if (typeof this.config.core.uploadBrowseElementId !== 'undefined') {
        const uploadBrowseElement = document.getElementById(this.config.core.uploadBrowseElementId);
        if (uploadBrowseElement) {
          // this.removeAllEventListeners(uploadBrowseElement);
          uploadBrowseElement.addEventListener('click', this.datatransferFacade.openBrowseDialog.bind(this.datatransferFacade), false);
        }
      }
      if (typeof this.config.core.uploadDropElementId !== 'undefined') {
        const uploadDropElement = document.getElementById(this.config.core.uploadDropElementId);
        if (uploadDropElement) {
          // this.removeAllEventListeners(uploadDropElement);
          this.datatransferFacade.assignUploadDrop(uploadDropElement);
        }
      }
    }
  }

  private removeAllEventListeners(element: HTMLElement): void {
    const elementClone = element.cloneNode(true);
    element.parentNode.replaceChild(elementClone, element);
  }

  public create(event: any): void {
    if (!this.isCreated) {
      this.setConfig(event);
      this.isCreated = true;
      this.ref.tick();
      this.init();
    }
  }

  public setConfig(event: any): void {
    this.configService.load(event);
    this.config = ConfigService.settings;
    this.datatransferFacade = this.datatransferFacadeFactory.createDatatransferFacade();
    this.uploadProgress = this.datatransferStore.uploadProgress;
    this.downloadProgress = this.datatransferStore.downloadProgress;
    this.paginationService.setRppOptions(ConfigService.settings.core.paginationRppOptions);
    this.logger.log('AngularMaterialDatatransferComponent.componentId: ' + this.componentId);
  }
}
