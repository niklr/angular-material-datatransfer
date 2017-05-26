import { Component, NgZone } from '@angular/core';
import { IUploader } from '../uploaders';
import { LoggerService, PaginationService } from '../services';
import { DatatransferStore } from '../stores';
import { IDatatransferItem, ISizeInformation, IProgressInformation } from '../models';
import { DateUtil } from '../utils';
import { TransferStatus } from '../enums';

export class DatatransferFacade {

    private uploadProgress: IProgressInformation;

    // Interval in milliseconds to calculate and trigger progress events:
    private progressInterval = 100;
    // Interval in milliseconds to calculate progress bitrate:
    private bitrateInterval = 500;

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore,
        private dateUtil: DateUtil, private paginationService: PaginationService, private uploader: IUploader) {
        this.init();
    }

    public init(): void {
        this.uploadProgress = this.store.uploadProgress;
        this.uploader.on('itemAdded', function (item: IDatatransferItem) {
            this.zone.run(() => {
                this.addItem(item);
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
        this.uploader.on('overallUploadProgressUpdated', function (progress: number) {
            this.zone.run(() => {
                this.updateOverallUploadProgress(progress);
            });
        }.bind(this));
        this.uploader.on('overallUploadSizeUpdated', function (size: number) {
            this.zone.run(() => {
                this.updateOverallUploadSize(size);
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

    public addItem(item): void {
        this.store.addItem(item);
        this.paginationService.updateTotal(this.store.count);
    }

    public startAll(): void {
        this.uploader.startAll();
    }

    public removeAll(): void {
        this.uploader.removeAll();
        this.store.clear();
        this.uploadProgress.reset(0);
        this.paginationService.updateTotal(0);
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
            let now: number = this.dateUtil.now();
            let loaded: number = item.progressInformation.total * progress;
            item.progressInformation.updateProgress(now, loaded, this.progressInterval);
            item.progressInformation.updateBitrate(now, loaded, this.bitrateInterval);
        }
        return item;
    }

    public updateOverallUploadProgress(progress: number): void {
        let now: number = this.dateUtil.now();
        let loaded: number = this.uploadProgress.total * progress;
        this.uploadProgress.updateProgress(now, loaded, this.progressInterval);
        this.uploadProgress.updateBitrate(now, loaded, this.bitrateInterval);
    }

    public updateOverallUploadSize(size: number): void {
        this.uploadProgress.reset(size);
    }

    public showProgressbar(item: IDatatransferItem): boolean {
        return item.progressInformation.percent > 0 &&
            (item.status === TransferStatus.Uploading || item.status === TransferStatus.Downloading);
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
