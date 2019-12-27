import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IProgressContainer } from '../models/progress-container.model';
import { ConfigService } from '../services/config.service';
import { LoggerService } from '../services/logger.service';
import { DatatransferStore } from '../stores/datatransfer.store';
import { DateUtil } from '../utils/date.util';
import { PaginationService } from '../services/pagination.service';
import { ExportService } from '../services/export.service';
import { IUploader } from '../io/uploaders/base.uploader';
import { IDownloader } from '../io/downloaders/base.downloader';
import { IDatatransfer } from '../io/datatransfer.io';
import { IDatatransferItem } from '../models/datatransfer-item.model';
import { TransferStatus } from '../enums/transfer-status.enum';
import { TransferType } from '../enums/transfer-type.enum';
import { BrowseDialogComponent } from '../components/browse-dialog.component';
import { EditDialogComponent } from '../components/edit-dialog.component';
import { CustomEventType, CustomEventTypeExtensions } from '../enums/custom-event-type.enum';

export class DatatransferFacade {

    private uploadProgress: IProgressContainer;
    private downloadProgress: IProgressContainer;

    // Interval in milliseconds to calculate progress:
    private progressInterval = 200;
    // Interval in milliseconds to calculate bitrate:
    private bitrateInterval = 1000;

    constructor(private logger: LoggerService, private zone: NgZone, private store: DatatransferStore,
                private dateUtil: DateUtil, private paginationService: PaginationService, private exportService: ExportService,
                private uploader: IUploader, private downloader: IDownloader, private dialog: MatDialog) {
        this.uploadProgress = this.store.uploadProgress;
        this.downloadProgress = this.store.downloadProgress;
        this.init(this.uploader, this.uploadProgress);
        this.init(this.downloader, this.downloadProgress);
    }

    private init(datatransfer: IDatatransfer, progressContainer: IProgressContainer): void {
        datatransfer.on('itemAdded', function(item: IDatatransferItem) {
            const that = this as DatatransferFacade;
            that.zone.run(() => {
                that.addItem(item);
            });
        }.bind(this));
        datatransfer.on('zoneUpdated', function(item: IDatatransferItem, status: TransferStatus, message?: string) {
            const that = this as DatatransferFacade;
            that.zone.run(() => {
                // console.log(that.uploader.isWorking());
            });
        }.bind(this));
        datatransfer.on('itemStatusChanged', function(item: IDatatransferItem, status: TransferStatus, message?: string) {
            const that = this as DatatransferFacade;
            that.zone.run(() => {
                that.changeItemStatus(item, status, message);
            });
        }.bind(this));
        datatransfer.on('itemProgressUpdated', function(item: IDatatransferItem, progress: number) {
            const that = this as DatatransferFacade;
            that.zone.run(() => {
                that.updateItemProgress(item, progress);
            });
        }.bind(this));
        datatransfer.on('overallProgressUpdated', function(transferType: TransferType, progress: number) {
            const that = this as DatatransferFacade;
            that.zone.run(() => {
                that.updateOverallProgress(progressContainer, transferType, progress);
            });
        }.bind(this));
        datatransfer.on('overallSizeUpdated', function(size: number) {
            const that = this as DatatransferFacade;
            that.zone.run(() => {
                that.updateOverallSize(progressContainer, size);
            });
        }.bind(this));
    }

    public assignUploadBrowse(element, isDirectory = false): void {
        this.uploader.assignBrowse(element, isDirectory);
    }

    public assignUploadDrop(element): void {
        this.uploader.assignDrop(element);
    }

    public openBrowseDialog(): void {
        const dialogRef = this.dialog.open(BrowseDialogComponent, {
            data: {
                datatransferFacade: this
            }
        });
    }

    public openEditPathDialog(item: IDatatransferItem): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            data: {
                datatransferFacade: this,
                mode: 'edit-path',
                item
            }
        });
    }

    public openEditFilenameDialog(item: IDatatransferItem): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            data: {
                datatransferFacade: this,
                mode: 'edit-filename',
                item
            }
        });
    }

    public toggleVisible(checked: boolean): void {
        this.paginationService.paginatedItems.forEach((item, index) => {
            item.isSelected = checked;
        });
    }

    public startAll(): void {
        this.store.getItems().forEach((item, index) => {
            const that = this as DatatransferFacade;
            if (item.transferType === TransferType.Upload && item.status === TransferStatus.Ready) {
                that.changeItemStatus(item, TransferStatus.Queued);
            }
        });
        this.uploader.startAll();
    }

    public pauseAll(): void {
        this.store.getItems().forEach((item, index) => {
            item.preprocessContainer.pause(true);
        });
        this.uploader.pauseAll();
        this.downloader.pauseAll();
    }

    public removeAll(): void {
        this.store.getItems().forEach((item, index) => {
            item.preprocessContainer.cancel(true);
        });
        this.uploader.removeAll();
        this.downloader.removeAll();
        this.store.clear();
        this.uploadProgress.reset(0);
        this.paginationService.update(0);
        document.dispatchEvent(new CustomEvent(CustomEventTypeExtensions.toString(CustomEventType.ITEMS_CLEARED)));
    }

    public retryAll(): void {
        this.store.getByStatus(TransferStatus.Failed).forEach((item, index) => {
            const that = this as DatatransferFacade;
            that.retryItem(item);
        });
    }

    public removeSelected(): void {
        const temp = this.store.getSelected().slice();
        temp.forEach((item, index) => {
            const that = this as DatatransferFacade;
            that.removeItem(item);
        });
    }

    public addItem(item: IDatatransferItem): void {
        if (!!item) {
            this.store.addItem(item);
            this.paginationService.update(this.store.count);
            document.dispatchEvent(new CustomEvent(CustomEventTypeExtensions.toString(CustomEventType.ITEM_ADDED), { detail: item }));
        }
    }

    public removeItem(item: IDatatransferItem): void {
        if (!!item) {
            item.preprocessContainer.cancel(true);
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
            document.dispatchEvent(
                new CustomEvent(CustomEventTypeExtensions.toString(CustomEventType.ITEM_REMOVED), { detail: item }));
        }
    }

    public retryItem(item: IDatatransferItem): void {
        if (!!item) {
            item.preprocessContainer.cancel(true);
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
                    item.message = message;
                }
                this.store.updateFailedCount();
                if (status === TransferStatus.Finished) {
                    document.dispatchEvent(
                        new CustomEvent(CustomEventTypeExtensions.toString(CustomEventType.ITEM_COMPLETED), { detail: item }));
                }
            }
        }
    }

    public updateItemProgress(item: IDatatransferItem, progress: number): void {
        if (!!item) {
            const now: number = this.dateUtil.now();
            const loaded: number = item.progressContainer.total * progress;
            item.progressContainer.updateBitrate(now, loaded, this.bitrateInterval);
            item.progressContainer.updateProgress(now, loaded, this.progressInterval);
        }
    }

    public updateOverallProgress(progressContainer: IProgressContainer, transferType: TransferType, progress: number): void {
        const now: number = this.dateUtil.now();
        const loaded: number = progressContainer.total * progress;
        // this.logger.log('total: ' + progressContainer.total + ' progress: ' + progress + ' loaded: ' + loaded);
        progressContainer.updateBitrate(now, loaded, this.bitrateInterval);
        progressContainer.updateProgress(now, loaded, this.progressInterval);
        if (progressContainer.total > 0 && loaded >= progressContainer.total) {
            switch (transferType) {
                case TransferType.Upload:
                    document.dispatchEvent(new CustomEvent(CustomEventTypeExtensions.toString(CustomEventType.UPLOAD_COMPLETED)));
                    break;
                case TransferType.Download:
                    document.dispatchEvent(new CustomEvent(CustomEventTypeExtensions.toString(CustomEventType.DOWNLOAD_COMPLETED)));
                    break;
                default:
                    break;
            }
        }
    }

    public updateOverallSize(progressContainer: IProgressContainer, size: number): void {
        progressContainer.reset(size);
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
            case TransferStatus.Preprocessing:
                return 'schedule';
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

    public showPreprocessingCheckbox(): boolean {
        return this.store.count > 0 && ConfigService.settings.core.preprocessHashEnabled;
    }

    public showPreprocessingTooltip(): boolean {
        return this.showPreprocessingCheckbox() && !!ConfigService.settings.core.preprocessHashTooltipContent;
    }

    public showSpinner(item: IDatatransferItem): boolean {
        return item.preprocessContainer.percent > 0 && item.status === TransferStatus.Preprocessing;
    }

    public showProgressbar(item: IDatatransferItem): boolean {
        return item.progressContainer.percent > 0 &&
            (item.status === TransferStatus.Uploading || item.status === TransferStatus.Downloading);
    }

    public showPath(items: IDatatransferItem[], index: number): boolean {
        if (index > 0 && items.length > index) {
            const currentPath = items[index].path;
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

    public parseMessage(item: IDatatransferItem): string {
        if (ConfigService.settings.core.parseMessageCallback instanceof Function) {
            return ConfigService.settings.core.parseMessageCallback(item.message);
        } else {
            return undefined;
        }
    }
}
