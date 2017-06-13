import { Injectable } from '@angular/core';

import { BaseDownloader } from './base.downloader';
import { LoggerService } from '../../services';
import { IDatatransferItem, ISizeInformation } from '../../models';
import { TransferStatus } from '../../enums';
import { GuidUtil } from '../../utils';

@Injectable()
export class BlobDownloader extends BaseDownloader {

    constructor(protected logger: LoggerService, protected guidUtil: GuidUtil) {
        super(logger, guidUtil);
        this.init();
    }

    private init(): void {

    }

    public isWorking(): boolean {
        return false;
    }

    public startAll(): void {

        super.startAll();
    }

    public pauseAll(): void {

        super.pauseAll();
    }

    public removeAll(): void {

        super.removeAll();
    }

    public removeItem(item: IDatatransferItem): void {

    }

    public retryItem(item: IDatatransferItem): void {

    }
}
