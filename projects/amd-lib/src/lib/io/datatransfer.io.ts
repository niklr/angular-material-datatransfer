import { IDatatransferItem } from '../models/datatransfer-item.model';
import { ConfigService } from '../services/config.service';
import { LoggerService } from '../services/logger.service';
import { GuidUtil } from '../utils/guid.util';
import { CryptoService } from '../services/crypto.service';
import { TransferStatus } from '../enums/transfer-status.enum';
import { TransferType } from '../enums/transfer-type.enum';
import { IStreamHashContainer, StreamHashContainer } from '../models/hash-container.model';
import { HashTypeImplementation, HashTypeExtensions } from '../enums/hash-type.enum';
import { EncodingTypeImplementation, EncodingTypeExtensions } from '../enums/encoding-type.enum';

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

export abstract class BaseDatatransfer implements IDatatransfer {

    private events = [];
    protected _isWorking = false;

    constructor(protected logger: LoggerService,
                protected guidUtil: GuidUtil,
                protected cryptoService: CryptoService) {
    }

    public on(event: string, callback: Function): void {
        this.events.push(event.toLowerCase(), callback);
    }

    protected fire(...args: any[]): void {
        const event = args[0].toLowerCase();
        // Find event listeners, and support pseudo-event `catchAll`
        for (let i = 0; i <= this.events.length; i += 2) {
            if (this.events[i] === event) {
                this.events[i + 1].apply(this, args.slice(1));
            }
            if (this.events[i] === 'catchall') {
                this.events[i + 1].apply(null, args);
            }
        }
    }

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

    protected preprocessHash(item: IDatatransferItem, file: File, continueCallback: Function, cancelCallback: Function): void {
        const successCallback = function(container: IStreamHashContainer) {
            const that = this as BaseDatatransfer;
            if (container.hashString) {
                // const seconds = (container.endDate.getTime() - container.startDate.getTime()) / 1000;
                // console.log('file hashing took ' + seconds + ' seconds');

                const xhr = new XMLHttpRequest();

                const responseHandler = function(e) {
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
                        [ConfigService.settings.core.preprocessHashParameterName, container.hashString],
                        [ConfigService.settings.core.preprocessHashFileNameParameterName, item.name]
                    ]
                        .map(function(pair) {
                            return [
                                pair[0], encodeURIComponent(pair[1])
                            ].join('=');
                        })
                );

                xhr.open(ConfigService.settings.core.preprocessHashMethod, ConfigService.settings.core.getTarget('preprocessHash', params));
                xhr.send(null);

            } else {
                continueCallback();
            }
        }.bind(this);
        const errorCallback = function(event: any, container: IStreamHashContainer) {
            console.log(event);
            continueCallback();
        };

        if (!item.preprocessContainer.isCancelled() && item.preprocessContainer instanceof StreamHashContainer) {
            // continue
        } else {
            const hashType = HashTypeExtensions.toEnum(
                HashTypeImplementation.Internal, ConfigService.settings.core.preprocessHashFunctionName);
            const encodingType = EncodingTypeExtensions.toEnum(
                EncodingTypeImplementation.Internal, ConfigService.settings.core.preprocessHashEncodingName);
            const inputEncodingType = EncodingTypeExtensions.toEnum(
                EncodingTypeImplementation.Internal, ConfigService.settings.core.preprocessHashInputEncodingName);

            item.preprocessContainer = this.cryptoService.createStreamHashContainer(
                file, hashType, encodingType, inputEncodingType, successCallback, errorCallback);
        }

        // wait for the initial mat-progress-spinner animation to complete
        setTimeout(function() {
            item.preprocessContainer.run();
        }, 1000);
    }
}
