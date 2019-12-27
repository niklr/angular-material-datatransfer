import { Injectable } from '@angular/core';
import { BaseExporter } from './base.exporter';
import { LoggerService } from '../../services/logger.service';
import { DatatransferStore } from '../../stores/datatransfer.store';

@Injectable()
export class CsvExporter extends BaseExporter {

    constructor(protected logger: LoggerService, protected store: DatatransferStore) {
        super(logger, store);
    }

    public export(): void {
        let csvContent = 'name,path,status,size,message\n';
        const items = this.store.getItems();
        items.forEach((item, index) => {
            const itemString = item.name + ',' + item.path + ',' + item.getStatusName() + ',' + item.sizeContainer.displaySize + ' ' +
                item.sizeContainer.displayUnit + ',' + item.message;

            csvContent += index < items.length ? itemString + '\n' : itemString;
        });

        this.download(csvContent, 'export.csv', 'text/csv;encoding:utf-8');
    }
}
