import { Injectable } from '@angular/core';

import { LoggerService } from '../services';
import { IAppConfig, IDatatransferItem } from '../models';
import { TransferStatus } from '../enums';
import { GuidUtil } from '../utils';

export interface IDatatransfer {
    on(event: string, callback: Function): void;
    isWorking(): boolean;
    startAll(): void;
    pauseAll(): void;
    removeAll(): void;
    addItem(item: IDatatransferItem): void;
    removeItem(item: IDatatransferItem): void;
    retryItem(item: IDatatransferItem): void;
}

@Injectable()
export abstract class BaseDatatransfer implements IDatatransfer {

    private events = [];

    constructor(protected logger: LoggerService, protected config: IAppConfig, protected guidUtil: GuidUtil) {

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

    protected changeItemStatus(item: IDatatransferItem, status: TransferStatus, message?: string) {
        this.fire('itemStatusChanged', item, status, message);
    }

    protected updateItemProgress(item: IDatatransferItem, progress: number): void {
        this.fire('itemProgressUpdated', item, progress);
    }

    protected updateOverallProgress(progress: number): void {
        this.fire('overallProgressUpdated', progress);
    }

    protected updateOverallSize(size: number): void {
        this.fire('overallSizeUpdated', size);
    }

    public abstract isWorking(): boolean;

    public abstract startAll(): void;

    public abstract pauseAll(): void;

    public abstract removeAll(): void;

    public addItem(item: IDatatransferItem): void {
        this.fire('itemAdded', item);
    }

    public abstract removeItem(item: IDatatransferItem): void;

    public abstract retryItem(item: IDatatransferItem): void;
}
