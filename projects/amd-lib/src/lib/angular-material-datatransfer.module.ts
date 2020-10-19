import { NgModule, ApplicationRef } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";

import { FlexLayoutModule } from "@angular/flex-layout";

import { AngularMaterialDatatransferComponent } from "./angular-material-datatransfer.component";
import { MainComponent } from "./components/main.component";
import { BrowseDialogComponent } from "./components/browse-dialog.component";
import { DropzoneComponent } from "./components/dropzone.component";
import { EditDialogComponent } from "./components/edit-dialog.component";
import { PaginationComponent } from "./components/pagination.component";
import { ProgressComponent } from "./components/progress.component";
import { ConfigService } from "./services/config.service";
import { LoggerService } from "./services/logger.service";
import { PaginationService } from "./services/pagination.service";
import { ExportService } from "./services/export.service";
import { DemoService } from "./services/demo.service";
import { CryptoService } from "./services/crypto.service";
import { DatatransferStore } from "./stores/datatransfer.store";
import { DatatransferFacadeFactory } from "./factories/datatransfer-facade.factory";
import { CommonUtil } from "./utils/common.util";
import { DateUtil } from "./utils/date.util";
import { DecimalByteUnitUtil } from "./utils/decimal-byte-unit.util";
import { GuidUtil } from "./utils/guid.util";
import { CsvExporter } from "./io/exporters/csv.exporter";
import { JsonExporter } from "./io/exporters/json.exporter";
import { ResumableJsUploader } from "./io/uploaders/resumablejs.uploader";
import { BlobDownloader } from "./io/downloaders/blob.downloader";
import { HostDirective } from "./directives/host.directive";

@NgModule({
  declarations: [
    AngularMaterialDatatransferComponent,
    MainComponent,
    BrowseDialogComponent,
    DropzoneComponent,
    EditDialogComponent,
    PaginationComponent,
    ProgressComponent,
    HostDirective,
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
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    FlexLayoutModule,
  ],
  exports: [AngularMaterialDatatransferComponent],
  entryComponents: [MainComponent, BrowseDialogComponent, EditDialogComponent],
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
    BlobDownloader,
  ],
})
export class AngularMaterialDatatransferModule {
  constructor(public appRef: ApplicationRef) {}
}
