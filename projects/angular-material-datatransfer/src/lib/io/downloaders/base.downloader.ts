import { IDatatransfer, BaseDatatransfer } from '../datatransfer.io';
import { TransferType } from '../../enums/transfer-type.enum';
import { LoggerService } from '../../services/logger.service';
import { GuidUtil } from '../../utils/guid.util';
import { CryptoService } from '../../services/crypto.service';

export interface IDownloader extends IDatatransfer {
    download(filename: string, url: string, sizeInBytes: number): void;
}

export abstract class BaseDownloader extends BaseDatatransfer implements IDownloader {

    protected transferType = TransferType.Download;

    constructor(protected logger: LoggerService,
                protected guidUtil: GuidUtil,
                protected cryptoService: CryptoService) {
        super(logger, guidUtil, cryptoService);
    }

    public abstract download(filename: string, url: string, sizeInBytes: number): void;
}
