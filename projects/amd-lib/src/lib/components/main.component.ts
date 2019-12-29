import { Component, Input, AfterViewInit } from '@angular/core';
import { IAppConfig } from '../models/app-config.model';
import { DatatransferFacade } from '../facades/datatransfer.facade';
import { IProgressContainer } from '../models/progress-container.model';
import { ConfigService } from '../services/config.service';
import { PaginationService } from '../services/pagination.service';
import { DatatransferStore } from '../stores/datatransfer.store';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'amd-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements AfterViewInit {

  @Input()
  datatransferFacade: DatatransferFacade;

  config: IAppConfig;
  uploadProgress: IProgressContainer;
  downloadProgress: IProgressContainer;

  constructor(public datatransferStore: DatatransferStore, public paginationService: PaginationService) {
    this.config = ConfigService.settings;
    this.uploadProgress = this.datatransferStore.uploadProgress;
    this.downloadProgress = this.datatransferStore.downloadProgress;
  }

  ngAfterViewInit(): void {
    this.init();
  }

  private init(): void {
    if (this.config.core.showUploadDropzone) {
      const dropzoneElement = document.getElementById('amd-dropzone-component');
      if (dropzoneElement) {
        dropzoneElement.addEventListener('click', this.datatransferFacade.openBrowseDialog.bind(this.datatransferFacade), false);
        this.datatransferFacade.assignUploadDrop(dropzoneElement);
      }
    } else {
      if (typeof this.config.core.uploadBrowseElementId !== 'undefined') {
        const uploadBrowseElement = document.getElementById(this.config.core.uploadBrowseElementId);
        if (uploadBrowseElement) {
          uploadBrowseElement.addEventListener('click', this.datatransferFacade.openBrowseDialog.bind(this.datatransferFacade), false);
        }
      }
      if (typeof this.config.core.uploadDropElementId !== 'undefined') {
        const uploadDropElement = document.getElementById(this.config.core.uploadDropElementId);
        if (uploadDropElement) {
          this.datatransferFacade.assignUploadDrop(uploadDropElement);
        }
      }
    }
  }

}
