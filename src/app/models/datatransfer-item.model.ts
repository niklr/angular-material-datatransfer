import { SizeInformation } from '.';
import { TransferType, TransferStatus } from '../enums';

export interface IDatatransferItem {
  id: string;
  name: string;
  path: string;
  sizeInformation: SizeInformation;
  transferType: TransferType;
  status: TransferStatus;
  progress: number;
  speed?: string;
  elapsedTime?: string;
  remainingTime?: string;
  isSelected?: boolean;
  externalItem?: any;
}

export class DatatransferItem implements IDatatransferItem {
  public id: string;
  public name: string;
  public path: string;
  public sizeInformation: SizeInformation;
  public transferType: TransferType;
  public status: TransferStatus;
  public progress: number;
  public speed?: string;
  public elapsedTime?: string;
  public remainingTime?: string;
  public isSelected?: boolean;
  public externalItem?: any;

  public constructor(init?: Partial<DatatransferItem>) {
    Object.assign(this, init);
  }

  public getStatusName(): string {
    return TransferStatus[this.status];
  }

  public getTransferTypeName(): string {
    return TransferType[this.transferType];
  }
}
