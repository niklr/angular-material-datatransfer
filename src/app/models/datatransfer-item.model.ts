import { ISizeInformation, SizeInformation, IProgressInformation, ProgressInformation } from '.';
import { TransferType, TransferStatus } from '../enums';

export interface IDatatransferItem {
  id: string;
  name: string;
  path: string;
  displayPath: string;
  sizeInformation: ISizeInformation;
  transferType: TransferType;
  status: TransferStatus;
  progressInformation: IProgressInformation;
  message?: string;
  isSelected?: boolean;
  externalItem?: any;
  getStatusName(): string;
  getTransferTypeName(): string;
}

export class DatatransferItem implements IDatatransferItem {
  public id: string;
  public name: string;
  private _path: string;
  get path(): string {
    return this._path;
  }
  set path(newPath: string) {
      this._path = newPath;
      this.displayPath = newPath;
      if (this.displayPath) {
        // remove last character
        if (this.displayPath.endsWith('/')) {
          this.displayPath = this.displayPath.slice(0, -1);
        }
        // replace all '/' with ' > '
        this.displayPath = this.displayPath.replace(/\//g, ' > ');
      }
  }
  public displayPath: string;
  public sizeInformation: ISizeInformation;
  public transferType: TransferType;
  public status: TransferStatus;
  public progressInformation: IProgressInformation;
  public message?: string;
  public isSelected?: boolean;
  public externalItem?: any;

  public constructor(init?: Partial<DatatransferItem>) {
    this.sizeInformation = new SizeInformation();
    this.progressInformation = new ProgressInformation(0);
    Object.assign(this, init);
  }

  public getStatusName(): string {
    return TransferStatus[this.status];
  }

  public getTransferTypeName(): string {
    return TransferType[this.transferType];
  }
}
