import { Injectable } from '@angular/core';
import { IDatatransferItem } from '../models/datatransfer-item.model';
import { IProgressContainer, ProgressContainer } from '../models/progress-container.model';
import { TransferStatus } from '../enums/transfer-status.enum';

@Injectable()
export class DatatransferStore {

    private items: IDatatransferItem[] = [];

    public count = 0;
    public failedCount = 0;
    public uploadProgress: IProgressContainer = new ProgressContainer(0);
    public downloadProgress: IProgressContainer = new ProgressContainer(0);

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
        return this.items.filter((item) => item.isSelected === true);
    }

    public getById(id: string): IDatatransferItem {
        return this.items.find((item) => item.id === id);
    }

    public getIndexById(id: string): number {
        return this.items.findIndex(i => i.id === id);
    }

    public clear(): void {
        this.items.length = 0;
        this.updateCount();
        this.updateFailedCount();
    }

    public addItem(item: IDatatransferItem): void {
        this.items.push(item);
        this.updateCount();
    }

    public removeById(id: string): void {
        const index: number = this.getIndexById(id);
        if (index > -1) {
            this.items.splice(index, 1);
            this.updateCount();
        }
    }

    public getByStatus(status: TransferStatus) {
        return this.items.filter((item) => item.status === status);
    }
}
