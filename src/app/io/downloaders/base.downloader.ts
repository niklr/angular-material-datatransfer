import { Injectable } from '@angular/core';

import { IDatatransfer, BaseDatatransfer } from '..';
import { IAppConfig } from '../../models';
import { LoggerService } from '../../services';
import { GuidUtil } from '../../utils';

export interface IDownloader extends IDatatransfer {
    download(filename: string, url: string, sizeInBytes: number): void;
}

@Injectable()
export abstract class BaseDownloader extends BaseDatatransfer implements IDownloader {

    constructor(protected logger: LoggerService, protected config: IAppConfig, protected guidUtil: GuidUtil) {
        super(logger, config, guidUtil);
    }

    public abstract download(filename: string, url: string, sizeInBytes: number): void;
}
