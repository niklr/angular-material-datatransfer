import { Injectable } from '@angular/core';

import { LoggerService } from '../services';
import { IDatatransferItem } from '../models';
import { TransferStatus } from '../enums';
import { DecimalByteUnitUtil } from '../utils';

export interface IUploader {
    on(event: string, callback: Function): void;
    assignBrowse(element): void;
    assignDrop(element): void;
    startAll(): void;
    removeAll(): void;
    addItem(item: IDatatransferItem): void;
    retryItem(item: IDatatransferItem): void;
}

@Injectable()
export class BaseUploader implements IUploader {

    private events = [];

    constructor(protected logger: LoggerService, protected decimalByteUnitUtil: DecimalByteUnitUtil) {

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
}
