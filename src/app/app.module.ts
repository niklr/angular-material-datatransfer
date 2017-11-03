import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatMenuModule,
  MatOptionModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { DropzoneComponent, PaginationComponent, ProgressComponent } from './components';
import { CsvExporter, JsonExporter } from './io';
import { LoggerService, PaginationService, ExportService, DemoService } from './services';
import { DatatransferStore } from './stores';
import { DatatransferFacadeFactory } from './factories';
import { DateUtil, DecimalByteUnitUtil, GuidUtil } from './utils';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatOptionModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
    FlexLayoutModule
  ],
  declarations: [
    AppComponent,
    DropzoneComponent,
    PaginationComponent,
    ProgressComponent
  ],
  providers: [
    LoggerService,
    PaginationService,
    DemoService,
    ExportService,
    DatatransferStore,
    DatatransferFacadeFactory,
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
