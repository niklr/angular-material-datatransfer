import { Injectable } from '@angular/core';
import { EnumExtension } from '../extensions';
import { DecimalByteUnit } from '../enums';

@Injectable()
export class DecimalByteUnitUtil {
    C_KB: number = Math.pow(10, 3);
    C_MB: number = Math.pow(10, 6);
    C_GB: number = Math.pow(10, 9);
    C_TB: number = Math.pow(10, 12);
    C_PB: number = Math.pow(10, 15);

    MAX: number = Number.MAX_VALUE;

    byteUnits = EnumExtension.getNames(DecimalByteUnit);

    private multiply(number: number, multiplier: number): number {
        let limit: number = this.MAX / multiplier;

        if (number > limit) {
            return Number.MAX_VALUE;
        }
        if (number < -limit) {
            return Number.MIN_VALUE;
        }

        return number * multiplier;
    }

    public convert(number: number, fromUnit: DecimalByteUnit, toUnit: DecimalByteUnit): number {
        let bytes: number = this.toBytes(number, fromUnit);
        switch (toUnit) {
            case DecimalByteUnit.Byte:
                return bytes;
            case DecimalByteUnit.KB:
                return bytes / this.C_KB;
            case DecimalByteUnit.MB:
                return bytes / this.C_MB;
            case DecimalByteUnit.GB:
                return bytes / this.C_GB;
            case DecimalByteUnit.TB:
                return bytes / this.C_TB;
            case DecimalByteUnit.PB:
                return bytes / this.C_PB;
        }
        return number;
    }

    public toBytes(number: number, fromUnit: DecimalByteUnit): number {
        switch (fromUnit) {
            case DecimalByteUnit.Byte:
                return number;
            case DecimalByteUnit.KB:
                return this.multiply(number, this.C_KB);
            case DecimalByteUnit.MB:
                return this.multiply(number, this.C_MB);
            case DecimalByteUnit.GB:
                return this.multiply(number, this.C_GB);
            case DecimalByteUnit.TB:
                return this.multiply(number, this.C_TB);
            case DecimalByteUnit.PB:
                return this.multiply(number, this.C_PB);
        }
        return number;
    }

    public format(number: number, fromUnit: DecimalByteUnit): [DecimalByteUnit, number] {
        let result: [DecimalByteUnit, number];
        result = [DecimalByteUnit.Byte, this.toBytes(number, fromUnit)];
        for (let currentUnit of this.byteUnits) {
            if (Math.abs(result[1]) < 1000) {
                result[0] = DecimalByteUnit[currentUnit];
                break;
            } else {
                result[1] /= 1000;
            }
        }
        result[1] = Number(result[1].toFixed(2));
        return result;
    }
}
