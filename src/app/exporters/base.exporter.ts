import { Injectable } from '@angular/core';

import { LoggerService } from '../services';
import { DatatransferStore } from '../stores';
import { ExportType } from '../enums';

export interface IExporter {
    export(): void;
}

@Injectable()
export abstract class BaseExporter implements IExporter {

    constructor(protected logger: LoggerService, protected store: DatatransferStore) {

    }

    public abstract export(): void;

    protected download(content, fileName, mimeType): void {
        let a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
            navigator.msSaveBlob(new Blob([content], {
                type: mimeType
            }), fileName);
        } else if (URL && 'download' in a) {
            a.href = URL.createObjectURL(new Blob([content], {
                type: mimeType
            }));
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
    }

}
