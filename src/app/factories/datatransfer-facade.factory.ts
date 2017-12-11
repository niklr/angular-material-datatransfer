import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatatransferFacade } from '../facades';
import { ResumableJsUploader, BlobDownloader } from '../io';
import { IAppConfig } from '../models';
import { LoggerService, PaginationService, ExportService, CryptoService } from '../services';
import { DatatransferStore } from '../stores';
import { DateUtil, GuidUtil } from '../utils';

@Injectable()
export class DatatransferFacadeFactory {

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore, private dateUtil: DateUtil,
        private guidUtil: GuidUtil, private paginationService: PaginationService, private exportService: ExportService,
        private dialog: MatDialog, private cryptoService: CryptoService) {

    }

    // TODO: pass arguments to define which uploader/downloader implementation should be used
    public createDatatransferFacade(config: IAppConfig): DatatransferFacade {
        return new DatatransferFacade(
            this.logger,
            config,
            this.zone,
            this.store,
            this.dateUtil,
            this.paginationService,
            this.exportService,
            new ResumableJsUploader(this.logger, config, this.guidUtil, this.cryptoService),
            new BlobDownloader(this.logger, config, this.guidUtil, this.cryptoService),
            this.dialog);
    }
}
