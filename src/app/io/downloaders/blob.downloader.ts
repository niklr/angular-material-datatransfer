import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { saveAs } from 'file-saver';

import { BaseDownloader } from './base.downloader';
import { LoggerService, CryptoService } from '../../services';
import { IAppConfig, IDatatransferItem, DatatransferItem, SizeContainer, ProgressContainer } from '../../models';
import { TransferType, TransferStatus, DecimalByteUnit } from '../../enums';
import { CommonUtil, GuidUtil } from '../../utils';

@Injectable()
export class BlobDownloader extends BaseDownloader {

    private throttleProgressCallbacks = 0.1;
    private files: IDatatransferItem[] = [];
    private queue: IDatatransferItem[] = [];
    private downloading: IDatatransferItem[] = [];

    constructor(protected logger: LoggerService, protected config: IAppConfig,
        protected guidUtil: GuidUtil, protected cryptoService: CryptoService, private commonUtil: CommonUtil) {
        super(logger, config, guidUtil, cryptoService);
    }

    public startAll(): void {
        if (!this.isWorking()) {
            for (let index = 0; index < this.config.core.simultaneousDownloads; index++) {
                this.downloadNext();
            }
        }
    }

    public pauseAll(): void {

    }

    public removeAll(): void {
        _.each(this.files, function (item) {
            let that = this as BlobDownloader;
            that.abortDownload(item);
        }.bind(this));
        this.files.length = 0;
        this.queue.length = 0;
        this.downloading.length = 0;
        this._isWorking = false;
        this.updateOverallSize(this.getSize());
        this.updateOverallProgress(this.transferType, this.getProgress());
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
        this.abortDownload(item);
        this.removeItemFromArray(item, this.queue);
        this.removeItemFromArray(item, this.downloading);
        this._isWorking = this.downloading.length > 0;
        item.externalItem.progress = 0;
        this.updateItemProgress(item, item.externalItem.progress);
        this.changeItemStatus(item, TransferStatus.Queued);
        this.queue.push(item);
        this.initDownload(item);
        this.downloadNext();
    }

    public download(filename: string, url: string, sizeInBytes: number): void {
        let newItem = new DatatransferItem({
            id: this.generateUniqueIdentifier(),
            name: filename,
            sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.Byte, decimalByteUnitSize: sizeInBytes }),
            progressContainer: new ProgressContainer(sizeInBytes),
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
        this.downloadNext();
    }

    private initDownload(item: IDatatransferItem): void {
        let xhr = new XMLHttpRequest();
        item.externalItem.xhr = xhr;

        xhr.open(this.config.core.downloadMethod, item.externalItem.url);
        xhr.timeout = this.config.core.downloadXhrTimeout;
        xhr.withCredentials = this.config.core.downloadWithCredentials;

        // Add data from header options
        let customHeaders = this.config.core.downloadHeaders;
        if (typeof customHeaders === 'function') {
            customHeaders = customHeaders(item);
        }
        this.commonUtil.each(customHeaders, function (k: string, v: string) {
            xhr.setRequestHeader(k, v);
        });

        xhr.responseType = 'blob';
        xhr.onloadstart = function (e) {
            let that = this as BlobDownloader;
            that.changeItemStatus(item, TransferStatus.Downloading);
        }.bind(this);
        xhr.onprogress = function (e) {
            let that = this as BlobDownloader;
            if (new Date().getTime() - item.externalItem.lastProgressCallback.getTime() > that.throttleProgressCallbacks * 1000) {
                item.externalItem.progress = e.loaded / e.total;
                that.updateItemProgress(item, item.externalItem.progress);
                that.updateOverallProgress(that.transferType, that.getProgress());
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
            let that = this as BlobDownloader;
            if (xhr.readyState === 4) {
                item.externalItem.progress = 1;
                that.updateItemProgress(item, item.externalItem.progress);
                if (xhr.status === 200) {
                    that.changeItemStatus(item, TransferStatus.Finished);
                    saveAs(xhr.response, item.name);
                } else if (xhr.status !== 0) { // don't change status for aborted items
                    that.changeItemStatus(item, TransferStatus.Failed);
                }
                that.removeItemFromArray(item, that.downloading);
                that.downloadNext();
            }
        }.bind(this);
    }

    private downloadNext(): void {
        this.updateOverallSize(this.getSize());
        this.updateOverallProgress(this.transferType, this.getProgress());
        if (this.downloading.length < this.config.core.simultaneousDownloads) {
            let item = this.queue.shift();
            if (!!item && !!item.externalItem && !!item.externalItem.xhr) {
                this.changeItemStatus(item, TransferStatus.Downloading);
                this.downloading.push(item);
                this._isWorking = this.downloading.length > 0;
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
