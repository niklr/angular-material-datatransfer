import { Injectable } from '@angular/core';
import { IDatatransferItem, IProgressInformation, ProgressInformation } from '../models';

import * as _ from 'underscore';

@Injectable()
export class DatatransferStore {

    private static instance: DatatransferStore = null;
    private items: IDatatransferItem[] = [];

    public count = 0;
    public uploadProgress: IProgressInformation = new ProgressInformation(0);

    constructor() {
        // ensure singleton
        return DatatransferStore.instance = DatatransferStore.instance || this;
    }

    private updateCount(): void {
        this.count = this.items.length;
    }

    public getItems(): IDatatransferItem[] {
        return this.items;
    }

    public getById(id: string): IDatatransferItem {
        return _.find(this.items, function (item) { return item.id === id; });
    }

    public clear(): void {
        this.items.length = 0;
        this.updateCount();
    }

    public addItem(item: IDatatransferItem): void {
        this.items.push(item);
        this.updateCount();
    }
}
