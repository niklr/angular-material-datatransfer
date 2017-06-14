import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { saveAs } from 'file-saver';

import { BaseDownloader } from './base.downloader';
import { LoggerService } from '../../services';
import { IDatatransferItem, DatatransferItem, SizeInformation, ProgressInformation } from '../../models';
import { TransferType, TransferStatus, DecimalByteUnit } from '../../enums';
import { GuidUtil } from '../../utils';

@Injectable()
export class BlobDownloader extends BaseDownloader {

    private simultaneousDownloads = 2;
    private throttleProgressCallbacks = 0.1;
    private files: IDatatransferItem[] = [];
    private queue: IDatatransferItem[] = [];
    private downloading: IDatatransferItem[] = [];

    constructor(protected logger: LoggerService, protected guidUtil: GuidUtil) {
        super(logger, guidUtil);
    }

    public isWorking(): boolean {
        return !!_.find(this.files, function (item) { return item.status === TransferStatus.Downloading; });
    }

    public startAll(): void {
        if (!this.isWorking()) {
            this.downloadNext();
        }
    }

    public pauseAll(): void {

    }

    public removeAll(): void {
        _.each(this.files, function (item) {
            this.abortDownload(item);
        }.bind(this));
        this.files.length = 0;
        this.queue.length = 0;
        this.downloading.length = 0;
        this.updateOverallSize(this.getSize());
        this.updateOverallProgress(this.getProgress());
    }

    public removeItem(item: IDatatransferItem): void {
        this.abortDownload(item);
        this.removeItemFromArray(item, this.files);
        this.removeItemFromArray(item, this.queue);
        this.removeItemFromArray(item, this.downloading);
        this.downloadNext();
    }

    private removeItemFromArray(item: IDatatransferItem, array: IDatatransferItem[]): void {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] === item) {
                array.splice(i, 1);
                break;
            }
        }
    }

    public retryItem(item: IDatatransferItem): void {

    }

    public download(filename: string, url: string, sizeInBytes: number): void {
        let newItem = new DatatransferItem({
            id: this.generateUniqueIdentifier(),
            name: filename,
            sizeInformation: new SizeInformation({ decimalByteUnit: DecimalByteUnit.Byte, decimalByteUnitSize: sizeInBytes }),
            progressInformation: new ProgressInformation(sizeInBytes),
            transferType: TransferType.Download,
            status: TransferStatus.Queued,
            externalItem: {
                url: url,
                progress: 0,
                size: sizeInBytes,
                lastProgressCallback: new Date()
            }
        });

        this.addItem(newItem);
        this.files.push(newItem);
        this.queue.push(newItem);
        this.initDownload(newItem);
        this.startAll();
    }

    private initDownload(item: IDatatransferItem): void {
        let xhr = new XMLHttpRequest();
        item.externalItem.xhr = xhr;

        xhr.open('GET', item.externalItem.url);
        xhr.responseType = 'blob';
        xhr.onloadstart = function (e) {
            this.changeItemStatus(item.id, TransferStatus.Downloading);
        }.bind(this);
        xhr.onprogress = function (e) {
            if (new Date().getTime() - item.externalItem.lastProgressCallback.getTime() > this.throttleProgressCallbacks * 1000) {
                item.externalItem.progress = e.loaded / e.total;
                this.updateItemProgress(item.id, item.externalItem.progress);
                this.updateOverallProgress(this.getProgress());
                item.externalItem.lastProgressCallback = new Date();
            }
        }.bind(this);
        xhr.onloadend = function (e) {
            /*
            Value	State	Description
            0	UNSENT	Client has been created. open() not called yet.
            1	OPENED	open() has been called.
            2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
            3	LOADING	Downloading; responseText holds partial data.
            4	DONE	The operation is complete.
            */
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.changeItemStatus(item.id, TransferStatus.Finished);
                    saveAs(xhr.response, item.name);
                } else if (xhr.status !== 0) { // don't change status for aborted items
                    this.changeItemStatus(item.id, TransferStatus.Failed);
                }
                this.removeItemFromArray(item, this.downloading);
                this.downloadNext();
            }
        }.bind(this);
    }

    private downloadNext(): void {
        this.updateOverallSize(this.getSize());
        this.updateOverallProgress(this.getProgress());
        if (this.downloading.length < this.simultaneousDownloads) {
            let item = this.queue.shift();
            if (!!item && !!item.externalItem && !!item.externalItem.xhr) {
                this.downloading.push(item);
                item.externalItem.xhr.send();
            }
        }
    }

    private abortDownload(item: IDatatransferItem): void {
        if (!!item && !!item.externalItem && !!item.externalItem.xhr) {
            item.externalItem.xhr.abort();
            item.externalItem.xhr = null;
        }
    }

    private getSize(): number {
        let totalSize = 0;
        _.each(this.files, function (file) {
            totalSize += file.externalItem.size;
        });
        return totalSize;
    }

    private getProgress(): number {
        let totalDone = 0;
        let totalSize = 0;
        _.each(this.files, function (file) {
            let currentFileProgress = file.externalItem.progress;
            if (file.status === TransferStatus.Failed) {
                currentFileProgress = 1;
            }
            totalDone += currentFileProgress * file.externalItem.size;
            totalSize += file.externalItem.size;
        });
        return totalSize > 0 ? totalDone / totalSize : 0;
    }
}
