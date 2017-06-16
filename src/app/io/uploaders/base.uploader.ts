import { Injectable } from '@angular/core';

import { IDatatransfer, BaseDatatransfer } from '..';
import { IAppConfig } from '../../models';
import { LoggerService } from '../../services';
import { GuidUtil } from '../../utils';

export interface IUploader extends IDatatransfer {
    assignBrowse(element): void;
    assignDrop(element): void;
}

@Injectable()
export abstract class BaseUploader extends BaseDatatransfer {

    constructor(protected logger: LoggerService, protected config: IAppConfig, protected guidUtil: GuidUtil) {
        super(logger, config, guidUtil);
    }

    public abstract assignBrowse(element): void;

    public abstract assignDrop(element): void;
}
