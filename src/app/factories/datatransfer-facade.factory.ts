import { Injectable, NgZone } from '@angular/core';
import { LoggerService, PaginationService, ExportService } from '../services';
import { DatatransferFacade } from '../facades';
import { DatatransferStore } from '../stores';
import { DateUtil, GuidUtil } from '../utils';
import { ResumableJsUploader } from '../uploaders';

@Injectable()
export class DatatransferFacadeFactory {

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore, private dateUtil: DateUtil,
        private guidUtil: GuidUtil, private paginationService: PaginationService, private exportService: ExportService) {

    }

    // TODO: pass arguments to define which uploader/downloader implementation should be used
    public createDatatransferFacade(): DatatransferFacade {
        return new DatatransferFacade(this.logger, this.zone, this.store, this.dateUtil,
            this.paginationService, new ResumableJsUploader(this.logger, this.guidUtil), this.exportService);
    }
}
