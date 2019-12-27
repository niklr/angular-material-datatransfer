import { IDatatransfer, BaseDatatransfer } from '../datatransfer.io';
import { IDatatransferItem } from '../../models/datatransfer-item.model';
import { TransferType } from '../../enums/transfer-type.enum';
import { LoggerService } from '../../services/logger.service';
import { GuidUtil } from '../../utils/guid.util';
import { CryptoService } from '../../services/crypto.service';

export interface IUploader extends IDatatransfer {
    assignBrowse(element: any, isDirectory: any): void;
    assignDrop(element: any): void;
    editPath(oldPath: string, newPath: string): void;
    editFilename(item: IDatatransferItem, name: string): void;
}

export abstract class BaseUploader extends BaseDatatransfer {

    private filenameRegExp = new RegExp('[\/\\\\*?"<>:|]');
    private pathRegExp = new RegExp('[*?"<>:|]');
    protected transferType = TransferType.Upload;

    constructor(protected logger: LoggerService,
                protected guidUtil: GuidUtil,
                protected cryptoService: CryptoService) {
        super(logger, guidUtil, cryptoService);
    }

    public abstract assignBrowse(element: any, isDirectory: any): void;

    public abstract assignDrop(element: any): void;

    public editPath(oldPath: string, newPath: string): void {
        if (this.pathRegExp.test(newPath)) {
            throw new Error('A path cannot contain any of the following characters: * ? " < > : |');
        }
    }

    public editFilename(item: IDatatransferItem, name: string): void {
        if (!item) {
            throw new Error('Cannot edit the filename.');
        }
        if (!name) {
            throw new Error('Empty filename is not allowed.');
        }
        if (this.filenameRegExp.test(name)) {
            throw new Error('A filename cannot contain any of the following characters: \\ / * ? " < > : |');
        }
    }
}
