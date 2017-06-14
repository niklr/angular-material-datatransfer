import { Injectable } from '@angular/core';

import { IDatatransfer, BaseDatatransfer } from '..';
import { LoggerService } from '../../services';
import { GuidUtil } from '../../utils';

export interface IDownloader extends IDatatransfer {
    download(filename: string, url: string, sizeInBytes: number): void;
}

@Injectable()
export abstract class BaseDownloader extends BaseDatatransfer implements IDownloader {

    constructor(protected logger: LoggerService, protected guidUtil: GuidUtil) {
        super(logger, guidUtil);
    }

    public abstract download(filename: string, url: string, sizeInBytes: number): void;
}
