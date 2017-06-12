import { Component, NgZone } from '@angular/core';
import * as _ from 'underscore';

import { IUploader } from '../uploaders';
import { LoggerService, PaginationService, ExportService } from '../services';
import { DatatransferStore } from '../stores';
import { IDatatransferItem, ISizeInformation, IProgressInformation } from '../models';
import { DateUtil } from '../utils';
import { TransferStatus, TransferType } from '../enums';

export class DatatransferFacade {

    private uploadProgress: IProgressInformation;

    // Interval in milliseconds to calculate progress:
    private progressInterval = 100;
    // Interval in milliseconds to calculate bitrate:
    private bitrateInterval = 500;

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore, private dateUtil: DateUtil,
        private paginationService: PaginationService, private uploader: IUploader, private exportService: ExportService) {
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
            this.store.clear();
        }.bind(this));
    }

    public assignUploadBrowse(element): void {
        this.uploader.assignBrowse(element);
    }

    public assignUploadDrop(element): void {
        this.uploader.assignDrop(element);
    }

    toggleVisible(checked: boolean): void {
        _.each(this.paginationService.paginatedItems, function (item) {
            item.isSelected = checked;
        });
    }

    public startAll(): void {
        this.uploader.startAll();
    }

    public pauseAll(): void {
        this.uploader.pauseAll();
    }

    public removeAll(): void {
        this.uploader.removeAll();
        this.store.clear();
        this.uploadProgress.reset(0);
        this.paginationService.update(0);
    }

    public retryAll(): void {
        _.each(this.store.getByStatus(TransferStatus.Failed), function (item) {
            this.retryItem(item);
        }.bind(this));
    }

    public removeSelected(): void {
        let temp = this.store.getSelected().slice();
        _.each(temp, function (item) {
            this.removeItem(item);
        }.bind(this));
    }

    public addItem(item): void {
        this.store.addItem(item);
        this.paginationService.update(this.store.count);
    }

    public removeItem(item: IDatatransferItem): void {
        if (!!item) {
            if (item.transferType === TransferType.Upload) {
                this.uploader.removeItem(item);
            }
            this.store.removeById(item.id);
            this.paginationService.update(this.store.count);
        }
    }

    public retryItem(item: IDatatransferItem): void {
        if (!!item) {
            if (item.transferType === TransferType.Upload) {
                this.uploader.retryItem(item);
            }
        }
    }

    public changeItemStatus(id: string, status: TransferStatus, message?: string): IDatatransferItem {
        let item: IDatatransferItem = this.store.getById(id);
        if (!!item) {
            item.status = status;
            if (!!message) {
                item.message = message.startsWith('<!doctype html>') ? undefined : message;
            }
            this.store.updateFailedCount();
        }
        return item;
    }

    public updateItemProgress(id: string, progress: number): IDatatransferItem {
        let item: IDatatransferItem = this.changeItemStatus(id, TransferStatus.Uploading);
        if (!!item) {
            this.paginationService.setPageByItemId(id);
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

    public export(exportType: string): void {
        this.exportService.export(exportType);
    }

    public getStatusClass(status: TransferStatus): string {
        switch (status) {
        case TransferStatus.Uploading:
            return 'fa fa-arrow-circle-o-up';
        case TransferStatus.Downloading:
            return 'fa fa-arrow-circle-o-down';
        case TransferStatus.Failed:
            return 'fa fa-exclamation-circle';
        case TransferStatus.Queued:
            return 'fa fa-circle-o';
        default:
            return '';
        }
    }

    public showStartButton(): boolean {
        return this.store.count > 0 && !this.uploader.isUploading();
    }

    public showPauseButton(): boolean {
        return this.uploader.isUploading();
    }

    public showRemoveButton(): boolean {
        return this.store.count > 0;
    }

    public showRetryButton(): boolean {
        return this.store.failedCount > 0 && !this.uploader.isUploading();
    }

    public showExportButton(): boolean {
        return this.store.count > 0 && !this.uploader.isUploading();
    }

    public showRetryButtonByItem(item: IDatatransferItem): boolean {
        return item.status === TransferStatus.Failed;
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
