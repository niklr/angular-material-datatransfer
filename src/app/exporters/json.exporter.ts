import { Injectable } from '@angular/core';

import { BaseExporter } from './base.exporter';
import { DatatransferStore } from '../stores';
import { LoggerService } from '../services';
import { IDatatransferItem } from '../models';

import * as _ from 'underscore';

@Injectable()
export class JsonExporter extends BaseExporter {

    constructor(protected logger: LoggerService, protected store: DatatransferStore) {
        super(logger, store);
    }

    public export(): void {
        let content = [];
        let items = this.store.getItems();
        _.each(items, function (item: IDatatransferItem, index: number) {
            content.push({
                name: item.name,
                status: item.getStatusName(),
                size: item.sizeInformation.displaySize + ' ' + item.sizeInformation.displayUnit,
                message: item.message
            });
        });

        this.download(JSON.stringify(content, null, '\t'), 'export.json', 'text/json;encoding:utf-8');
    }
}
