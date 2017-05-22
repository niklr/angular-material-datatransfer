import { Component, NgZone } from '@angular/core';
import { IUploader } from '../uploaders';
import { LoggerService } from '../services';
import { DatatransferItemStore } from '../stores';
import { IDatatransferItem } from '../models';

export class DatatransferFacade {

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferItemStore, private uploader: IUploader) {
        this.init();
    }

    public init(): void {
        this.uploader.on('itemAdded', function (item: IDatatransferItem) {
            this.zone.run(() => {
                // this.logger.log('itemAdded');
                this.store.addItem(item);
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

    public startSelected(): void {

    }

    public showPath(items: IDatatransferItem[], index: number): boolean {
        if (index > 0 && items.length > index) {
            let currentPath = items[index].path;
            // switch (currentPath) {
            //   case undefined:
            //   case '':
            //   case '\\':
            //   case '/':
            //     return false;
            // }
            // don't show if previous path is same as current
            return items[index - 1].path !== currentPath;
        }
        return true;
    }
}
