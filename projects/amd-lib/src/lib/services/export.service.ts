import { Injectable } from '@angular/core';

import { CsvExporter } from '../io/exporters/csv.exporter';
import { JsonExporter } from '../io/exporters/json.exporter';
import { ExportType } from '../enums/export-type.enum';

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
