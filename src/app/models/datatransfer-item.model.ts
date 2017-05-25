import { ISizeInformation, SizeInformation, IProgressInformation, ProgressInformation } from '.';
import { TransferType, TransferStatus } from '../enums';

export interface IDatatransferItem {
  id: string;
  name: string;
  path: string;
  sizeInformation: ISizeInformation;
  transferType: TransferType;
  status: TransferStatus;
  progressInformation: IProgressInformation;
  isSelected?: boolean;
  externalItem?: any;
}

export class DatatransferItem implements IDatatransferItem {
  public id: string;
  public name: string;
  public path: string;
  public sizeInformation: ISizeInformation;
  public transferType: TransferType;
  public status: TransferStatus;
  public progressInformation: IProgressInformation;
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
