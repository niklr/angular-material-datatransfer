import { ReflectiveInjector } from '@angular/core';
import { DecimalByteUnit } from '../enums/decimal-byte-unit.enum';
import { DecimalByteUnitUtil } from '../utils/decimal-byte-unit.util';

export interface ISizeContainer {
    displayUnit: string;
    displaySize: number;
    decimalByteUnit: DecimalByteUnit;
    decimalByteUnitSize: number;
    update(init?: Partial<SizeContainer>): void;
    updateDecimal(decimalByteUnit: DecimalByteUnit, decimalByteUnitSize: number): void;
}

export class SizeContainer implements ISizeContainer {

    private decimalByteUnitUtil: DecimalByteUnitUtil;

    public displayUnit: string;
    public displaySize: number;
    public decimalByteUnit: DecimalByteUnit = DecimalByteUnit.MB;
    public decimalByteUnitSize = 0;

    public constructor(init?: Partial<SizeContainer>) {
        let injector = ReflectiveInjector.resolveAndCreate([DecimalByteUnitUtil]);
        this.decimalByteUnitUtil = injector.get(DecimalByteUnitUtil);
        this.update(init);
    }

    public update(init?: Partial<SizeContainer>): void {
        if (!!this.decimalByteUnitUtil && !!init && !!init.decimalByteUnitSize) {
            this.updateDecimal(init.decimalByteUnit, init.decimalByteUnitSize);
        }
    }

    public updateDecimal(decimalByteUnit: DecimalByteUnit, decimalByteUnitSize: number): void {
        let convertResult: [DecimalByteUnit, number] =
            this.decimalByteUnitUtil.format(decimalByteUnitSize, decimalByteUnit);

        this.decimalByteUnit = convertResult[0];
        this.decimalByteUnitSize = convertResult[1];

        this.displayUnit = DecimalByteUnit[this.decimalByteUnit];
        this.displaySize = !!this.decimalByteUnitSize ? this.decimalByteUnitSize : 0;
    }
}
