import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoggerService } from '../services/logger.service';
import { DatatransferStore } from '../stores/datatransfer.store';
import { DateUtil } from '../utils/date.util';
import { PaginationService } from '../services/pagination.service';
import { ExportService } from '../services/export.service';
import { DatatransferFacade } from '../facades/datatransfer.facade';
import { ResumableJsUploader } from '../io/uploaders/resumablejs.uploader';
import { BlobDownloader } from '../io/downloaders/blob.downloader';

@Injectable()
export class DatatransferFacadeFactory {

    private facade1: DatatransferFacade;

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore,
                private dateUtil: DateUtil, private paginationService: PaginationService,
                private exportService: ExportService, private dialog: MatDialog,
                private resumableUploader: ResumableJsUploader, private blobDownloader: BlobDownloader) {

    }

    // TODO: pass arguments to define which uploader/downloader implementation should be used
    public createDatatransferFacade(): DatatransferFacade {
        if (!this.facade1) {
            this.facade1 = new DatatransferFacade(
                this.logger,
                this.zone,
                this.store,
                this.dateUtil,
                this.paginationService,
                this.exportService,
                this.resumableUploader,
                this.blobDownloader,
                this.dialog);
        }
        return this.facade1;
    }
}
