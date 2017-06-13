import { Injectable } from '@angular/core';

import { IDatatransfer } from '..';
import { LoggerService } from '../../services';
import { IDatatransferItem, ISizeInformation } from '../../models';
import { TransferStatus } from '../../enums';
import { GuidUtil } from '../../utils';

export interface IUploader extends IDatatransfer {
    assignBrowse(element): void;
    assignDrop(element): void;
}

@Injectable()
export abstract class BaseUploader implements IUploader {

    private events = [];

    constructor(protected logger: LoggerService, protected guidUtil: GuidUtil) {

    }

    protected generateUniqueIdentifier(): string {
        return this.guidUtil.createGuid();
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
        this.fire('overallProgressUpdated', progress);
    }

    protected updateOverallSize(size: number): void {
        this.fire('overallSizeUpdated', size);
    }

    public abstract assignBrowse(element): void;

    public abstract assignDrop(element): void;

    public abstract isWorking(): boolean;

    public startAll(): void {

    }

    public pauseAll(): void {

    }

    public removeAll(): void {

    }

    public addItem(item: IDatatransferItem): void {
        this.fire('itemAdded', item);
    }

    public abstract removeItem(item: IDatatransferItem): void;

    public abstract retryItem(item: IDatatransferItem): void;
}
