export interface IDatatransferItem {
  id: string;
  name: string;
  path: string;
  size: number;
  sizeUnit: string;
  transferType: string;
  status: string;
  progress: number;
  speed?: string;
  elapsedTime?: string;
  remainingTime?: string;
  isSelected?: boolean;
  externalItem?: any;
}
