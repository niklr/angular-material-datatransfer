import { TransferType, TransferStatus } from '../enums';

export interface IDatatransferItem {
  id: string;
  name: string;
  path: string;
  size: number;
  sizeUnit: string;
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
  public size: number;
  public sizeUnit: string;
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
