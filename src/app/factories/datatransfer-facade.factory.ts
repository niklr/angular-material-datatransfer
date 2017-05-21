import { Injectable } from '@angular/core';
import { LoggerService } from '../services';
import { DatatransferFacade } from '../facades';
import { ResumableJsUploader } from '../uploaders';

@Injectable()
export class DatatransferFacadeFactory {

    constructor(private logger: LoggerService) {

    }

    // TODO: pass arguments to define which uploader/downloader implementation should be used
    public createDatatransferFacade(): DatatransferFacade {
        return new DatatransferFacade(this.logger, new ResumableJsUploader());
    }
}
