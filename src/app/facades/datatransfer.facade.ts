import { Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'underscore';

import { IDatatransfer, IUploader, IDownloader } from '../io';
import { LoggerService, PaginationService, ExportService } from '../services';
import { DatatransferStore } from '../stores';
import { IDatatransferItem, ISizeInformation, IProgressInformation } from '../models';
import { BrowseDialogComponent, EditDialogComponent } from '../components';
import { DateUtil } from '../utils';
import { TransferStatus, TransferType } from '../enums';

export class DatatransferFacade {

    private uploadProgress: IProgressInformation;
    private downloadProgress: IProgressInformation;

    // Interval in milliseconds to calculate progress:
    private progressInterval = 100;
    // Interval in milliseconds to calculate bitrate:
    private bitrateInterval = 500;

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore, private dateUtil: DateUtil,
        private paginationService: PaginationService, private exportService: ExportService,
        private uploader: IUploader, private downloader: IDownloader, private dialog: MatDialog) {
        this.uploadProgress = this.store.uploadProgress;
        this.downloadProgress = this.store.downloadProgress;
        this.init(this.uploader, this.uploadProgress);
        this.init(this.downloader, this.downloadProgress);
    }

    private init(datatransfer: IDatatransfer, progressInformation: IProgressInformation): void {
        datatransfer.on('itemAdded', function (item: IDatatransferItem) {
            let that = this as DatatransferFacade;
            that.zone.run(() => {
                that.addItem(item);
            });
        }.bind(this));
        datatransfer.on('itemStatusChanged', function (item: IDatatransferItem, status: TransferStatus, message?: string) {
            let that = this as DatatransferFacade;
            that.zone.run(() => {
                that.changeItemStatus(item, status, message);
            });
        }.bind(this));
        datatransfer.on('itemProgressUpdated', function (item: IDatatransferItem, progress: number) {
            let that = this as DatatransferFacade;
            that.zone.run(() => {
                that.updateItemProgress(item, progress);
            });
        }.bind(this));
        datatransfer.on('overallProgressUpdated', function (transferType: TransferType, progress: number) {
            let that = this as DatatransferFacade;
            that.zone.run(() => {
                that.updateOverallProgress(progressInformation, transferType, progress);
            });
        }.bind(this));
        datatransfer.on('overallSizeUpdated', function (size: number) {
            let that = this as DatatransferFacade;
            that.zone.run(() => {
                that.updateOverallSize(progressInformation, size);
            });
        }.bind(this));
        // this.assignUploadBrowse(document.getElementById('amd-browse-folder'), true);
    }

    public assignUploadBrowse(element, isDirectory = false): void {
        this.uploader.assignBrowse(element, isDirectory);
    }

    public assignUploadDrop(element): void {
        this.uploader.assignDrop(element);
    }

    public openBrowseDialog(): void {
        let dialogRef = this.dialog.open(BrowseDialogComponent, {
            data: {
                datatransferFacade: this
            }
        });
    }

    public openEditPathDialog(item: IDatatransferItem): void {
        let dialogRef = this.dialog.open(EditDialogComponent, {
            data: {
                datatransferFacade: this,
                mode: 'edit-path',
                item: item
            }
        });
    }

    public openEditFilenameDialog(item: IDatatransferItem): void {
        let dialogRef = this.dialog.open(EditDialogComponent, {
            data: {
                datatransferFacade: this,
                mode: 'edit-filename',
                item: item
            }
        });
    }

    public toggleVisible(checked: boolean): void {
        _.each(this.paginationService.paginatedItems, function (item) {
            item.isSelected = checked;
        });
    }

    public startAll(): void {
        _.each(this.store.getItems(), function (item: IDatatransferItem) {
            let that = this as DatatransferFacade;
            if (item.transferType === TransferType.Upload && item.status === TransferStatus.Ready) {
                that.changeItemStatus(item, TransferStatus.Queued);
            }
        }.bind(this));
        this.uploader.startAll();
    }

    public pauseAll(): void {
        this.uploader.pauseAll();
        this.downloader.pauseAll();
    }

    public removeAll(): void {
        this.uploader.removeAll();
        this.downloader.removeAll();
        this.store.clear();
        this.uploadProgress.reset(0);
        this.paginationService.update(0);
    }

    public retryAll(): void {
        _.each(this.store.getByStatus(TransferStatus.Failed), function (item) {
            let that = this as DatatransferFacade;
            that.retryItem(item);
        }.bind(this));
    }

    public removeSelected(): void {
        let temp = this.store.getSelected().slice();
        _.each(temp, function (item) {
            let that = this as DatatransferFacade;
            that.removeItem(item);
        }.bind(this));
    }

    public addItem(item): void {
        this.store.addItem(item);
        this.paginationService.update(this.store.count);
    }

    public removeItem(item: IDatatransferItem): void {
        if (!!item) {
            switch (item.transferType) {
                case TransferType.Upload:
                    this.uploader.removeItem(item);
                    break;
                case TransferType.Download:
                    this.downloader.removeItem(item);
                    break;
                default:
                    break;
            }
            this.store.removeById(item.id);
            this.paginationService.update(this.store.count);
        }
    }

    public retryItem(item: IDatatransferItem): void {
        if (!!item) {
            switch (item.transferType) {
                case TransferType.Upload:
                    this.uploader.retryItem(item);
                    break;
                case TransferType.Download:
                    this.downloader.retryItem(item);
                    break;
                default:
                    break;
            }
        }
    }

    public changeItemStatus(item: IDatatransferItem, status: TransferStatus, message?: string): void {
        if (!!item && !!status) {
            if (item.status !== status) {
                this.paginationService.setPageByItemId(item.id);
                item.status = status;
                if (!!message) {
                    item.message = message.toLowerCase().startsWith('<!doctype html') ? undefined : message;
                }
                this.store.updateFailedCount();
            }
        }
    }

    public updateItemProgress(item: IDatatransferItem, progress: number): void {
        if (!!item) {
            let now: number = this.dateUtil.now();
            let loaded: number = item.progressInformation.total * progress;
            item.progressInformation.updateBitrate(now, loaded, this.bitrateInterval);
            item.progressInformation.updateProgress(now, loaded, this.progressInterval);
        }
    }

    public updateOverallProgress(progressInformation: IProgressInformation, transferType: TransferType, progress: number): void {
        let now: number = this.dateUtil.now();
        let loaded: number = progressInformation.total * progress;
        // this.logger.log('total: ' + progressInformation.total + ' progress: ' + progress + ' loaded: ' + loaded);
        progressInformation.updateBitrate(now, loaded, this.bitrateInterval);
        progressInformation.updateProgress(now, loaded, this.progressInterval);
        if (progressInformation.total > 0 && loaded >= progressInformation.total) {
            switch (transferType) {
                case TransferType.Upload:
                    document.dispatchEvent(new CustomEvent('github:niklr/angular-material-datatransfer.upload-completed'));
                    break;
                case TransferType.Download:
                    document.dispatchEvent(new CustomEvent('github:niklr/angular-material-datatransfer.download-completed'));
                    break;
                default:
                    break;
            }
        }
    }

    public updateOverallSize(progressInformation: IProgressInformation, size: number): void {
        progressInformation.reset(size);
    }

    public download(filename: string, url: string, sizeInBytes: number): void {
        this.downloader.download(filename, url, sizeInBytes);
    }

    public export(exportType: string): void {
        this.exportService.export(exportType);
    }

    public getStatusClass(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.Ready:
                return 'add_circle_outline';
            case TransferStatus.Uploading:
                return 'arrow_upward';
            case TransferStatus.Downloading:
                return 'arrow_downward';
            case TransferStatus.Failed:
                return 'error_outline';
            case TransferStatus.Queued:
                return 'query_builder';
            case TransferStatus.Finished:
                return 'done_all';
            default:
                return '';
        }
    }

    public showStartButton(): boolean {
        return this.store.count > 0 && !this.uploader.isWorking() && !this.downloader.isWorking();
    }

    public showPauseButton(): boolean {
        return this.uploader.isWorking();
    }

    public showRemoveButton(): boolean {
        return this.store.count > 0;
    }

    public showRetryButton(): boolean {
        return this.store.failedCount > 0 && !this.uploader.isWorking() && !this.downloader.isWorking();
    }

    public showRetryButtonByItem(item: IDatatransferItem): boolean {
        return item.status === TransferStatus.Failed;
    }

    public showExportButton(): boolean {
        return this.store.count > 0;
    }

    public showSpinner(item: IDatatransferItem): boolean {
        return item.status === TransferStatus.Preprocessing;
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

    public showEditDialog(item: IDatatransferItem): boolean {
        let result = false;
        if (item) {
            switch (item.transferType) {
                case TransferType.Upload:
                    if (item.status === TransferStatus.Ready) {
                        result = true;
                    }
                    break;
                default:
                    break;
            }
        }
        return result;
    }

    public editPath(item: IDatatransferItem, oldPath: string, newPath: string): void {
        switch (item.transferType) {
            case TransferType.Upload:
                // replace all \ with /
                let cleanedPath = newPath.replace(/\\/g, '/');
                // replace repeated / with one
                cleanedPath = cleanedPath.replace(/\/+/g, '/');
                if (cleanedPath.startsWith('/')) {
                    cleanedPath = cleanedPath.slice(1);
                }
                if (cleanedPath && !cleanedPath.endsWith('/')) {
                    cleanedPath += '/';
                }
                this.uploader.editPath(oldPath, cleanedPath);
                break;
            default:
                break;
        }
    }

    public editFilename(item: IDatatransferItem, name: string): void {
        switch (item.transferType) {
            case TransferType.Upload:
                this.uploader.editFilename(item, name);
                break;
            default:
                break;
        }
    }
}
