import { Injectable } from '@angular/core';
import * as Resumable from 'resumablejs';
import { BaseUploader } from './base.uploader';
import { ConfigService } from '../../services/config.service';
import { LoggerService } from '../../services/logger.service';
import { GuidUtil } from '../../utils/guid.util';
import { CryptoService } from '../../services/crypto.service';
import { TransferStatus } from '../../enums/transfer-status.enum';
import { DatatransferItem, IDatatransferItem } from '../../models/datatransfer-item.model';
import { SizeContainer } from '../../models/size-container.model';
import { DecimalByteUnit } from '../../enums/decimal-byte-unit.enum';
import { ProgressContainer } from '../../models/progress-container.model';
import { TransferType } from '../../enums/transfer-type.enum';

@Injectable()
export class ResumableJsUploader extends BaseUploader {

    private r: Resumable.Resumable = undefined;
    private preprocessFileFn = undefined;
    private preprocessChunkFn = undefined;

    constructor(protected logger: LoggerService,
                protected guidUtil: GuidUtil,
                protected cryptoService: CryptoService) {
        super(logger, guidUtil, cryptoService);
        this.initResumable();
    }

    private initResumable(): void {
        function generateId(file, event) {
            const that = this as ResumableJsUploader;
            return that.generateUniqueIdentifier();
        }

        function preprocessChunkInlineFn(resumableChunk) {
            const that = this as ResumableJsUploader;
            if (typeof that.preprocessChunkFn === 'function') {
                that.preprocessChunkFn(resumableChunk);
            } else {
                resumableChunk.preprocessFinished();
            }
        }

        function preprocessFileInlineFn(resumableFile) {
            const that = this as ResumableJsUploader;
            if (typeof that.preprocessFileFn === 'function') {
                that.changeItemStatus(resumableFile.internalItem, TransferStatus.Preprocessing);
                that.preprocessFileFn(resumableFile);
            } else {
                if (ConfigService.settings.core.preprocessHashEnabled && ConfigService.settings.core.preprocessHashChecked) {
                    that.changeItemStatus(resumableFile.internalItem, TransferStatus.Preprocessing);
                    const continueCallback = function() {
                        resumableFile.preprocessFinished();
                    };
                    const cancelCallback = function() {
                        resumableFile.cancel();
                        that.changeItemStatus(resumableFile.internalItem, TransferStatus.Finished, resumableFile.internalItem.message);
                        that.r.uploadNextChunk();
                    };
                    that.preprocessHash(resumableFile.internalItem, resumableFile.file, continueCallback, cancelCallback);
                } else {
                    resumableFile.preprocessFinished();
                }
            }
        }

        ConfigService.settings.resumablejs.generateUniqueIdentifier = generateId.bind(this);

        if (typeof ConfigService.settings.resumablejs.preprocess === 'function') {
            // clones the function with '{}' acting as it's new 'this' parameter
            this.preprocessChunkFn = ConfigService.settings.resumablejs.preprocess.bind({});
        }
        ConfigService.settings.resumablejs.preprocess = preprocessChunkInlineFn.bind(this);

        if (typeof ConfigService.settings.resumablejs.preprocessFile === 'function') {
            // clones the function with '{}' acting as it's new 'this' parameter
            this.preprocessFileFn = ConfigService.settings.resumablejs.preprocessFile.bind({});
        }
        ConfigService.settings.resumablejs.preprocessFile = preprocessFileInlineFn.bind(this);

        // @ts-ignore: ignore type checking
        this.r = new Resumable(ConfigService.settings.resumablejs);

        this.r.on('fileAdded', function(file, event) {
            const that = this as ResumableJsUploader;
            // that.logger.log('fileAdded', file);
            const newItem = new DatatransferItem({
                id: file.uniqueIdentifier,
                name: file.fileName,
                path: file.relativePath.substr(0, file.relativePath.length - file.fileName.length),
                sizeContainer: new SizeContainer({ decimalByteUnit: DecimalByteUnit.Byte, decimalByteUnitSize: file.size }),
                progressContainer: new ProgressContainer(file.size),
                transferType: TransferType.Upload,
                status: TransferStatus.Ready,
                externalItem: file
            });
            file.internalItem = newItem;
            that.addItem(newItem);
        }.bind(this));
        this.r.on('fileProgress', function(file, message) {
            const that = this as ResumableJsUploader;
            // that.logger.log('fileProgress', file.progress());
            that.changeItemStatus(file.internalItem, TransferStatus.Uploading);
            that.updateItemProgress(file.internalItem, file.progress());
            that.updateOverallProgress(that.transferType, that.r.progress());
        }.bind(this));
        this.r.on('fileSuccess', function(file, message) {
            const that = this as ResumableJsUploader;
            // that.logger.log('fileSuccess', file);
            that.changeItemStatus(file.internalItem, TransferStatus.Finished, message);
        }.bind(this));
        this.r.on('fileError', function(file, message) {
            const that = this as ResumableJsUploader;
            // that.logger.log('fileError', file, message);
            that.changeItemStatus(file.internalItem, TransferStatus.Failed, message);
        }.bind(this));
        this.r.on('uploadStart', function() {
            const that = this as ResumableJsUploader;
            // that.logger.log('uploadStart', that.r);
            that._isWorking = true;
            that.updateZone();
            that.updateOverallProgress(that.transferType, that.r.progress());
            that.updateOverallSize(that.r.getSize());
        }.bind(this));
        this.r.on('chunkingComplete', function() {
            const that = this as ResumableJsUploader;
            // that.logger.log('chunkingComplete');
        }.bind(this));
        this.r.on('pause', function() {
            const that = this as ResumableJsUploader;
            // that.logger.log('pause');
            that._isWorking = false;
            that.updateZone();
        }.bind(this));
        this.r.on('cancel', function() {
            const that = this as ResumableJsUploader;
            // that.logger.log('cancel');
            that._isWorking = false;
            that.updateZone();
        }.bind(this));
        this.r.on('complete', function() {
            const that = this as ResumableJsUploader;
            // that.logger.log('complete', that.r);
            that._isWorking = false;
            that.updateZone();
        }.bind(this));
    }

    public assignBrowse(element, isDirectory): void {
        this.r.assignBrowse(element, isDirectory);
    }

    public assignDrop(element): void {
        this.r.assignDrop(element);
    }

    public editPath(oldPath: string, newPath: string): void {
        super.editPath(oldPath, newPath);
        this.r.files.forEach((file: any, index) => {
            const internalItem = file.internalItem as IDatatransferItem;
            if (internalItem.status === TransferStatus.Ready && internalItem.path === oldPath) {
                file.relativePath = newPath + file.fileName;
                internalItem.path = newPath;
            }
        });
    }

    public editFilename(item: IDatatransferItem, name: string): void {
        super.editFilename(item, name);
        item.externalItem.fileName = name;
        item.externalItem.relativePath = item.path + name;
        item.name = name;
    }

    public startAll(): void {
        this.r.upload();
    }

    public pauseAll(): void {
        // reset preprocessState
        this.r.files.forEach((file: any, index) => {
            if (file.preprocessState === 1) {
                file.preprocessState = 0;
            }
        });
        this.r.pause();
    }

    public removeAll(): void {
        const tempFiles = this.r.files.slice();
        tempFiles.forEach((file: any, index) => {
            const that = this as ResumableJsUploader;
            that.r.removeFile(file);
        });
        this._isWorking = false;
    }

    public removeItem(item: IDatatransferItem): void {
        this.r.removeFile(item.externalItem);
        if (this.r.files.length <= 0) {
            this._isWorking = false;
        }
    }

    public retryItem(item: IDatatransferItem): void {
        item.externalItem.retry();
    }
}
