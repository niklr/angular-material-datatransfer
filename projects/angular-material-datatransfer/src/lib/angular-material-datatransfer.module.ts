import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatOptionModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialDatatransferComponent } from './angular-material-datatransfer.component';
import { BrowseDialogComponent } from './components/browse-dialog.component';
import { DropzoneComponent } from './components/dropzone.component';
import { EditDialogComponent } from './components/edit-dialog.component';
import { PaginationComponent } from './components/pagination.component';
import { ProgressComponent } from './components/progress.component';
import { ConfigService } from './services/config.service';
import { LoggerService } from './services/logger.service';
import { PaginationService } from './services/pagination.service';
import { ExportService } from './services/export.service';
import { DemoService } from './services/demo.service';
import { CryptoService } from './services/crypto.service';
import { DatatransferStore } from './stores/datatransfer.store';
import { DatatransferFacadeFactory } from './factories/datatransfer-facade.factory';
import { CommonUtil } from './utils/common.util';
import { DateUtil } from './utils/date.util';
import { DecimalByteUnitUtil } from './utils/decimal-byte-unit.util';
import { GuidUtil } from './utils/guid.util';
import { CsvExporter } from './io/exporters/csv.exporter';
import { JsonExporter } from './io/exporters/json.exporter';
import { ResumableJsUploader } from './io/uploaders/resumablejs.uploader';
import { BlobDownloader } from './io/downloaders/blob.downloader';

@NgModule({
  declarations: [
    AngularMaterialDatatransferComponent,
    BrowseDialogComponent,
    DropzoneComponent,
    EditDialogComponent,
    PaginationComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    FlexLayoutModule
  ],
  exports: [AngularMaterialDatatransferComponent],
  entryComponents: [
    BrowseDialogComponent,
    EditDialogComponent
  ],
  providers: [
    ConfigService,
    LoggerService,
    PaginationService,
    ExportService,
    DemoService,
    CryptoService,
    DatatransferStore,
    DatatransferFacadeFactory,
    CommonUtil,
    DateUtil,
    DecimalByteUnitUtil,
    GuidUtil,
    CsvExporter,
    JsonExporter,
    ResumableJsUploader,
    BlobDownloader
  ]
})
export class AngularMaterialDatatransferModule  {
  constructor(public appRef: ApplicationRef) { }
}
