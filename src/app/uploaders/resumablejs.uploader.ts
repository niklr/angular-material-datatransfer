import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import * as Resumable from 'resumablejs';

import { BaseUploader } from './base.uploader';
import { LoggerService } from '../services';
import { IDatatransferItem } from '../models';
import { DecimalByteUnitUtil } from '../utils';
import { DecimalByteUnit } from '../enums';

@Injectable()
export class ResumableJsUploader extends BaseUploader {

    private r = undefined;

    constructor(protected logger: LoggerService, protected decimalByteUnitUtil: DecimalByteUnitUtil) {
        super(logger, decimalByteUnitUtil);
        this.initResumable();
    }

    private initResumable(): void {
        this.r = new Resumable({
            target: '/echo/json/',
            query: {},
            maxChunkRetries: 2,
            maxFiles: 10,
            prioritizeFirstAndLastChunk: true,
            simultaneousUploads: 2,
            chunkSize: 1 * 1024 * 1024
        });

        this.r.on('fileAdded', function (file, event) {
            let convertResult: [DecimalByteUnit, number] = this.decimalByteUnitUtil.toHumanReadable(file.size, DecimalByteUnit.Byte);
            let newItem: IDatatransferItem = {
                'name': file.fileName,
                'path': file.relativePath.substr(0, file.relativePath.length - file.fileName.length),
                'size': convertResult[1],
                'sizeUnit': DecimalByteUnit[convertResult[0]],
                'transferType': 'Upload',
                'status': 'Queued',
                'progress': 0,
                'externalItem': file
            };

            this.logger.log(newItem);
            this.addItem(newItem);
        }.bind(this));
        this.r.on('fileSuccess', function (file, message) {

        });
        this.r.on('fileError', function (file, message) {

        });
    }

    public assignBrowse(element): void {
        this.r.assignBrowse(element);
    }

    public assignDrop(element): void {
        this.r.assignDrop(element);
    }

    public removeAll(): void {
        let tempFiles = this.r.files.slice();
        _.each(tempFiles, function (file) {
            this.r.removeFile(file);
        }.bind(this));
        super.removeAll();
    }
}
