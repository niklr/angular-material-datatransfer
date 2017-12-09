import { ISizeContainer, SizeContainer, IPreprocessContainer, PreprocessContainer, IProgressContainer, ProgressContainer } from '.';
import { TransferType, TransferStatus } from '../enums';

export interface IDatatransferItem {
  id: string;
  name: string;
  path: string;
  displayPath: string;
  sizeContainer: ISizeContainer;
  transferType: TransferType;
  status: TransferStatus;
  preprocessContainer: IPreprocessContainer;
  progressContainer: IProgressContainer;
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
  public sizeContainer: ISizeContainer;
  public transferType: TransferType;
  public status: TransferStatus;
  public preprocessContainer: IPreprocessContainer;
  public progressContainer: IProgressContainer;
  public message?: string;
  public isSelected?: boolean;
  public externalItem?: any;

  public constructor(init?: Partial<DatatransferItem>) {
    this.sizeContainer = new SizeContainer();
    this.preprocessContainer = new PreprocessContainer();
    this.progressContainer = new ProgressContainer(0);
    Object.assign(this, init);
  }

  public getStatusName(): string {
    return TransferStatus[this.status];
  }

  public getTransferTypeName(): string {
    return TransferType[this.transferType];
  }
}
