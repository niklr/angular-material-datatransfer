import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import * as Resumable from 'resumablejs';

import { BaseUploader } from './base.uploader';
import { LoggerService } from '../../services';
import { IDatatransferItem, DatatransferItem, SizeInformation, ProgressInformation } from '../../models';
import { TransferType, TransferStatus, DecimalByteUnit } from '../../enums';
import { GuidUtil } from '../../utils';

@Injectable()
export class ResumableJsUploader extends BaseUploader {

    private r = undefined;

    constructor(protected logger: LoggerService, protected guidUtil: GuidUtil) {
        super(logger, guidUtil);
        this.initResumable();
    }

    private initResumable(): void {

        function generateId(file, event) {
            return this.generateUniqueIdentifier();
        }

        this.r = new Resumable({
            target: '/echo/json/',
            query: {},
            maxChunkRetries: 2,
            prioritizeFirstAndLastChunk: false,
            simultaneousUploads: 2,
            chunkSize: 1 * 1024 * 1024,
            generateUniqueIdentifier: generateId.bind(this)
        });

        this.r.on('fileAdded', function (file, event) {
            let newItem = new DatatransferItem({
                id: file.uniqueIdentifier,
                name: file.fileName,
                path: file.relativePath.substr(0, file.relativePath.length - file.fileName.length),
                sizeInformation: new SizeInformation({ decimalByteUnit: DecimalByteUnit.Byte, decimalByteUnitSize: file.size }),
                progressInformation: new ProgressInformation(file.size),
                transferType: TransferType.Upload,
                status: TransferStatus.Queued,
                externalItem: file
            });

            this.addItem(newItem);
        }.bind(this));
        this.r.on('fileProgress', function (file, message) {
            // this.logger.log('fileProgress', file.progress());
            this.updateItemProgress(file.uniqueIdentifier, file.progress());
            this.updateOverallProgress(this.r.progress());
        }.bind(this));
        this.r.on('fileSuccess', function (file, message) {
            // this.logger.log('fileSuccess', file);
            this.changeItemStatus(file.uniqueIdentifier, TransferStatus.Finished, message);
        }.bind(this));
        this.r.on('fileError', function (file, message) {
            this.logger.log('fileError', file, message);
            this.changeItemStatus(file.uniqueIdentifier, TransferStatus.Failed, message);
        }.bind(this));
        this.r.on('uploadStart', function () {
            this.updateOverallProgress(this.r.progress());
            this.updateOverallSize(this.r.getSize());
        }.bind(this));
        this.r.on('chunkingComplete', function () {
            // this.logger.log('chunkingComplete');
        }.bind(this));
        this.r.on('complete', function () {
            this.updateOverallProgress(this.r.progress());
        }.bind(this));
    }

    public assignBrowse(element): void {
        this.r.assignBrowse(element);
    }

    public assignDrop(element): void {
        this.r.assignDrop(element);
    }

    public isWorking(): boolean {
        return this.r.isUploading();
    }

    public startAll(): void {
        this.r.upload();
        super.startAll();
    }

    public pauseAll(): void {
        this.r.pause();
        super.pauseAll();
    }

    public removeAll(): void {
        let tempFiles = this.r.files.slice();
        _.each(tempFiles, function (file) {
            this.r.removeFile(file);
        }.bind(this));
        super.removeAll();
    }

    public removeItem(item: IDatatransferItem): void {
        this.r.removeFile(item.externalItem);
    }

    public retryItem(item: IDatatransferItem): void {
        item.externalItem.retry();
    }
}
