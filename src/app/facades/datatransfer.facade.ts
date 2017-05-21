import { IUploader } from '../uploaders';
import { LoggerService } from '../services';
import { DatatransferItemStore } from '../stores';
import { IDatatransferItem } from '../models';

export class DatatransferFacade {

    constructor(private logger: LoggerService, private store: DatatransferItemStore, private uploader: IUploader) {
        this.init();
    }

    public init(): void {
        this.uploader.on('itemAdded', function (item: IDatatransferItem) {
            this.logger.log('itemAdded');
            this.store.addItem(item);
        }.bind(this));
        this.uploader.on('removeAll', function () {
            this.logger.log('removeAll');
            this.store.clear();
        }.bind(this));
    }

    public assignUploadBrowse(element): void {
        this.uploader.assignBrowse(element);
    }

    public assignUploadDrop(element): void {
        this.uploader.assignDrop(element);
    }

    public addItem(item): void {

    }

    public startAll(): void {
        this.logger.log('start all');
    }

    public removeAll(): void {
        this.uploader.removeAll();
        this.store.clear();
    }

    public startSelected(item): void {

    }

    public showPath(items: IDatatransferItem[], index: number): boolean {
        if (index > 0 && items.length > index) {
            let currentPath = items[index].path;
            // switch (currentPath) {
            //   case undefined:
            //   case '':
            //   case '\\':
            //   case '/':
            //     return false;
            // }
            // don't show if previous path is same as current
            return items[index - 1].path !== currentPath;
        }
        return true;
    }
}
