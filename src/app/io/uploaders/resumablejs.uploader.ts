import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import * as Resumable from 'resumablejs';

import { BaseUploader } from './base.uploader';
import { LoggerService } from '../../services';
import { IAppConfig, IDatatransferItem, DatatransferItem, SizeInformation, ProgressInformation } from '../../models';
import { TransferType, TransferStatus, DecimalByteUnit } from '../../enums';
import { GuidUtil } from '../../utils';

@Injectable()
export class ResumableJsUploader extends BaseUploader {

    private r = undefined;

    constructor(protected logger: LoggerService, protected config: IAppConfig, protected guidUtil: GuidUtil) {
        super(logger, config, guidUtil);
        this.initResumable();
    }

    private initResumable(): void {

        function generateId(file, event) {
            return this.generateUniqueIdentifier();
        }

        this.config.resumablejs.generateUniqueIdentifier = generateId.bind(this);

        this.r = new Resumable(this.config.resumablejs);

        this.r.on('fileAdded', function (file, event) {
            let newItem = new DatatransferItem({
                id: file.uniqueIdentifier,
                name: file.fileName,
                path: file.relativePath.substr(0, file.relativePath.length - file.fileName.length),
                sizeInformation: new SizeInformation({ decimalByteUnit: DecimalByteUnit.Byte, decimalByteUnitSize: file.size }),
                progressInformation: new ProgressInformation(file.size),
                transferType: TransferType.Upload,
                status: TransferStatus.Added,
                externalItem: file
            });
            file.internalItem = newItem;

            this.addItem(newItem);
        }.bind(this));
        this.r.on('fileProgress', function (file, message) {
            // this.logger.log('fileProgress', file.progress());
            this.changeItemStatus(file.internalItem, TransferStatus.Uploading);
            this.updateItemProgress(file.internalItem, file.progress());
            this.updateOverallProgress(this.r.progress());
        }.bind(this));
        this.r.on('fileSuccess', function (file, message) {
            // this.logger.log('fileSuccess', file);
            this.changeItemStatus(file.internalItem, TransferStatus.Finished, message);
        }.bind(this));
        this.r.on('fileError', function (file, message) {
            this.logger.log('fileError', file, message);
            this.changeItemStatus(file.internalItem, TransferStatus.Failed, message);
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
        // this.r.assignDrop(element);
        if (typeof (element.length) === 'undefined') {
            element = [element];
        }
        this.each(element, function (e) {
            e.addEventListener('dragover', this.preventDefault, false);
            e.addEventListener('dragenter', this.preventDefault, false);
            e.addEventListener('drop', this.onDrop.bind(this), false);
        }.bind(this));
    }

    public isWorking(): boolean {
        return this.r.isUploading();
    }

    public startAll(): void {
        this.r.upload();
    }

    public pauseAll(): void {
        this.r.pause();
    }

    public removeAll(): void {
        let tempFiles = this.r.files.slice();
        _.each(tempFiles, function (file) {
            this.r.removeFile(file);
        }.bind(this));
    }

    public removeItem(item: IDatatransferItem): void {
        this.r.removeFile(item.externalItem);
    }

    public retryItem(item: IDatatransferItem): void {
        item.externalItem.retry();
    }
}
