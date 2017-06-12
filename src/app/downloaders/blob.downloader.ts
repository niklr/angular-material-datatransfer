import { Injectable } from '@angular/core';

import { BaseDownloader } from './base.downloader';
import { LoggerService } from '../services';
import { IDatatransferItem, ISizeInformation } from '../models';
import { TransferStatus } from '../enums';
import { GuidUtil } from '../utils';

@Injectable()
export abstract class BlobDownloader extends BaseDownloader {

    constructor(protected logger: LoggerService, protected guidUtil: GuidUtil) {
        super(logger, guidUtil);
        this.init();
    }

    private getAllElementsWithAttribute(attribute) {
        let matchingElements = [];
        let allElements = document.getElementsByTagName('*');
        for (let i = 0, n = allElements.length; i < n; i++) {
            if (allElements[i].getAttribute(attribute) !== null) {
                // Element exists with attribute. Add to array.
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    }

    private init(): void {
        document.getElementById('anchor').addEventListener('click', function () {
            console.log('anchor');
        });
    }

    public isDownloading(): boolean {
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
