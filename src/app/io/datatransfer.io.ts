import { Injectable } from '@angular/core';
import * as _ from 'underscore';

import { LoggerService, CryptoService } from '../services';
import { IAppConfig, IDatatransferItem, IStreamHashContainer, StreamHashContainer } from '../models';
import { TransferStatus, TransferType, HashType, EncodingType, HashTypeImplementation, EncodingTypeImplementation } from '../enums';
import { GuidUtil } from '../utils';

export interface IDatatransfer {
    on(event: string, callback: Function): void;
    isWorking(): boolean;
    startAll(): void;
    pauseAll(): void;
    removeAll(): void;
    addItem(item: IDatatransferItem): void;
    removeItem(item: IDatatransferItem): void;
    retryItem(item: IDatatransferItem): void;
}

@Injectable()
export abstract class BaseDatatransfer implements IDatatransfer {

    private events = [];
    private readonly hashType: HashType;
    private readonly encodingType: EncodingType;
    private readonly inputEncodingType: EncodingType;
    protected _isWorking = false;

    constructor(protected logger: LoggerService, protected config: IAppConfig,
        protected guidUtil: GuidUtil, protected cryptoService: CryptoService) {
        this.hashType = HashType.toEnum(HashTypeImplementation.Internal, config.core.checkHashFunctionName);
        this.encodingType = EncodingType.toEnum(EncodingTypeImplementation.Internal, config.core.checkHashEncodingName);
        this.inputEncodingType = EncodingType.toEnum(EncodingTypeImplementation.Internal, config.core.checkHashInputEncodingName);
    }

    public on(event: string, callback: Function): void {
        this.events.push(event.toLowerCase(), callback);
    }

    protected fire(...args: any[]): void {
        let event = args[0].toLowerCase();
        // Find event listeners, and support pseudo-event `catchAll`
        for (let i = 0; i <= this.events.length; i += 2) {
            if (this.events[i] === event) {
                this.events[i + 1].apply(this, args.slice(1));
            }
            if (this.events[i] === 'catchall') {
                this.events[i + 1].apply(null, args);
            }
        }
    };

    protected updateZone(): void {
        this.fire('zoneUpdated');
    }

    protected changeItemStatus(item: IDatatransferItem, status: TransferStatus, message?: string) {
        this.fire('itemStatusChanged', item, status, message);
    }

    protected updateItemProgress(item: IDatatransferItem, progress: number): void {
        this.fire('itemProgressUpdated', item, progress);
    }

    protected updateOverallProgress(transferType: TransferType, progress: number): void {
        this.fire('overallProgressUpdated', transferType, progress);
    }

    protected updateOverallSize(size: number): void {
        this.fire('overallSizeUpdated', size);
    }

    public isWorking(): boolean {
        return this._isWorking;
    }

    public abstract startAll(): void;

    public abstract pauseAll(): void;

    public abstract removeAll(): void;

    public addItem(item: IDatatransferItem): void {
        this.fire('itemAdded', item);
    }

    public abstract removeItem(item: IDatatransferItem): void;

    public abstract retryItem(item: IDatatransferItem): void;

    protected generateUniqueIdentifier(): string {
        return this.guidUtil.createGuid();
    }

    protected checkHash(item: IDatatransferItem, file: File, continueCallback: Function, cancelCallback: Function): void {
        let successCallback = function (container: IStreamHashContainer) {
            let that = this as BaseDatatransfer;
            if (container.hashString) {
                let seconds = (container.endDate.getTime() - container.startDate.getTime()) / 1000;
                // console.log('file hashing took ' + seconds + ' seconds');

                let xhr = new XMLHttpRequest();

                let responseHandler = function (e) {
                    // ignore response if container has been cancelled
                    if (!container.isCancelled()) {
                        if (xhr.status === 200) {
                            item.message = xhr.responseText;
                            cancelCallback();
                        } else {
                            continueCallback();
                        }
                    }
                };
                xhr.addEventListener('load', responseHandler, false);
                xhr.addEventListener('error', responseHandler, false);
                xhr.addEventListener('timeout', responseHandler, false);

                let params = [];
                params = params.concat(
                    [
                        [that.config.core.checkHashParameterName, container.hashString]
                    ]
                    .map(function (pair) {
                        return [
                            pair[0], encodeURIComponent(pair[1])
                        ].join('=');
                    })
                );

                xhr.open(that.config.core.checkHashMethod, that.config.core.getTarget('checkHash', params));
                xhr.send(null);

            } else {
                continueCallback();
            }
        }.bind(this);
        let errorCallback = function (event: any, container: IStreamHashContainer) {
            console.log(event);
            continueCallback();
        };

        if (!item.preprocessContainer.isCancelled() && item.preprocessContainer instanceof StreamHashContainer) {
            // continue
        } else {
            item.preprocessContainer = this.cryptoService.createStreamHashContainer(
                file, this.hashType, this.encodingType, this.inputEncodingType, successCallback, errorCallback);
        }

        // wait for the initial mat-progress-spinner animation to complete
        setTimeout(function () {
            item.preprocessContainer.run();
        }, 1000);
    }
}
