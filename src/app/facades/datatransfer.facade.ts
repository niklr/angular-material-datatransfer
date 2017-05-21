import { IUploader } from '../uploaders';
import { LoggerService } from '../services';

export class DatatransferFacade {

    private uploader: IUploader;

    constructor(private logger: LoggerService, uploader: IUploader) {
        this.uploader = uploader;
    }

    public startAll(): void {
        this.logger.log('start all');
    }

    public removeAll(): void {

    }

    public startSelected(item): void {

    }
}
