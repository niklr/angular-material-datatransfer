import { Injectable } from '@angular/core';
import { IDatatransferItem, IProgressInformation, ProgressInformation } from '../models';
import { TransferStatus } from '../enums';

import * as _ from 'underscore';

@Injectable()
export class DatatransferStore {

    private items: IDatatransferItem[] = [];

    public count = 0;
    public failedCount = 0;
    public uploadProgress: IProgressInformation = new ProgressInformation(0);

    constructor() {

    }

    private updateCount(): void {
        this.count = this.items.length;
    }

    public updateFailedCount(): void {
        this.failedCount = this.getByStatus(TransferStatus.Failed).length;
    }

    public getItems(): IDatatransferItem[] {
        return this.items;
    }

    public getSelected(): IDatatransferItem[] {
        return _.where(this.items, { isSelected: true });
    }

    public getById(id: string): IDatatransferItem {
        return _.find(this.items, function (item) { return item.id === id; });
    }

    public getIndexById(id: string): number {
        return this.items.findIndex(i => i.id === id);
    }

    public clear(): void {
        this.items.length = 0;
        this.updateCount();
    }

    public addItem(item: IDatatransferItem): void {
        this.items.push(item);
        this.updateCount();
    }

    public removeById(id: string): void {
        let index: number = this.getIndexById(id);
        if (index > -1) {
            this.items.splice(index, 1);
            this.updateCount();
        }
    }

    public getByStatus(status: TransferStatus) {
        return _.where(this.items, { status: status });
    }
}
