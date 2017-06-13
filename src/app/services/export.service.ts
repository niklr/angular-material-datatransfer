import { Injectable } from '@angular/core';

import { ExportType } from '../enums';
import { IExporter, CsvExporter, JsonExporter } from '../io';

@Injectable()
export class ExportService {

    constructor(private csvExporter: CsvExporter, private jsonExporter: JsonExporter) {

    }

    public export(exportType: string): void {
        let castedExportType: ExportType = ExportType[exportType];
        switch (castedExportType) {
            case ExportType.CSV:
                this.csvExporter.export();
                break;
            case ExportType.JSON:
                this.jsonExporter.export();
                break;
            default:
                break;
        }
    }

}
