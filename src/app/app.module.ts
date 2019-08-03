import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
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

import { AppComponent } from './app.component';
import { BrowseDialogComponent, DropzoneComponent, EditDialogComponent, PaginationComponent, ProgressComponent } from './components';
import { CsvExporter, JsonExporter } from './io';
import { LoggerService, PaginationService, ExportService, DemoService, CryptoService } from './services';
import { DatatransferStore } from './stores';
import { DatatransferFacadeFactory } from './factories';
import { CommonUtil, DateUtil, DecimalByteUnitUtil, GuidUtil } from './utils';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
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
  declarations: [
    AppComponent,
    BrowseDialogComponent,
    DropzoneComponent,
    EditDialogComponent,
    PaginationComponent,
    ProgressComponent
  ],
  entryComponents: [
    BrowseDialogComponent,
    EditDialogComponent
  ],
  providers: [
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
    JsonExporter
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) { }
}
