import { ReflectiveInjector } from '@angular/core';
import { DecimalByteUnit } from '../enums';
import { DecimalByteUnitUtil } from '../utils';

export interface ISizeInformation {
    displayUnit: string;
    displaySize: number;
    decimalByteUnit: DecimalByteUnit;
    decimalByteUnitSize: number;
}

export class SizeInformation implements ISizeInformation {
    public displayUnit: string;
    public displaySize: number;
    public decimalByteUnit: DecimalByteUnit = DecimalByteUnit.MB;
    public decimalByteUnitSize = 0;

    public constructor(init?: Partial<SizeInformation>) {
        let injector = ReflectiveInjector.resolveAndCreate([DecimalByteUnitUtil]);
        let decimalByteUnitUtil: DecimalByteUnitUtil = injector.get(DecimalByteUnitUtil);

        if (!!decimalByteUnitUtil && !!init && !!init.decimalByteUnitSize) {
            let convertResult: [DecimalByteUnit, number] =
                decimalByteUnitUtil.toHumanReadable(init.decimalByteUnitSize, init.decimalByteUnit);

            this.decimalByteUnit = convertResult[0];
            this.decimalByteUnitSize = convertResult[1];

            this.displayUnit = DecimalByteUnit[this.decimalByteUnit];
            this.displaySize = this.decimalByteUnitSize;
        }
    }
}
