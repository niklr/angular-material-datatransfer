import { IDatatransferItem } from '../models';

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