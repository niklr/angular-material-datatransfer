import { Injectable } from '@angular/core';

import { IDatatransfer, BaseDatatransfer } from '..';
import { IAppConfig, IDatatransferItem } from '../../models';
import { LoggerService, CryptoService } from '../../services';
import { TransferType } from '../../enums';
import { GuidUtil } from '../../utils';

export interface IUploader extends IDatatransfer {
    assignBrowse(element, isDirectory): void;
    assignDrop(element): void;
    editPath(oldPath: string, newPath: string): void;
    editFilename(item: IDatatransferItem, name: string): void;
}

@Injectable()
export abstract class BaseUploader extends BaseDatatransfer {

    private filenameRegExp = new RegExp('[\/\\\\*?"<>:|]');
    private pathRegExp = new RegExp('[*?"<>:|]');
    protected transferType = TransferType.Upload;

    constructor(protected logger: LoggerService, protected config: IAppConfig,
        protected guidUtil: GuidUtil, protected cryptoService: CryptoService) {
        super(logger, config, guidUtil, cryptoService);
    }

    protected abstract addFiles(files): void;

    public abstract assignBrowse(element, isDirectory): void;

    public abstract assignDrop(element): void;

    public editPath(oldPath: string, newPath: string): void {
        if (this.pathRegExp.test(newPath)) {
            throw 'A path cannot contain any of the following characters: * ? " < > : |';
        }
    }

    public editFilename(item: IDatatransferItem, name: string): void {
        if (!item) {
            throw 'Cannot edit the filename.';
        }
        if (!name) {
            throw 'Empty filename is not allowed.';
        }
        if (this.filenameRegExp.test(name)) {
            throw 'A filename cannot contain any of the following characters: \\ / * ? " < > : |';
        }
    }
}
