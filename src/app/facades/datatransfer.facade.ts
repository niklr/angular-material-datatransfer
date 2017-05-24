import { Component, NgZone } from '@angular/core';
import { IUploader } from '../uploaders';
import { LoggerService } from '../services';
import { DatatransferStore } from '../stores';
import { IDatatransferItem, ISizeInformation } from '../models';
import { TransferStatus } from '../enums';

export class DatatransferFacade {

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore, private uploader: IUploader) {
        this.init();
    }

    public init(): void {
        this.uploader.on('itemAdded', function (item: IDatatransferItem) {
            this.zone.run(() => {
                this.store.addItem(item);
            });
        }.bind(this));
        this.uploader.on('itemStatusChanged', function (id: string, status: TransferStatus, message?: string) {
            this.zone.run(() => {
                this.changeItemStatus(id, status, message);
            });
        }.bind(this));
        this.uploader.on('itemProgressUpdated', function (id: string, progress: number) {
            this.zone.run(() => {
                this.updateItemProgress(id, progress);
            });
        }.bind(this));
        this.uploader.on('overallProgressUpdated', function (progress: number) {
            this.zone.run(() => {

            });
        }.bind(this));
        this.uploader.on('overallSizeUpdated', function (size: ISizeInformation) {
            this.zone.run(() => {

            });
        }.bind(this));
        this.uploader.on('removeAll', function () {
            this.logger.log('removeAll');
            this.store.clear();
        }.bind(this));
    }

    public assignUploadBrowse(element): void {
        this.uploader.assignBrowse(element);
    }

    public assignUploadDrop(element): void {
        this.uploader.assignDrop(element);
    }

    public startAll(): void {
        this.uploader.startAll();
    }

    public removeAll(): void {
        this.uploader.removeAll();
        this.store.clear();
    }

    public retryById(id: string): void {
        let item: IDatatransferItem = this.store.getById(id);
        if (!!item) {
            this.logger.log(item);
            this.uploader.retryItem(item);
        }
    }

    public changeItemStatus(id: string, status: TransferStatus, message?: string): IDatatransferItem {
        let item: IDatatransferItem = this.store.getById(id);
        if (!!item) {
            item.status = status;
        }
        return item;
    }

    public updateItemProgress(id: string, progress: number): IDatatransferItem {
        let item: IDatatransferItem = this.changeItemStatus(id, TransferStatus.Uploading);
        if (!!item) {
            item.progress = Number(progress.toFixed(2));
        }
        return item;
    }

    public showProgressbar(item: IDatatransferItem): boolean {
        return item.progress > 0 && (item.status === TransferStatus.Uploading || item.status === TransferStatus.Downloading);
    }

    public showPath(items: IDatatransferItem[], index: number): boolean {
        if (index > 0 && items.length > index) {
            let currentPath = items[index].path;
            // don't show if previous path is same as current
            return items[index - 1].path !== currentPath;
        }
        return true;
    }
}
