import { Injectable, NgZone } from '@angular/core';
import { LoggerService, PaginationService } from '../services';
import { DatatransferFacade } from '../facades';
import { DatatransferStore } from '../stores';
import { DateUtil } from '../utils';
import { ResumableJsUploader } from '../uploaders';

@Injectable()
export class DatatransferFacadeFactory {

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore,
        private dateUtil: DateUtil, private paginationService: PaginationService) {

    }

    // TODO: pass arguments to define which uploader/downloader implementation should be used
    public createDatatransferFacade(): DatatransferFacade {
        return new DatatransferFacade(this.logger, this.zone, this.store,
            this.dateUtil, this.paginationService, new ResumableJsUploader(this.logger));
    }
}
