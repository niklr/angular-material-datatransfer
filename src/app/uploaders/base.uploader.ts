import { Injectable } from '@angular/core';

import { LoggerService } from '../services';
import { IDatatransferItem, ISizeInformation } from '../models';
import { TransferStatus } from '../enums';

export interface IUploader {
    on(event: string, callback: Function): void;
    assignBrowse(element): void;
    assignDrop(element): void;
    startAll(): void;
    removeAll(): void;
    addItem(item: IDatatransferItem): void;
    retryItem(item: IDatatransferItem): void;
    removeItem(item: IDatatransferItem): void;
}

@Injectable()
export class BaseUploader implements IUploader {

    private events = [];

    constructor(protected logger: LoggerService) {

    }

    public on(event: string, callback: Function): void {
        this.events.push(event.toLowerCase(), callback);
    }

    protected fire(...args: any[]): void {
        let event = args[0].toLowerCase();
        // Find event listeners, and support pseudo-event `catchAll`
        for (let i = 0; i <= this.events.length; i += 2) {
            if (this.events[i] === event) {
                this.events[i + 1].apply(this, args.slice(1));
            }
            if (this.events[i] === 'catchall') {
                this.events[i + 1].apply(null, args);
            }
        }
    };

    protected changeItemStatus(id: string, status: TransferStatus, message?: string) {
        this.fire('itemStatusChanged', id, status, message);
    }

    protected updateItemProgress(id: string, progress: number): void {
        this.fire('itemProgressUpdated', id, progress);
    }

    protected updateOverallProgress(progress: number): void {
        this.fire('overallUploadProgressUpdated', progress);
    }

    protected updateOverallSize(size: number): void {
        this.fire('overallUploadSizeUpdated', size);
    }

    public assignBrowse(element): void {

    }

    public assignDrop(element): void {

    }

    public startAll(): void {

    }

    public removeAll(): void {
        this.fire('removeAll');
    }

    public addItem(item: IDatatransferItem): void {
        this.fire('itemAdded', item);
    }

    public retryItem(item: IDatatransferItem): void {

    }

    public removeItem(item: IDatatransferItem): void {

    }
}
