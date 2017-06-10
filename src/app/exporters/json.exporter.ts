import { Injectable } from '@angular/core';

import { BaseExporter } from './base.exporter';
import { DatatransferStore } from '../stores';
import { LoggerService } from '../services';

import * as _ from 'underscore';

@Injectable()
export class JsonExporter extends BaseExporter {

    constructor(protected logger: LoggerService, protected store: DatatransferStore) {
        super(logger, store);
    }

    public export(): void {

    }
}
