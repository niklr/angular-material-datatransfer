import { Injectable } from '@angular/core';

import { IDatatransfer, BaseDatatransfer } from '..';
import { LoggerService } from '../../services';
import { GuidUtil } from '../../utils';

export interface IDownloader extends IDatatransfer {

}

@Injectable()
export abstract class BaseDownloader extends BaseDatatransfer {

    constructor(protected logger: LoggerService, protected guidUtil: GuidUtil) {
        super(logger, guidUtil);
    }
}
