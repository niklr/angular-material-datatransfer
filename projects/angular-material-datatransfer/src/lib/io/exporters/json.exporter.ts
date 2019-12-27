import { Injectable } from '@angular/core';
import { BaseExporter } from './base.exporter';
import { LoggerService } from '../../services/logger.service';
import { DatatransferStore } from '../../stores/datatransfer.store';

@Injectable()
export class JsonExporter extends BaseExporter {

    constructor(protected logger: LoggerService, protected store: DatatransferStore) {
        super(logger, store);
    }

    public export(): void {
        const content = [];
        const items = this.store.getItems();
        items.forEach((item, index) => {
            content.push({
                name: item.name,
                path: item.path,
                status: item.getStatusName(),
                size: item.sizeContainer.displaySize + ' ' + item.sizeContainer.displayUnit,
                message: item.message
            });
        });

        this.download(JSON.stringify(content, null, '\t'), 'export.json', 'text/json;encoding:utf-8');
    }
}
