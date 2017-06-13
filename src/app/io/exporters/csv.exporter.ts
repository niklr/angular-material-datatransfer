import { Injectable } from '@angular/core';

import { BaseExporter } from './base.exporter';
import { DatatransferStore } from '../../stores';
import { LoggerService } from '../../services';
import { IDatatransferItem } from '../../models';

import * as _ from 'underscore';

@Injectable()
export class CsvExporter extends BaseExporter {

    constructor(protected logger: LoggerService, protected store: DatatransferStore) {
        super(logger, store);
    }

    public export(): void {
        let csvContent = 'name,status,size,message\n';
        let items = this.store.getItems();
        _.each(items, function (item: IDatatransferItem, index: number) {
            let itemString = item.name + ',' + item.getStatusName() + ',' + item.sizeInformation.displaySize + ' ' +
                item.sizeInformation.displayUnit + ',' + item.message;

            csvContent += index < items.length ? itemString + '\n' : itemString;
        });

        this.download(csvContent, 'export.csv', 'text/csv;encoding:utf-8');
    }
}
